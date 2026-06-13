# Fitness App — Mobile Implementation Plan

## Background

The project is a **React (Vite) + Java Spring Boot microservices** fitness tracker. The frontend currently runs as a web app with:
- **Pages**: Login, Register, Dashboard, Activity Detail
- **State**: Redux Toolkit (auth slice) + React Context (AuthContext)
- **API Layer**: Axios with mock mode toggle (`VITE_MOCK_MODE`)
- **Backend**: 5 Spring Boot microservices (User, Activity, AI/Recommendations, Gateway, Config) + Eureka, Kafka, MongoDB, PostgreSQL — all docker-composed locally

The goal is to make this app available as a **native mobile app** while moving the entire backend to the cloud so the mobile app only needs to make HTTP calls to a hosted API gateway.

---

## Architecture Overview

```
┌─────────────────────────────────────────────┐
│              Mobile App (React Native)       │
│  - Login / Register                          │
│  - Dashboard (activities list + stats)       │
│  - Activity Detail + AI Recommendations      │
│  - Log new activity                          │
└────────────────────┬────────────────────────┘
                     │  HTTPS
                     ▼
         ┌───────────────────────┐
         │  API Gateway (Cloud)  │  ← single entry point
         │  (GCP Cloud Run or    │
         │   Railway / Render)   │
         └──────────┬────────────┘
                    │ internal routing
       ┌────────────┼────────────┐
       ▼            ▼            ▼
  [UserSvc]   [ActivitySvc]  [AISvc]
  (Postgres)  (MongoDB)      (MongoDB + Gemini)
       └────────────┴────────────┘
              Kafka (managed)
```

---

## Phase 1 — Deploy Backend to the Cloud

This is the prerequisite for everything else. No mobile app changes are needed until the backend is live and reachable via a public URL.

### 1.1 — Cloud Platform & Database Setup (Render + Aiven)

We will use:
- **Render** to deploy the service containers.
- **Aiven** to host the managed databases (PostgreSQL, MongoDB) and the message broker (Apache Kafka).

#### Databases and Kafka (Aiven Setup)
- **PostgreSQL**: Spin up a managed PostgreSQL database.
- **MongoDB**: Spin up a managed MongoDB instance.
- **Apache Kafka**: Spin up a managed Kafka cluster. Since Aiven enables SSL by default, download the Access Key (`service.key`), Access Certificate (`service.cert`), and CA Certificate (`ca.pem`). We will configure Spring Boot to read these PEM values directly using Option A (PEM SSL properties).

### 1.2 — Services to Deploy (Render Setup)

We will deploy all 5 Spring Boot microservices plus the service discovery and config infrastructure. The gateway will route to the microservices dynamically via Eureka.

| Service | Port | Depends On | Render Service Type |
|---------|------|------------|---------------------|
| `configserver` | 8888 | — | Private Service (Internal Routing) |
| `eureka` | 8761 | configserver | Private Service (Internal Routing) |
| `gateway` | 8080 | eureka, configserver | Web Service (Exposed Publicly) |
| `userservice` | 8081 | PostgreSQL, eureka | Private Service (Internal Routing) |
| `activityservice` | 8082 | MongoDB, Kafka, eureka | Private Service (Internal Routing) |
| `aiservice` | 8083 | MongoDB, Kafka, eureka, Gemini API | Private Service (Internal Routing) |

#### Files to Modify
- **`server/docker-compose.yml`**: Remove `mongodb`, `postgres`, `kafka` containers since they are external now.
- **`server/*/src/main/resources/application.yml`**: Update database and Kafka connection configs to use the environment variable placeholders.

### 1.3 — Environment Variables for Cloud Services

Set these environment variables/secrets in your Render dashboard:

#### Database & Kafka Credentials (for Services)
```env
JWT_SECRET_KEY=<strong-random-secret>
GEMINI_API_KEY=<your-gemini-key>
GEMINI_API_URL=<gemini-endpoint>

# Aiven DB & Kafka Connection Strings
SPRING_DATASOURCE_URL=jdbc:postgresql://<aiven-postgres-host>:<port>/defaultdb?sslmode=require
SPRING_DATA_MONGODB_URI=mongodb://<aiven-mongodb-uri>
SPRING_KAFKA_BOOTSTRAP_SERVERS=<aiven-kafka-uri>:<port>

# Aiven Kafka SSL Configurations (Option A - PEM format)
SPRING_KAFKA_PROPERTIES_SECURITY_PROTOCOL=SSL
SPRING_KAFKA_PROPERTIES_SSL_TRUSTSTORE_TYPE=PEM
SPRING_KAFKA_PROPERTIES_SSL_TRUSTSTORE_CERTIFICATES=<ca.pem certificate content>
SPRING_KAFKA_PROPERTIES_SSL_KEYSTORE_TYPE=PEM
SPRING_KAFKA_PROPERTIES_SSL_KEYSTORE_CERTIFICATE_CHAIN=<service.cert certificate chain content>
SPRING_KAFKA_PROPERTIES_SSL_KEYSTORE_KEY=<service.key private key content>
```

#### Eureka & Config Server Routing
Configure the microservices to find the centralized configuration and register with Eureka using internal Render URLs:
```env
SPRING_CLOUD_CONFIG_URI=http://configserver:8888
EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka:8761/eureka/
```

### 1.4 — Expose Gateway Publicly

After deployment, you will have a public Render URL like:
```
https://fitness-gateway.onrender.com
```
This is the **only URL the mobile app will ever talk to**.

**`server/gateway` changes:**
- Add CORS configurations to allow requests from mobile clients.
- Ensure JWT validation works on all protected routes.

---

## Phase 2 — Build the React Native Mobile App

### 2.1 — Technology Choice

**React Native with Expo** is the recommended approach because:
- Your team already knows React (components, hooks, Redux, React Router)
- Expo handles builds, over-the-air updates, and device APIs (camera, health sensors later)
- ~80% of your existing component logic can be reused with minor adaptations
- No need to learn Swift/Kotlin

#### New Directory Structure

```
fitness/
├── client/          ← existing web app (keep)
├── server/          ← existing backend
└── mobile/          ← NEW React Native Expo app
    ├── app/         ← screens (Expo Router file-based routing)
    │   ├── (auth)/
    │   │   ├── login.tsx
    │   │   └── register.tsx
    │   ├── (app)/
    │   │   ├── dashboard.tsx
    │   │   └── activity/[id].tsx
    │   └── _layout.tsx
    ├── components/  ← reusable UI components (adapted from web)
    ├── api/         ← API layer (same endpoints as web)
    ├── store/       ← Redux store (copy from web, same shape)
    ├── constants/   ← colors, typography, spacing tokens
    └── package.json
```

### 2.2 — Code Reuse Strategy

| Web Code | Reuse Level | Mobile Adaptation |
|----------|-------------|-------------------|
| `api/api.js` | ✅ ~95% | Replace `localStorage` with `expo-secure-store` for token storage |
| `store/store.js` + `authSlice.js` | ✅ 100% | Copy as-is — Redux Toolkit is framework-agnostic |
| `mock/mockData.js` + `mockApi.js` | ✅ 100% | Copy as-is for development |
| Component logic (state, effects) | ✅ 70% | Copy logic, replace JSX `div/button` with `View/Text/Pressable` |
| CSS / Tailwind styles | ❌ 0% | Rewrite using React Native `StyleSheet` or NativeWind |
| React Router routes | ❌ 0% | Use Expo Router (file-based, similar mental model) |

### 2.3 — Key Dependencies for Mobile App

```json
{
  "dependencies": {
    "expo": "~52.0.0",
    "expo-router": "~4.0.0",
    "expo-secure-store": "~14.0.0",
    "expo-status-bar": "~2.0.0",
    "@reduxjs/toolkit": "^2.6.0",
    "react-redux": "^9.2.0",
    "axios": "^1.8.1",
    "react-native-safe-area-context": "^4.12.0",
    "react-native-screens": "^4.4.0",
    "lucide-react-native": "^0.475.0",
    "@expo/vector-icons": "^14.0.0"
  }
}
```

### 2.4 — Auth: Replace localStorage with Secure Storage

The web app stores `token` and `userId` in `localStorage`. On mobile, use `expo-secure-store` (encrypted, OS-keychain-backed):

```js
// mobile/api/api.js (adapted)
import * as SecureStore from 'expo-secure-store';

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  const userId = await SecureStore.getItemAsync('userId');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  if (userId) config.headers['X-User-ID'] = userId;
  return config;
});
```

### 2.5 — Navigation Structure (Expo Router)

```
app/
├── _layout.tsx          ← Root layout with Redux Provider + auth guard
├── (auth)/
│   ├── _layout.tsx      ← Stack navigator for auth screens
│   ├── login.tsx        ← LoginPage adapted to RN
│   └── register.tsx     ← RegisterPage adapted to RN
└── (app)/
    ├── _layout.tsx      ← Tab navigator (Dashboard, Profile)
    ├── index.tsx        ← Dashboard (activity list + stats)
    └── activity/
        └── [id].tsx     ← Activity detail + AI recommendations
```

### 2.6 — Screens to Build

#### Screen 1: Login
- Email + Password inputs (`TextInput`)
- Login button → calls `POST /api/auth/login`
- Stores JWT + userId in SecureStore
- Navigates to Dashboard

#### Screen 2: Register
- First name, Last name, Email, Password
- Calls `POST /api/auth/register`
- Auto-logs in after registration

#### Screen 3: Dashboard
- Activity stats summary (total calories, total sessions this week)
- Scrollable `FlatList` of activity cards
- Floating Action Button → Log New Activity modal/sheet
- Pull-to-refresh

#### Screen 4: Activity Detail
- Activity metrics (duration, calories, type, time)
- AI recommendation card (overall text, improvements, suggestions, safety)
- Back navigation

#### Screen 5: Log Activity (new — modal/bottom sheet)
- Activity type picker
- Duration input
- Calories input
- Additional metrics (dynamic based on type)
- Calls `POST /api/activities`

---

## Phase 3 — Building & Distributing the App

### 3.1 — Development Testing

```bash
# Install Expo Go on your phone, then run:
npx expo start
# Scan QR code with Expo Go — instant preview on device
```

### 3.2 — Production Build (EAS Build)

Expo Application Services (EAS) builds native `.apk` / `.ipa` files in the cloud — **no Mac required for Android**.

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android   # produces .apk / .aab
eas build --platform ios       # requires Apple Developer account ($99/yr)
```

### 3.3 — Distribution Options

| Option | Platform | Cost | Notes |
|--------|----------|------|-------|
| **Expo Go** (dev only) | iOS + Android | Free | For testing only |
| **Direct APK sideload** | Android only | Free | Share `.apk` file directly |
| **Google Play Store** | Android | $25 one-time | Best for production |
| **Apple App Store** | iOS | $99/yr | Requires Apple Developer account |
| **TestFlight** | iOS | Included in $99 | For beta distribution |

> **Quickest path to phone:** Build an `.apk` with `eas build --platform android --profile preview` and sideload it — no store account needed.

---

## Phase 4 — Connecting App to Cloud Backend

### 4.1 — Environment Config for Mobile

```js
// mobile/api/api.js
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'https://fitness-gateway.railway.app/api';
```

In `mobile/.env`:
```env
EXPO_PUBLIC_API_URL=https://fitness-gateway.railway.app/api
EXPO_PUBLIC_MOCK_MODE=false
```

### 4.2 — CORS & Security on Gateway

Update the Spring Cloud Gateway to:
- Allow requests from any origin (for mobile, origin is `null` or the app bundle)
- Keep JWT validation on all protected routes
- Add rate limiting to prevent abuse

---

## Open Questions

1. **Cloud Platform Preference** — Do you have a preference between Railway, Render, Google Cloud Run, or Fly.io for hosting the backend? Railway is the fastest to set up. GCP is best if you want to stay in the Google ecosystem (since you're using Gemini API).

2. **Eureka / Config Server** — Should we keep Eureka and Config Server in the cloud deployment, or simplify by removing them and using direct service-to-service URLs? Removing them is simpler and cheaper for a single-instance deployment.

3. **iOS Support** — Do you need the app on iOS as well as Android? iOS requires an Apple Developer account ($99/year) for App Store or TestFlight distribution.

4. **Auth — JWT vs OAuth2/Keycloak** — The `authConfig.js` references a Keycloak instance at `localhost:8181`. Is Keycloak/OAuth2 being used in production, or are you using the simple JWT `/auth/login` flow? This affects how auth is implemented on mobile (OAuth2 PKCE on mobile requires `expo-auth-session`).

5. **Health Sensor Integration** — Should the mobile app integrate with device health APIs (Apple HealthKit / Google Fit) to auto-import activity data? This is a future feature but worth planning for now.

---

## Execution Order (Current Status)

- [ ] 1. Set up managed DB & Kafka (Aiven PostgreSQL, MongoDB, Kafka)
- [ ] 2. Deploy microservices to cloud platform
- [ ] 3. Test public API gateway URL
- [x] 4. Init Expo mobile project (mobile/)
- [x] 5. Port API layer & Redux store
- [x] 6. Build Login & Register screens (In Progress)
- [x] 7. Build Dashboard screen (In Progress)
- [ ] 8. Build Activity Detail screen
- [ ] 9. Build Log Activity screen
- [ ] 10. Connect to live cloud backend
- [ ] 11. EAS Build → .apk
- [ ] 12. Install on phone & test

## Immediate Next Steps

1. **Resolve Dependency Conflicts**: Finalize the `react` vs `react-dom` peer dependency issues in the Expo project to ensure stable builds.
2. **Refine UI Aesthetics**: Incorporate feedback on the Dashboard and Add buttons, improving size, spacing, and styling.
3. **Implement Remaining Screens**: Focus on the `Activity Detail` and `Log Activity` components once the base layout is stable.
4. **Local Integration Testing**: Before moving the backend to the cloud, ensure the local Spring Boot services are correctly handling requests from the mobile client via the mock/local API layer.

---

## Summary of New Files / Changes

| File | Action | Description |
|------|--------|-------------|
| `mobile/` | **NEW** | Entire React Native Expo project |
| `mobile/api/api.js` | **NEW** | Adapted API layer using SecureStore |
| `mobile/store/` | **NEW** | Copy of Redux store from web |
| `mobile/app/` | **NEW** | All screens via Expo Router |
| `mobile/components/` | **NEW** | Reusable RN UI components |
| `server/docker-compose.yml` | **MODIFY** | Remove local infra, use managed services |
| `server/gateway` | **MODIFY** | Add CORS + mobile-friendly headers |
| `server/*/application.yml` | **MODIFY** | Env-var based config for cloud |

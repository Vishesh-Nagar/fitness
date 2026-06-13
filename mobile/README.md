# Fitness Tracker Mobile App

This is the React Native mobile application for the Fitness Tracker project, built using [Expo](https://expo.dev/). It provides a modern, seamless interface for logging workouts, tracking calories, and viewing AI-generated activity recommendations.

## 🚀 Tech Stack

- **Framework**: React Native with [Expo](https://expo.dev/)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) (`react-redux`)
- **API Client**: [Axios](https://axios-http.com/)
- **Local Storage**: `expo-secure-store` (for JWT and user data persistence)
- **Icons**: `lucide-react-native`

## 📦 Folder Structure

```text
mobile/
├── app/                  # Expo Router file-based screens
│   ├── (auth)/           # Login and Register screens
│   ├── (app)/            # Authenticated tabs (Dashboard, Profile, Activity Details)
│   └── _layout.tsx       # Root layout and Redux provider
├── components/           # Reusable UI components
│   ├── activity/         # Activity cards, Log Activity bottom sheet
│   └── ui/               # Buttons, Inputs, Modals
├── api/                  # Axios instance and API service calls
├── store/                # Redux store and slices (authSlice)
├── constants/            # Design tokens (colors, typography, spacing)
├── mock/                 # Mock API and data for local development without backend
└── .env                  # Environment variables
```

## 🛠️ Prerequisites

1. **Node.js** (v18 or newer recommended)
2. **npm** (comes with Node.js)
3. **Expo Go app** installed on your physical mobile device (available on iOS App Store and Google Play Store). Alternatively, you can run an Android Emulator or iOS Simulator on your machine.

## 🏃‍♂️ How to Run the App

1. **Navigate to the mobile directory**:
   ```bash
   cd mobile
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Ensure you have a `.env` file in the `mobile` directory. You can copy the provided example:
   ```bash
   cp .env.example .env
   ```

4. **Start the development server**:
   ```bash
   npx expo start
   ```
   *Note: Use `npx expo start --clear` if you need to clear the Metro bundler cache.*

5. **Open the app**:
   - **Physical Device**: Open the **Expo Go** app on your phone and scan the QR code displayed in your terminal.
   - **iOS Simulator**: Press `i` in the terminal.
   - **Android Emulator**: Press `a` in the terminal.

## ⚙️ Environment Variables

The application relies on environment variables for configuration. Check the `.env.example` file.

- `EXPO_PUBLIC_API_URL`: The base URL of your backend API Gateway (e.g., `http://localhost:8080/api` or a cloud URL).
- `EXPO_PUBLIC_MOCK_MODE`: Set to `"true"` to run the app entirely offline using local mock data. Set to `"false"` to connect to the real backend.

## 🧪 Testing with Mock Data

If the backend microservices are not yet running, you can easily develop and test the mobile UI using mock data:

1. Open `mobile/.env`.
2. Set `EXPO_PUBLIC_MOCK_MODE=true`.
3. Restart the Expo server (`npx expo start`).
4. On the Login screen, you can use any email and a password of at least 6 characters to log in and see pre-populated activities and AI recommendations.

## 🏗️ Building for Production

To create standalone `.apk` (Android) or `.ipa` (iOS) files, you can use Expo Application Services (EAS):

1. Install EAS CLI: `npm install -g eas-cli`
2. Log in: `eas login`
3. Configure the project: `eas build:configure`
4. Run a build (e.g., Android preview): `eas build --platform android --profile preview`

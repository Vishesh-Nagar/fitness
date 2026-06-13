# Fitness App Improvement Roadmap

> **Stack**: Spring Boot · MongoDB · React · JWT · Kafka · Docker · GitHub Actions
> **Goal**: Elevate the Fitness App to a demonstrable, production-ready system highlighting advanced architecture, infrastructure, and product features.

---

## Current State Analysis

| Component | Current State | Target State | Notes |
|---|---|---|---|
| **Authentication** | Keycloak | Custom JWT Authentication | Custom implementation shows deeper understanding of token signing and validation. |
| **Message Broker** | RabbitMQ | Apache Kafka | Aligns with high-throughput event-driven architectures; demonstrates knowledge of partitions/offsets. |
| **Infrastructure** | Manual startup | Docker Compose | Single-command startup (`docker compose up`) for all microservices, MongoDB, and Kafka. |
| **CI/CD** | None | GitHub Actions | Automated build, test, and frontend deployment. |
| **Frontend** | Basic CRUD | Rich Analytics Dashboard | Adds charts (Chart.js/Recharts), PR tracking, and streak tracking. |
| **AI Integration** | Generic prompts | Context-aware AI | Personalized recommendations using historical data and PRs. |

---

## Roadmap

### Phase 1 — Infrastructure: Docker Compose
*Estimated effort: ~2–3 hours*

**Goal**: Allow running the entire system with one command.

#### 1.1 — `docker-compose.yml`
**File**: `docker-compose.yml` *(NEW)*

Create a root-level compose file that defines MongoDB, Kafka (KRaft mode — no Zookeeper), all backend microservices, and the React frontend.  Each backend service reads its config from the Spring Cloud Config Server, which is always started first via `depends_on`.

```yaml
version: '3.8'

networks:
  fitness-net:
    driver: bridge

services:

  # ─────────────── Infrastructure ───────────────
  mongodb:
    image: mongo:6.0
    container_name: fitness-mongodb
    restart: unless-stopped
    ports:
      - "27017:27017"
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: rootpassword
    volumes:
      - mongo-data:/data/db
    networks:
      - fitness-net

  # KRaft mode: single-node Kafka — no Zookeeper needed
  kafka:
    image: bitnami/kafka:3.7
    container_name: fitness-kafka
    restart: unless-stopped
    ports:
      - "9092:9092"
    environment:
      - KAFKA_CFG_NODE_ID=0
      - KAFKA_CFG_PROCESS_ROLES=controller,broker
      - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093
      - KAFKA_CFG_ADVERTISED_LISTENERS=PLAINTEXT://kafka:9092
      - KAFKA_CFG_LISTENER_SECURITY_PROTOCOL_MAP=CONTROLLER:PLAINTEXT,PLAINTEXT:PLAINTEXT
      - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093
      - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
      - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=true
    networks:
      - fitness-net

  # ─────────────── Spring Cloud Config ───────────────
  configserver:
    build: ./configserver
    container_name: fitness-configserver
    restart: unless-stopped
    ports:
      - "8888:8888"
    networks:
      - fitness-net

  # ─────────────── Service Discovery ───────────────
  eureka:
    build: ./eureka
    container_name: fitness-eureka
    restart: unless-stopped
    ports:
      - "8761:8761"
    depends_on:
      - configserver
    environment:
      - SPRING_CONFIG_IMPORT=optional:configserver:http://configserver:8888
    networks:
      - fitness-net

  # ─────────────── API Gateway ───────────────
  gateway:
    build: ./gateway
    container_name: fitness-gateway
    restart: unless-stopped
    ports:
      - "8080:8080"
    depends_on:
      - eureka
      - configserver
    environment:
      - SPRING_CONFIG_IMPORT=optional:configserver:http://configserver:8888
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka:8761/eureka/
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    networks:
      - fitness-net

  # ─────────────── Microservices ───────────────
  userservice:
    build: ./userservice
    container_name: fitness-userservice
    restart: unless-stopped
    ports:
      - "8081:8081"
    depends_on:
      - mongodb
      - eureka
      - configserver
    environment:
      - SPRING_CONFIG_IMPORT=optional:configserver:http://configserver:8888
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka:8761/eureka/
      - SPRING_DATA_MONGODB_URI=mongodb://root:rootpassword@mongodb:27017/fitnessdb?authSource=admin
      - JWT_SECRET_KEY=${JWT_SECRET_KEY}
    networks:
      - fitness-net

  activityservice:
    build: ./activityservice
    container_name: fitness-activityservice
    restart: unless-stopped
    ports:
      - "8082:8082"
    depends_on:
      - mongodb
      - kafka
      - eureka
      - configserver
    environment:
      - SPRING_CONFIG_IMPORT=optional:configserver:http://configserver:8888
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka:8761/eureka/
      - SPRING_DATA_MONGODB_URI=mongodb://root:rootpassword@mongodb:27017/fitnessdb?authSource=admin
      - SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092
    networks:
      - fitness-net

  aiservice:
    build: ./aiservice
    container_name: fitness-aiservice
    restart: unless-stopped
    ports:
      - "8083:8083"
    depends_on:
      - mongodb
      - kafka
      - eureka
      - configserver
    environment:
      - SPRING_CONFIG_IMPORT=optional:configserver:http://configserver:8888
      - EUREKA_CLIENT_SERVICEURL_DEFAULTZONE=http://eureka:8761/eureka/
      - SPRING_DATA_MONGODB_URI=mongodb://root:rootpassword@mongodb:27017/fitnessdb?authSource=admin
      - SPRING_KAFKA_BOOTSTRAP_SERVERS=kafka:9092
      - GEMINI_API_KEY=${GEMINI_API_KEY}
    networks:
      - fitness-net

  # ─────────────── Frontend ───────────────
  frontend:
    build: ./frontend
    container_name: fitness-frontend
    restart: unless-stopped
    ports:
      - "5173:80"
    depends_on:
      - gateway
    networks:
      - fitness-net

volumes:
  mongo-data:
```

> **Note**: Create a `.env` file at the repository root with `JWT_SECRET_KEY=<min-32-char-secret>` and `GEMINI_API_KEY=<your-key>`. Docker Compose picks it up automatically — never commit this file.

---

### Phase 2 — Custom JWT Authentication
*Estimated effort: ~4–5 hours*

**Goal**: Replace Keycloak with a custom, secure stateless authentication flow. The current `JwtUtil.java` skeleton and `AuthController.java` already exist — this phase completes and wires everything together correctly.

#### 2.1 — JWT Utilities
**File**: `userservice/src/main/java/com/fitness/userservice/security/JwtUtil.java` *(MODIFY)*

The existing file has a typo (`.setSubjec`) and imports an unused BouncyCastle class. This replaces it with a correct, fully functional implementation using the modern `io.jsonwebtoken` (JJWT **0.12.x**) API.

> **Deprecation note (JJWT ≥ 0.12.0)**: `SignatureAlgorithm`, `Jwts.parserBuilder()`, `.parseClaimsJws()`, and the legacy claim-setter methods (`setSubject`, `setIssuedAt`, etc.) are all deprecated. The snippets below use only the current API: `Jwts.SIG.HS256`, `Jwts.parser()`, `.parseSignedClaims()`, and the new fluent claim methods (`subject`, `issuedAt`, `expiration`, `claims`).

```java
package com.fitness.userservice.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    private final SecretKey signingKey;
    private static final long EXPIRATION_MS = 1000L * 60 * 60 * 24; // 24 hours

    // Reads from environment variable set in docker-compose / application.properties
    public JwtUtil(@Value("${jwt.secret}") String secret) {
        // Keys.hmacShaKeyFor requires at least 32 bytes for HS256
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Generates a signed JWT for the given user ID.
     * The subject is the userId (MongoDB _id), not the email,
     * so downstream services can correlate with the X-User-ID header.
     *
     * Uses the non-deprecated JJWT 0.12.x API:
     *   - Jwts.SIG.HS256  instead of SignatureAlgorithm.HS256
     *   - .subject() / .issuedAt() / .expiration() / .claims()
     *     instead of .setSubject() / .setIssuedAt() / .setExpiration() / .addClaims()
     */
    public String generateToken(String userId, String email) {
        return Jwts.builder()
                .subject(userId)
                .claims(Map.of("email", email))
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + EXPIRATION_MS))
                .signWith(signingKey, Jwts.SIG.HS256)   // SecureDigestAlgorithm — not deprecated
                .compact();
    }

    /**
     * Validates the token signature and expiry.
     * Throws JwtException (or its subtypes) on failure.
     *
     * Uses the non-deprecated JJWT 0.12.x API:
     *   - Jwts.parser()          instead of Jwts.parserBuilder()
     *   - .verifyWith()          instead of .setSigningKey()
     *   - .parseSignedClaims()   instead of .parseClaimsJws()
     *   - .getPayload()          instead of .getBody()
     */
    public Claims validateAndExtractClaims(String token) {
        return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public boolean isTokenValid(String token) {
        try {
            validateAndExtractClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    public String extractUserId(String token) {
        return validateAndExtractClaims(token).getSubject();
    }
}
```

#### 2.2 — Auth DTOs
**File**: `userservice/src/main/java/com/fitness/userservice/dto/AuthRequest.java` *(NEW)*
**File**: `userservice/src/main/java/com/fitness/userservice/dto/AuthResponse.java` *(NEW)*

```java
// AuthRequest.java
package com.fitness.userservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AuthRequest {
    @NotBlank @Email
    private String email;

    @NotBlank
    private String password;
}
```

```java
// AuthResponse.java
package com.fitness.userservice.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String userId;
    private String email;
}
```

#### 2.3 — Login Endpoint
**File**: `userservice/src/main/java/com/fitness/userservice/controller/AuthController.java` *(MODIFY)*

The current stub calls `JwtUtil.generateToken(request.getUsername())` against missing types. This replaces it with a real implementation that verifies the password against the stored BCrypt hash.

```java
package com.fitness.userservice.controller;

import com.fitness.userservice.dto.AuthRequest;
import com.fitness.userservice.dto.AuthResponse;
import com.fitness.userservice.dto.RegisterRequest;
import com.fitness.userservice.dto.UserResponse;
import com.fitness.userservice.model.User;
import com.fitness.userservice.repository.UserRepository;
import com.fitness.userservice.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder;

    /** POST /api/auth/register — creates a new account */
    @PostMapping("/register")
    public ResponseEntity<UserResponse> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        User saved = userRepository.save(user);

        UserResponse response = new UserResponse();
        response.setId(saved.getId());
        response.setEmail(saved.getEmail());
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    /** POST /api/auth/login — returns a signed JWT on valid credentials */
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String token = jwtUtil.generateToken(user.getId(), user.getEmail());
        return ResponseEntity.ok(new AuthResponse(token, user.getId(), user.getEmail()));
    }
}
```

#### 2.4 — API Gateway JWT Filter
**File**: `gateway/src/main/java/com/fitness/gateway/security/JwtAuthenticationFilter.java` *(NEW)*

This replaces the Keycloak-specific `KeycloakUserSyncFilter`. It validates the JWT, then forwards the resolved `X-User-ID` header to all downstream services — exactly the same convention already used by `ActivityController`.

```java
package com.fitness.gateway.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;

import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import org.springframework.cloud.gateway.filter.GlobalFilter;
import org.springframework.core.Ordered;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.reactive.ServerHttpRequest;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import java.util.List;

@Component
@Slf4j
public class JwtAuthenticationFilter implements GlobalFilter, Ordered {

    private final SecretKey signingKey;  // javax.crypto.SecretKey (required by JJWT 0.12.x verifyWith())

    // Paths that don't require a token (login, register)
    private static final List<String> PUBLIC_PATHS = List.of(
            "/api/auth/login",
            "/api/auth/register"
    );

    public JwtAuthenticationFilter(@Value("${jwt.secret}") String secret) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes());
    }

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        String path = exchange.getRequest().getURI().getPath();

        // Allow public endpoints through without a token
        if (PUBLIC_PATHS.stream().anyMatch(path::startsWith)) {
            return chain.filter(exchange);
        }

        String authHeader = exchange.getRequest().getHeaders().getFirst(HttpHeaders.AUTHORIZATION);
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }

        String token = authHeader.substring(7);
        try {
            // JJWT 0.12.x non-deprecated API: parser() + verifyWith() + parseSignedClaims() + getPayload()
            Claims claims = Jwts.parser()
                    .verifyWith(signingKey)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            // Extract userId (subject) and propagate as X-User-ID header —
            // all downstream services (e.g. ActivityController) already read this header.
            String userId = claims.getSubject();
            ServerHttpRequest mutatedRequest = exchange.getRequest().mutate()
                    .header("X-User-ID", userId)
                    .build();

            log.debug("JWT valid for userId={}, routing request to {}", userId, path);
            return chain.filter(exchange.mutate().request(mutatedRequest).build());

        } catch (JwtException e) {
            log.warn("Invalid JWT token: {}", e.getMessage());
            exchange.getResponse().setStatusCode(HttpStatus.UNAUTHORIZED);
            return exchange.getResponse().setComplete();
        }
    }

    @Override
    public int getOrder() {
        // Run before routing filters
        return -100;
    }
}
```

> **`pom.xml` changes required** — remove the Keycloak starter and add JJWT **0.12.6** (first non-deprecated-free release series):
> ```xml
> <!-- Remove -->
> <dependency>
>     <groupId>org.springframework.boot</groupId>
>     <artifactId>spring-boot-starter-oauth2-resource-server</artifactId>
> </dependency>
>
> <!-- Add -->
> <dependency>
>     <groupId>io.jsonwebtoken</groupId>
>     <artifactId>jjwt-api</artifactId>
>     <version>0.12.6</version>
> </dependency>
> <dependency>
>     <groupId>io.jsonwebtoken</groupId>
>     <artifactId>jjwt-impl</artifactId>
>     <version>0.12.6</version>
>     <scope>runtime</scope>
> </dependency>
> <dependency>
>     <groupId>io.jsonwebtoken</groupId>
>     <artifactId>jjwt-jackson</artifactId>
>     <version>0.12.6</version>
>     <scope>runtime</scope>
> </dependency>
> ```
>
> **Why 0.12.x?** JJWT 0.12.0 introduced `Jwts.SIG` (a registry of `SecureDigestAlgorithm` instances), `Jwts.parser()`, `verifyWith()`, and `parseSignedClaims()` while deprecating the old `SignatureAlgorithm` enum and `parserBuilder()` chain. Using 0.12.6 ensures no deprecation warnings at compile time.

---

### Phase 3 — Message Broker Migration: Kafka
*Estimated effort: ~3–4 hours*

**Goal**: Replace RabbitMQ with Apache Kafka. The current `ActivityService` publishes to RabbitMQ and `ActivityMessageListener` consumes from `activity.queue`. Both files need to be updated.

#### 3.1 — Kafka Topic Configuration
**File**: `activityservice/src/main/java/com/fitness/activityservice/config/KafkaTopicConfig.java` *(NEW)*

Declaring topics as beans means they are auto-created with the desired partition/replication settings on startup, instead of relying on auto-creation defaults.

```java
package com.fitness.activityservice.config;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
public class KafkaTopicConfig {

    public static final String ACTIVITY_EVENTS_TOPIC = "activity-events";

    /**
     * 3 partitions: each partition is consumed by one AI-service instance,
     * allowing horizontal scaling of AI processing.
     * Partitioning by userId (see producer) guarantees in-order processing per user.
     */
    @Bean
    public NewTopic activityEventsTopic() {
        return TopicBuilder.name(ACTIVITY_EVENTS_TOPIC)
                .partitions(3)
                .replicas(1) // set to 3 in a real multi-broker cluster
                .build();
    }
}
```

#### 3.2 — Kafka Producer (Activity Service)
**File**: `activityservice/src/main/java/com/fitness/activityservice/service/ActivityService.java` *(MODIFY)*

Replace the `RabbitTemplate` dependency with `KafkaTemplate`. The `Activity` model is already serializable (Lombok `@Builder`, `@Data`).

```java
package com.fitness.activityservice.service;

import com.fitness.activityservice.ActivityRepository;
import com.fitness.activityservice.config.KafkaTopicConfig;
import com.fitness.activityservice.dto.ActivityRequest;
import com.fitness.activityservice.dto.ActivityResponse;
import com.fitness.activityservice.model.Activity;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.kafka.support.SendResult;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.CompletableFuture;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final UserValidationService userValidationService;
    private final KafkaTemplate<String, Activity> kafkaTemplate;

    public ActivityResponse trackActivity(ActivityRequest request) {
        boolean isValidUser = userValidationService.validateUser(request.getUserId());
        if (!isValidUser) {
            throw new RuntimeException("Invalid User: " + request.getUserId());
        }

        Activity activity = Activity.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .duration(request.getDuration())
                .caloriesBurned(request.getCaloriesBurned())
                .startTime(request.getStartTime())
                .additionalMetrics(request.getAdditionalMetrics())
                .build();

        Activity savedActivity = activityRepository.save(activity);

        // Publish to Kafka.
        // Key = userId → Kafka routes all events for the same user to the same partition,
        // guaranteeing chronological ordering in the AI service consumer.
        CompletableFuture<SendResult<String, Activity>> future =
                kafkaTemplate.send(KafkaTopicConfig.ACTIVITY_EVENTS_TOPIC,
                        savedActivity.getUserId(),
                        savedActivity);

        future.whenComplete((result, ex) -> {
            if (ex != null) {
                log.error("Failed to publish activity {} to Kafka: {}",
                        savedActivity.getId(), ex.getMessage());
            } else {
                log.info("Published activity {} to Kafka partition {} offset {}",
                        savedActivity.getId(),
                        result.getRecordMetadata().partition(),
                        result.getRecordMetadata().offset());
            }
        });

        return mapToResponse(savedActivity);
    }

    private ActivityResponse mapToResponse(Activity activity) {
        ActivityResponse response = new ActivityResponse();
        response.setId(activity.getId());
        response.setUserId(activity.getUserId());
        response.setType(activity.getType());
        response.setDuration(activity.getDuration());
        response.setCaloriesBurned(activity.getCaloriesBurned());
        response.setStartTime(activity.getStartTime());
        response.setAdditionalMetrics(activity.getAdditionalMetrics());
        response.setCreatedAt(activity.getCreatedAt());
        response.setUpdatedAt(activity.getUpdatedAt());
        return response;
    }

    public List<ActivityResponse> getUserActivities(String userId) {
        return activityRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public ActivityResponse getActivityById(String activityId) {
        return activityRepository.findById(activityId)
                .map(this::mapToResponse)
                .orElseThrow(() -> new RuntimeException("Activity not found: " + activityId));
    }
}
```

#### 3.3 — Kafka Consumer (AI Service)
**File**: `aiservice/src/main/java/com/fitness/aiservice/service/ActivityMessageListener.java` *(MODIFY)*

Replace the `@RabbitListener` annotation with `@KafkaListener`. The rest of the logic (calling `ActivityAIService` and saving the recommendation) stays the same.

```java
package com.fitness.aiservice.service;

import com.fitness.aiservice.model.Activity;
import com.fitness.aiservice.model.Recommendation;
import com.fitness.aiservice.repository.RecommendationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.kafka.support.KafkaHeaders;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Service;

@Service
@Slf4j
@RequiredArgsConstructor
public class ActivityMessageListener {

    private final ActivityAIService aiService;
    private final RecommendationRepository recommendationRepository;

    /**
     * groupId = "ai-service-group"
     * With 3 Kafka partitions and multiple AI-service replicas, Kafka balances
     * partitions across instances — giving us free horizontal scaling of AI processing.
     *
     * concurrency = "3" means one thread per partition per instance for max throughput.
     */
    @KafkaListener(
            topics = "activity-events",
            groupId = "ai-service-group",
            concurrency = "3"
    )
    public void processActivity(
            @Payload Activity activity,
            @Header(KafkaHeaders.RECEIVED_PARTITION) int partition,
            @Header(KafkaHeaders.OFFSET) long offset
    ) {
        log.info("Received activity {} from partition {} offset {}",
                activity.getId(), partition, offset);

        try {
            Recommendation recommendation = aiService.generateRecommendation(activity);
            recommendationRepository.save(recommendation);
            log.info("Saved recommendation for activity {}", activity.getId());
        } catch (Exception e) {
            // In production, send to a dead-letter topic instead of swallowing
            log.error("Failed to process activity {}: {}", activity.getId(), e.getMessage(), e);
        }
    }
}
```

> **`application.properties` additions** (both `activityservice` and `aiservice`):
> ```properties
> # Kafka
> spring.kafka.bootstrap-servers=${SPRING_KAFKA_BOOTSTRAP_SERVERS:localhost:9092}
> spring.kafka.producer.key-serializer=org.apache.kafka.common.serialization.StringSerializer
> spring.kafka.producer.value-serializer=org.springframework.kafka.support.serializer.JsonSerializer
> spring.kafka.consumer.key-deserializer=org.apache.kafka.common.serialization.StringDeserializer
> spring.kafka.consumer.value-deserializer=org.springframework.kafka.support.serializer.JsonDeserializer
> spring.kafka.consumer.properties.spring.json.trusted.packages=com.fitness.*
> spring.kafka.consumer.auto-offset-reset=earliest
> ```

---

### Phase 4 — CI/CD Pipelines
*Estimated effort: ~2 hours*

**Goal**: Automate testing and building on every push to `main` or any pull request.

#### 4.1 — Backend Pipeline
**File**: `.github/workflows/backend.yml` *(NEW)*

Runs on every push/PR. Builds all five Maven modules in parallel using a matrix strategy, then validates the Docker image builds.

```yaml
name: Backend CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    name: Build ${{ matrix.service }}
    runs-on: ubuntu-latest

    strategy:
      matrix:
        service: [userservice, activityservice, aiservice, gateway, configserver]

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up JDK 17
        uses: actions/setup-java@v4
        with:
          java-version: '17'
          distribution: 'temurin'
          cache: maven

      - name: Build & test ${{ matrix.service }}
        working-directory: ${{ matrix.service }}
        run: mvn --no-transfer-progress clean verify

      - name: Build Docker image
        working-directory: ${{ matrix.service }}
        run: docker build -t fitness-${{ matrix.service }}:${{ github.sha }} .
```

#### 4.2 — Frontend Pipeline
**File**: `.github/workflows/frontend.yml` *(NEW)*

```yaml
name: Frontend CI

on:
  push:
    branches: [main]
    paths: [frontend/**]
  pull_request:
    branches: [main]
    paths: [frontend/**]

jobs:
  build:
    name: Build & Lint Frontend
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Set up Node 20
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: frontend/package-lock.json

      - name: Install dependencies
        working-directory: frontend
        run: npm ci

      - name: Lint
        working-directory: frontend
        run: npm run lint

      - name: Build production bundle
        working-directory: frontend
        run: npm run build

      - name: Upload dist artifact
        uses: actions/upload-artifact@v4
        with:
          name: frontend-dist-${{ github.sha }}
          path: frontend/dist/
          retention-days: 7
```

---

### Phase 5 — Analytics & Progress Dashboard
*Estimated effort: ~4–6 hours*

**Goal**: Enhance the React frontend with visualizations. The `Activity` model already has `type`, `duration`, `caloriesBurned`, and `startTime` — all the data needed for charts.

#### 5.1 — Backend Analytics Endpoints
**File**: `activityservice/src/main/java/com/fitness/activityservice/controller/AnalyticsController.java` *(NEW)*

```java
package com.fitness.activityservice.controller;

import com.fitness.activityservice.dto.StreakDto;
import com.fitness.activityservice.dto.WeeklyVolumeDto;
import com.fitness.activityservice.service.AnalyticsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/activities/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    /**
     * GET /api/activities/analytics/{userId}/streaks
     * Returns the user's current daily streak and their all-time best streak.
     * The gateway forwards the JWT-resolved X-User-ID header,
     * so the userId in the path is already trusted.
     */
    @GetMapping("/{userId}/streaks")
    public ResponseEntity<StreakDto> getUserStreaks(@PathVariable String userId) {
        return ResponseEntity.ok(analyticsService.calculateStreaks(userId));
    }

    /**
     * GET /api/activities/analytics/{userId}/weekly-volume?from=2024-01-01&to=2024-01-31
     * Returns total minutes and calories burned per day — used to populate the line chart.
     */
    @GetMapping("/{userId}/weekly-volume")
    public ResponseEntity<List<WeeklyVolumeDto>> getWeeklyVolume(
            @PathVariable String userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to
    ) {
        return ResponseEntity.ok(analyticsService.getVolumeByDay(userId, from, to));
    }
}
```

**File**: `activityservice/src/main/java/com/fitness/activityservice/dto/StreakDto.java` *(NEW)*

```java
package com.fitness.activityservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class StreakDto {
    private int currentStreak;   // consecutive days with at least one activity
    private int longestStreak;   // all-time best
    private String lastActivityDate;
}
```

**File**: `activityservice/src/main/java/com/fitness/activityservice/dto/WeeklyVolumeDto.java` *(NEW)*

```java
package com.fitness.activityservice.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class WeeklyVolumeDto {
    private String date;           // "2024-06-01" — ISO date string for Recharts XAxis
    private int totalMinutes;
    private int totalCalories;
    private int sessionCount;
}
```

#### 5.2 — Frontend Dashboard Chart
**File**: `frontend/src/components/Dashboard/ProgressChart.jsx` *(NEW)*

Uses the `WeeklyVolumeDto` shape returned by the backend. Supports toggling between minutes and calories.

```jsx
import { useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer
} from 'recharts';

/**
 * @param {Array<{date: string, totalMinutes: number, totalCalories: number}>} data
 */
export default function ProgressChart({ data }) {
  const [metric, setMetric] = useState('totalMinutes'); // or 'totalCalories'

  const metaMap = {
    totalMinutes:  { label: 'Minutes',  color: '#818cf8', unit: 'min' },
    totalCalories: { label: 'Calories', color: '#f472b6', unit: 'kcal' },
  };
  const { label, color, unit } = metaMap[metric];

  return (
    <div className="chart-card">
      <div className="chart-header">
        <h3>Activity Volume</h3>
        <div className="toggle-group">
          {Object.entries(metaMap).map(([key, { label }]) => (
            <button
              key={key}
              className={`toggle-btn ${metric === key ? 'active' : ''}`}
              onClick={() => setMetric(key)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <YAxis unit={` ${unit}`} tick={{ fill: '#94a3b8', fontSize: 12 }} />
          <Tooltip
            contentStyle={{ background: '#1e293b', border: 'none', borderRadius: 8 }}
            formatter={(val) => [`${val} ${unit}`, label]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey={metric}
            name={label}
            stroke={color}
            strokeWidth={2}
            dot={{ r: 4, fill: color }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

#### 5.3 — Streak Widget
**File**: `frontend/src/components/Dashboard/StreakWidget.jsx` *(NEW)*

```jsx
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

/**
 * Fetches streak data from the activity service (via gateway)
 * and renders a flame-based streak card.
 */
export default function StreakWidget() {
  const { token, userId } = useSelector((state) => state.auth);
  const [streak, setStreak] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    fetch(`/api/activities/analytics/${userId}/streaks`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => setStreak(data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [userId, token]);

  if (loading) return <div className="streak-card skeleton" />;

  return (
    <div className="streak-card">
      <span className="streak-icon" role="img" aria-label="flame">🔥</span>
      <div className="streak-info">
        <p className="streak-count">{streak?.currentStreak ?? 0}</p>
        <p className="streak-label">Day Streak</p>
      </div>
      <div className="streak-best">
        <p className="streak-best-label">Best</p>
        <p className="streak-best-count">{streak?.longestStreak ?? 0}</p>
      </div>
    </div>
  );
}
```

---

### Phase 6 — Enhanced AI Integration
*Estimated effort: ~3–4 hours*

**Goal**: Make the existing `GeminiService` and `ActivityAIService` context-aware by enriching the prompt with the user's historical performance — streak, total sessions, and personal records for the same activity type.

#### 6.1 — User Context DTO
**File**: `aiservice/src/main/java/com/fitness/aiservice/dto/UserContext.java` *(NEW)*

```java
package com.fitness.aiservice.dto;

import com.fitness.aiservice.model.Activity;
import lombok.Builder;
import lombok.Data;

import java.util.Map;

/**
 * Aggregated historical context passed to the Gemini prompt builder.
 * Populated by querying the Recommendation and Activity repositories
 * before calling the AI.
 */
@Data
@Builder
public class UserContext {
    private int currentStreak;              // consecutive active days
    private int totalSessions;             // all-time session count
    private Map<String, String> personalRecords; // e.g. {"RUNNING": "42 min @ 520 kcal"}
    private Activity previousActivity;     // the session just before the current one
}
```

#### 6.2 — Contextual Prompt Generation
**File**: `aiservice/src/main/java/com/fitness/aiservice/service/ActivityAIService.java` *(MODIFY)*

The current `createPromptForActivity()` only includes the single activity's metrics. This adds a new `buildContextualPrompt()` that weaves in the full `UserContext`.

```java
/**
 * Builds a rich, personalized prompt by combining the latest activity data
 * with the user's historical context (streak, PRs, previous session).
 *
 * Called instead of createPromptForActivity() when historical data is available.
 */
public String buildContextualPrompt(UserContext userContext, Activity latestActivity) {
    String prForThisType = userContext.getPersonalRecords()
            .getOrDefault(latestActivity.getType().name(), "No PR recorded yet");

    String previousSessionSummary = "None";
    if (userContext.getPreviousActivity() != null) {
        Activity prev = userContext.getPreviousActivity();
        previousSessionSummary = String.format("%s — %d min, %d kcal",
                prev.getType(), prev.getDuration(), prev.getCaloriesBurned());
    }

    return String.format("""
        Analyze this fitness activity with the following user history and provide recommendations in the EXACT JSON format below.

        === User History ===
        Current Streak    : %d consecutive days
        Total Sessions    : %d lifetime sessions
        PR for %s         : %s
        Previous Session  : %s

        === Today's Activity ===
        Activity Type     : %s
        Duration          : %d minutes
        Calories Burned   : %d
        Additional Metrics: %s

        === Required JSON Response Format ===
        {
          "analysis": {
            "overall": "...",
            "pace": "...",
            "heartRate": "...",
            "caloriesBurned": "..."
          },
          "improvements": [
            { "area": "...", "recommendation": "..." }
          ],
          "suggestions": [
            { "workout": "...", "description": "..." }
          ],
          "safety": ["...", "..."]
        }

        Instructions:
        - Reference the user's streak and PR in the 'overall' analysis.
        - If today beats the PR, celebrate it and suggest how to recover properly.
        - If the streak is >= 7 days, include a rest-day recommendation in 'safety'.
        - Provide exactly 3 improvements and 2 next-workout suggestions.
        """,
            userContext.getCurrentStreak(),
            userContext.getTotalSessions(),
            latestActivity.getType(),
            prForThisType,
            previousSessionSummary,
            latestActivity.getType(),
            latestActivity.getDuration(),
            latestActivity.getCaloriesBurned(),
            latestActivity.getAdditionalMetrics()
    );
}
```

#### 6.3 — Wire Context into Recommendation Flow
**File**: `aiservice/src/main/java/com/fitness/aiservice/service/ActivityAIService.java` *(MODIFY)*

Update `generateRecommendation()` to fetch context before building the prompt:

```java
public Recommendation generateRecommendation(Activity activity) {
    // 1. Fetch all past activities for this user to compute context
    List<Recommendation> pastRecs = recommendationRepository.findByUserId(activity.getUserId());

    // 2. Build lightweight UserContext (streak + PRs derived from saved recommendations)
    UserContext userContext = buildUserContext(activity.getUserId(), activity, pastRecs);

    // 3. Use the richer, context-aware prompt
    String prompt = buildContextualPrompt(userContext, activity);
    String aiResponse = geminiService.getAnswer(prompt);
    log.info("AI response for activity {}: {}", activity.getId(), aiResponse);

    return processAiResponse(activity, aiResponse);
}

private UserContext buildUserContext(String userId, Activity current,
                                    List<Recommendation> pastRecs) {
    // Count total sessions (each recommendation corresponds to one activity)
    int totalSessions = pastRecs.size();

    // Derive personal records: best (max calories) per activity type from past recs
    Map<String, String> personalRecords = pastRecs.stream()
            .collect(Collectors.groupingBy(
                    r -> r.getActivityType().name(),
                    Collectors.collectingAndThen(
                            Collectors.maxBy(Comparator.comparingInt(
                                    r -> parseCaloriesFromRec(r.getRecommendation()))),
                            opt -> opt.map(r -> r.getRecommendation()
                                    .lines().findFirst().orElse(""))
                                    .orElse("No PR yet")
                    )
            ));

    return UserContext.builder()
            .currentStreak(0)         // implement streak calculation in Phase 5
            .totalSessions(totalSessions)
            .personalRecords(personalRecords)
            .previousActivity(null)   // fetch from activity repository if needed
            .build();
}

private int parseCaloriesFromRec(String recommendation) {
    // Stub — extract calories from the stored recommendation text
    // Replace with a proper DTO field once the data model is richer
    return 0;
}
```

---

## File Change Summary

```
fitness-app/
│
├── .env                                          [NEW] — local secrets (gitignored)
├── docker-compose.yml                            [NEW]
├── .github/workflows/
│   ├── backend.yml                              [NEW]
│   └── frontend.yml                             [NEW]
│
├── userservice/
│   ├── pom.xml                                  [MODIFY] — remove keycloak, add jjwt
│   └── src/main/java/com/fitness/userservice/
│       ├── security/JwtUtil.java                [MODIFY] — fix bugs, complete implementation
│       ├── dto/AuthRequest.java                 [NEW]
│       ├── dto/AuthResponse.java                [NEW]
│       └── controller/AuthController.java       [MODIFY] — real login + register logic
│
├── gateway/
│   ├── pom.xml                                  [MODIFY] — remove keycloak, add jjwt
│   └── src/main/java/com/fitness/gateway/
│       └── security/JwtAuthenticationFilter.java [NEW] — replaces KeycloakUserSyncFilter
│
├── activityservice/
│   ├── pom.xml                                  [MODIFY] — replace rabbitmq with kafka
│   └── src/main/java/com/fitness/activityservice/
│       ├── config/KafkaTopicConfig.java         [NEW]
│       ├── service/ActivityService.java         [MODIFY] — RabbitTemplate → KafkaTemplate
│       ├── controller/AnalyticsController.java  [NEW]
│       ├── dto/StreakDto.java                   [NEW]
│       └── dto/WeeklyVolumeDto.java             [NEW]
│
├── aiservice/
│   ├── pom.xml                                  [MODIFY] — replace rabbitmq with kafka
│   └── src/main/java/com/fitness/aiservice/
│       ├── service/ActivityMessageListener.java [MODIFY] — @RabbitListener → @KafkaListener
│       ├── service/ActivityAIService.java       [MODIFY] — add contextual prompt + UserContext
│       └── dto/UserContext.java                 [NEW]
│
└── frontend/
    ├── package.json                             [MODIFY] — add recharts
    └── src/components/Dashboard/
        ├── ProgressChart.jsx                    [NEW]
        └── StreakWidget.jsx                     [NEW]
```

---

## Implementation Order

- [x] **Phase 1** — Docker Compose (Establish baseline infrastructure)
- [X] **Phase 2** — Custom JWT Authentication (Core security)
- [X] **Phase 3** — Kafka Migration (Core asynchronous messaging)
- [ ] **Phase 4** — CI/CD Pipelines (Automate feedback loop)
- [ ] **Phase 5** — Analytics Dashboard (Frontend product features)
- [X] **Phase 6** — Enhanced AI Integration (Advanced features)

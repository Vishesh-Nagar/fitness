# ── Stage 1: build ──────────────────────────────────────────────
FROM eclipse-temurin:23-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and pom first for layer caching
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x mvnw && ./mvnw dependency:go-offline -q

# Copy source and build the fat JAR
COPY src ./src
RUN ./mvnw package -DskipTests -q

# ── Stage 2: runtime ────────────────────────────────────────────
FROM eclipse-temurin:23-jre-alpine
WORKDIR /app

# Non-root user for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]

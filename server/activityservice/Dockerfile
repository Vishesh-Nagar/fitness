# ── Stage 1: build (multi-module parent context) ─────────────────────────────
# Build context must be server/ (the parent directory), not this subdirectory.
# docker build -f activityservice/Dockerfile -t fitness-activityservice .
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and parent pom first (cache-friendly)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Copy common-lib (needed before building activityservice)
COPY common-lib/pom.xml ./common-lib/pom.xml
COPY common-lib/src ./common-lib/src

# Copy activityservice source
COPY activityservice/pom.xml ./activityservice/pom.xml
COPY activityservice/src ./activityservice/src

# Build only common-lib + activityservice (skip other modules)
RUN chmod +x mvnw && ./mvnw package -pl common-lib,activityservice -am -DskipTests -q

# ── Stage 2: runtime ─────────────────────────────────────────────────────────
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/activityservice/target/*.jar app.jar

EXPOSE 8082
ENTRYPOINT ["java", "-jar", "app.jar"]

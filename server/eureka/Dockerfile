# Build context must be server/
# docker build -f eureka/Dockerfile -t fitness-eureka .
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

COPY . .

RUN chmod +x mvnw && ./mvnw package -pl eureka -am -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/eureka/target/*.jar app.jar

EXPOSE 8761
ENTRYPOINT ["java", "-jar", "app.jar"]

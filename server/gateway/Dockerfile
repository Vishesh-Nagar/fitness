# Build context must be server/
# docker build -f gateway/Dockerfile -t fitness-gateway .
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

COPY gateway/pom.xml ./gateway/pom.xml
COPY gateway/src ./gateway/src

RUN chmod +x mvnw && ./mvnw package -pl gateway -am -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/gateway/target/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

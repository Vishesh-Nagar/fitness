# Build context must be server/
# docker build -f aiservice/Dockerfile -t fitness-aiservice .
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

COPY common-lib/pom.xml ./common-lib/pom.xml
COPY common-lib/src ./common-lib/src

COPY aiservice/pom.xml ./aiservice/pom.xml
COPY aiservice/src ./aiservice/src

RUN chmod +x mvnw && ./mvnw package -pl common-lib,aiservice -am -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/aiservice/target/*.jar app.jar

EXPOSE 8083
ENTRYPOINT ["java", "-jar", "app.jar"]

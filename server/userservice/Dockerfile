# Build context must be server/
# docker build -f userservice/Dockerfile -t fitness-userservice .
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

COPY common-lib/pom.xml ./common-lib/pom.xml
COPY common-lib/src ./common-lib/src

COPY userservice/pom.xml ./userservice/pom.xml
COPY userservice/src ./userservice/src

RUN chmod +x mvnw && ./mvnw package -pl common-lib,userservice -am -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/userservice/target/*.jar app.jar

EXPOSE 8081
ENTRYPOINT ["java", "-jar", "app.jar"]

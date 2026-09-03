# Build context must be server/
# docker build -f configserver/Dockerfile -t fitness-configserver .
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
COPY configserver/pom.xml ./configserver/pom.xml
COPY configserver/src ./configserver/src

RUN chmod +x mvnw && ./mvnw package -pl configserver -am -DskipTests -q

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

COPY --from=builder /app/configserver/target/*.jar app.jar

EXPOSE 8888
ENTRYPOINT ["java", "-jar", "app.jar"]

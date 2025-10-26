# syntax=docker/dockerfile:1
FROM eclipse-temurin:17-jdk AS builder
WORKDIR /app
COPY src ./src
COPY scripts ./scripts
RUN bash scripts/package.sh

FROM eclipse-temurin:17-jre
WORKDIR /app
COPY --from=builder /app/build/fittrack-backend.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java","-jar","/app/app.jar"]

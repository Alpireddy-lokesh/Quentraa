# Multi-stage build for Quentraa backend
FROM eclipse-temurin:21-jre-alpine AS runtime

WORKDIR /app

# Create a non-root user
RUN addgroup -S quentraa && adduser -S quentraa -G quentraa

# Copy the built jar
COPY target/quentraa-backend-0.0.1-SNAPSHOT.jar app.jar

RUN chown -R quentraa:quentraa /app
USER quentraa

# Port exposed by the application
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=30s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", "-jar", "/app/app.jar"]

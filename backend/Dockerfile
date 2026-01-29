# =============================================
# Dockerfile - Gestionale Motel Backend
# Build: docker build -t gestionale-motel-backend .
# =============================================

# --- Stage 1: Build ---
FROM maven:3.9-eclipse-temurin-21-alpine AS build

WORKDIR /app

# Copia solo i file necessari per le dipendenze (cache layer)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copia il codice sorgente e compila
COPY src ./src
RUN mvn clean package -DskipTests -B

# --- Stage 2: Runtime ---
FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

# Crea utente non-root per sicurezza
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Crea directory per i log
RUN mkdir -p /var/log/gestionale-motel && chown appuser:appgroup /var/log/gestionale-motel

# Copia il JAR dalla stage di build
COPY --from=build /app/target/*.jar app.jar

# Cambia proprietario
RUN chown appuser:appgroup app.jar

# Usa utente non-root
USER appuser

# Espone la porta
EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/api/health || exit 1

# Avvia l'applicazione con profilo produzione
ENTRYPOINT ["java", "-jar", "-Dspring.profiles.active=prod", "app.jar"]

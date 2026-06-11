# ---- Stage 1: build the React frontend ----
FROM node:22-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm install --no-audit --no-fund
COPY frontend/ ./
# vite.config.js outputs to ../backend/src/main/resources/static
COPY backend/ /app/backend/
RUN npm run build

# ---- Stage 2: build the Spring Boot JAR ----
FROM maven:3.9-eclipse-temurin-21 AS backend
WORKDIR /app/backend
COPY --from=frontend /app/backend/ ./
RUN mvn -B package -DskipTests

# ---- Stage 3: runtime ----
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=backend /app/backend/target/golf-course-finder-1.0.0.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# Build stage
FROM eclipse-temurin:21-jdk-alpine AS builder
WORKDIR /app

# Copy Maven wrapper and pom.xml to cache dependencies
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./
RUN chmod +x ./mvnw
RUN ./mvnw dependency:go-offline -B

# Copy source code and package application
COPY src ./src
RUN ./mvnw clean package -DskipTests -B

# Production stage
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copy built JAR artifact from build stage
COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]

# Use a Maven image to build the application
FROM maven:3.8.4-openjdk-17 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy the pom.xml file and the source code to the working directory
COPY pom.xml .
COPY src ./src

# Build the application
RUN mvn clean package

# Use a lightweight JDK image to run the application
FROM openjdk:17-jdk-slim

# Expose the application port
EXPOSE 8080

# Copy the built JAR file from the build stage to the run stage
COPY --from=build /app/target/chat-0.0.1-SNAPSHOT.jar chat.jar

# Set the entrypoint to run the JAR file
ENTRYPOINT ["java", "-jar", "chat.jar"]

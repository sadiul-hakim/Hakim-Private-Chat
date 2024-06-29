FROM ubuntu:latest AS build

RUN apt-get update
RUN apt-get install openjdk-17-jdk -y
COPY . .

RUN mvnw clean
RUN mvnw compile
RUN mvnw package

FROM openjdk:17-jdk-slim

EXPOSE 8080

COPY --from=build /target/chat-0.0.1-SNAPSHOT.jar chat.jar

ENTRYPOINT ["java", "-jar", "chat.jar"]
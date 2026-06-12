FROM eclipse-temurin:21-jdk-jammy AS build

WORKDIR /app

COPY . .

RUN chmod +x gradlew && ./gradlew clean build -x test

FROM eclipse-temurin:21-jre-jammy

WORKDIR /app

COPY --from=build /app/zeePlus-server/build/libs/*.jar app.jar

EXPOSE 8084

ENTRYPOINT ["java", "-jar", "app.jar"]

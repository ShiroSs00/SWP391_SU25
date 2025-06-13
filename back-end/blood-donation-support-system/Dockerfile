# Bước 1: Build project bằng Maven
FROM maven:3.9.4-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Bước 2: Dùng JDK 21 để chạy jar
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Lấy file JAR đã build từ bước trước (sửa lại tên nếu khác)
COPY --from=build /app/target/*.jar app.jar

# Cấu hình port (nếu bạn dùng Spring Boot thì thường là 8080)
EXPOSE 8080

# Chạy ứng dụng
ENTRYPOINT ["java", "-jar", "app.jar"]

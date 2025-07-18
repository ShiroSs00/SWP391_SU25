package com.swp391.bloodcare.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        String projectPath = System.getProperty("user.dir");
        String imagePath = "file:///" + projectPath + "/uploads/";

        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(imagePath)
                .setCachePeriod(3600); // Optional: cache ảnh
    }
}

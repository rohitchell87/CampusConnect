package com.campusconnect.backend.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI campusConnectOpenAPI() {
        return new OpenAPI()
                .components(new Components())
                .info(new Info()
                        .title("CampusConnect API")
                        .description("Backend APIs for CampusConnect social networking platform.")
                        .version("v1")
                );
    }
}

package com.major.api_gateway;
import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsConfigurationSource;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

import java.util.Collections;

import static org.springframework.web.reactive.function.server.RouterFunctions.route;

@Configuration
public class AppConfig {


    @Bean
    public CorsWebFilter corsWebFilter() {
        CorsConfiguration corsConfig = new CorsConfiguration();
        corsConfig.setAllowedOrigins(Collections.singletonList("http://localhost:4200"));
        corsConfig.setAllowedMethods(Collections.singletonList("*"));
        corsConfig.setAllowedHeaders(Collections.singletonList("*"));
        corsConfig.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfig);

        return new CorsWebFilter((CorsConfigurationSource) source);
    }
    @Bean
    public RouteLocator getRoutes(RouteLocatorBuilder builder){
        return builder.routes()
                .route(p->p
                        .path("/api/v1/**")
                        .uri("http://localhost:9000/*"))
                .route(p->p
                        .path("/food-app/admin/**","/orders/**","/**","/food-app/**","/pg")
                        .uri("http://localhost:8888/*"))
                .build();
    }
}

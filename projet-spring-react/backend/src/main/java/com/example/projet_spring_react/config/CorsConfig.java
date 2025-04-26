package com.example.projet_spring_react.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.web.filter.CorsFilter;

@Configuration
public class CorsConfig {

    @Bean
    public CorsFilter corsFilter() {
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        CorsConfiguration config = new CorsConfiguration();
        
        // Permet les credentials (cookies, auth headers)
        config.setAllowCredentials(true);
        
        // Permet l'origine React
        config.addAllowedOrigin("http://localhost:3000");
        
        // Permet tous les headers, notamment Authorization
        config.addAllowedHeader("*");
        
        // Permet toutes les méthodes HTTP
        config.addAllowedMethod("*");
        
        // Expose les headers personnalisés dans la réponse
        config.addExposedHeader("Authorization");
        
        source.registerCorsConfiguration("/**", config);
        return new CorsFilter(source);
    }
}
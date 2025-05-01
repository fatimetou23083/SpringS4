package com.example.projet_spring_react.config;

import java.io.IOException;

import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class AuthFilter implements Filter {

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        HttpServletRequest httpRequest = (HttpServletRequest) request;
        HttpServletResponse httpResponse = (HttpServletResponse) response;
        
        String path = httpRequest.getRequestURI();
        
        // Permet l'accès sans authentification aux endpoints de login, CORS, Swagger et salaires
        if (path.contains("/api/auth/login") || 
            httpRequest.getMethod().equals("OPTIONS") ||
            path.contains("/swagger-ui") ||
            path.contains("/v3/api-docs") ||
            path.contains("/swagger-ui.html") ||
            path.contains("/swagger-resources") ||
            path.contains("/webjars") ||
            path.contains("/api/salaires")) {  // Ajoutez cette ligne
            chain.doFilter(request, response);
            return;
        }
        
        // Pour les autres endpoints, vérifier le token
        String authHeader = httpRequest.getHeader("Authorization");
        
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            // Pour cette démo, on accepte le token "dummy-token-123"
            if ("dummy-token-123".equals(token)) {
                chain.doFilter(request, response);
                return;
            }
        }
        
        // Si on arrive ici, l'authentification a échoué
        httpResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        httpResponse.getWriter().write("Unauthorized");
    }
}
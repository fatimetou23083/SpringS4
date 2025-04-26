// src/main/java/com/example/projet_spring_react/controller/AuthController.java
package com.example.projet_spring_react.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {
        String username = loginRequest.get("username");
        String password = loginRequest.get("password");
        
        // Pour l'exemple, on accepte admin/admin123
        if ("admin".equals(username) && "admin123".equals(password)) {
            Map<String, String> response = new HashMap<>();
            response.put("accessToken", "dummy-token-123");
            response.put("username", username);
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
}
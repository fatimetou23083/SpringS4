package com.example.projet_spring_react.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.projet_spring_react.model.Employe;
import com.example.projet_spring_react.repository.EmployeRepository;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/employes")
@Tag(name = "Gestion des employés", description = "API pour les opérations CRUD sur les employés")
public class EmployeController {

    @Autowired
    private EmployeRepository employeRepository;

    @GetMapping
    @Operation(summary = "Liste tous les employés")
    public List<Employe> getAllEmployes() {
        return employeRepository.findAll();
    }

    @GetMapping("/{id}")
    @Operation(summary = "Récupère un employé par son ID")
    public ResponseEntity<Employe> getEmployeById(@PathVariable Long id) {
        Optional<Employe> employe = employeRepository.findById(id);
        return employe.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    @Operation(summary = "Crée un nouvel employé")
    public Employe createEmploye(@Valid @RequestBody Employe employe) {
        return employeRepository.save(employe);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Met à jour un employé existant")
    public ResponseEntity<Employe> updateEmploye(@PathVariable Long id, @RequestBody Employe employeDetails) {
        Optional<Employe> optionalEmploye = employeRepository.findById(id);
        if (optionalEmploye.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        
        Employe employe = optionalEmploye.get();
        employe.setNom(employeDetails.getNom());
        // Ne mettre à jour le password que s'il est fourni
        if (employeDetails.getPassword() != null && !employeDetails.getPassword().isEmpty()) {
            employe.setPassword(employeDetails.getPassword());
        }
        employe.setPrenom(employeDetails.getPrenom());
        employe.setDepartement(employeDetails.getDepartement());
        employe.setSalaire(employeDetails.getSalaire());
        
        Employe updatedEmploye = employeRepository.save(employe);
        return ResponseEntity.ok(updatedEmploye);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Supprime un employé")
    public ResponseEntity<Void> deleteEmploye(@PathVariable Long id) {
        if (employeRepository.existsById(id)) {
            employeRepository.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}
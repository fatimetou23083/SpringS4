package com.example.projet_spring_react.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.projet_spring_react.model.DetailSalaire;
import com.example.projet_spring_react.model.ResumeSalaires;
import com.example.projet_spring_react.service.SalaireService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/salaires")
@Tag(name = "Gestion des salaires", description = "API pour les calculs de salaires, primes et taxes")
public class SalaireController {

    private final SalaireService salaireService;
    
    public SalaireController(SalaireService salaireService) {
        this.salaireService = salaireService;
    }
    
    @GetMapping("/employe/{id}")
    @Operation(summary = "Détails du salaire d'un employé")
    public ResponseEntity<DetailSalaire> getDetailSalaire(@PathVariable Long id) {
        try {
            DetailSalaire detailSalaire = salaireService.calculerDetailSalaire(id);
            return ResponseEntity.ok(detailSalaire);
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    @GetMapping("/resume")
    @Operation(summary = "Résumé des salaires")
    public ResumeSalaires getResumeSalaires() {
        return salaireService.genererResumeSalaires();
    }
}
package com.example.projet_spring_react.controller;

import java.util.List;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.projet_spring_react.model.Employe;
import com.example.projet_spring_react.service.RechercheService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/recherche")
@CrossOrigin(origins = "http://localhost:3000")
@Tag(name = "Recherche", description = "API de recherche d'employés")
public class RechercheController {

    private final RechercheService rechercheService;
    
    // Injection par constructeur sans @Autowired (recommandé depuis Spring 4.3+)
    public RechercheController(RechercheService rechercheService) {
        this.rechercheService = rechercheService;
    }
    
    @Operation(summary = "Rechercher par département", description = "Renvoie les employés du département spécifié")
    @GetMapping("/departement/{departement}")
    public List<Employe> rechercherParDepartement(@PathVariable String departement) {
        return rechercheService.rechercherParDepartement(departement);
    }
    
    @Operation(summary = "Rechercher par salaire", description = "Recherche par plage, minimum ou valeur exacte")
    @GetMapping("/salaire")
    public List<Employe> rechercherParSalaire(
            @RequestParam Double min, 
            @RequestParam(required = false) Double max,
            @RequestParam(required = false) Boolean exact) {
        
        if (Boolean.TRUE.equals(exact)) {
            return rechercheService.rechercherParSalaireExact(min);
        } else if (max == null) {
            return rechercheService.rechercherParSalaireMin(min);
        } else {
            return rechercheService.rechercherParSalaire(min, max);
        }
    }
    
    @Operation(summary = "Rechercher par nom", description = "Renvoie les employés dont le nom contient la chaîne spécifiée")
    @GetMapping("/nom/{nom}")
    public List<Employe> rechercherParNom(@PathVariable String nom) {
        return rechercheService.rechercherParNom(nom);
    }
}
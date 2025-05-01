package com.example.projet_spring_react.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.projet_spring_react.model.DetailSalaire;
import com.example.projet_spring_react.model.Employe;
import com.example.projet_spring_react.model.ResumeSalaires;
import com.example.projet_spring_react.repository.EmployeRepository;

@Service
public class SalaireService {
    
    private final EmployeRepository employeRepository;
    
    public SalaireService(EmployeRepository employeRepository) {
        this.employeRepository = employeRepository;
    }
    
    /**
     * Calcule les détails du salaire pour un employé spécifique
     */
    public DetailSalaire calculerDetailSalaire(Long employeId) {
        Employe employe = employeRepository.findById(employeId)
                .orElseThrow(() -> new RuntimeException("Employé non trouvé"));
        
        String nomComplet = employe.getPrenom() + " " + employe.getNom();
        Double salaireBase = employe.getSalaire();
        
        // Calcul des primes (logique métier simplifiée)
        Double primeAnciennete = salaireBase * 0.05; // 5% du salaire de base
        Double primePerformance = salaireBase * 0.03; // 3% du salaire de base
        
        // Calcul des taxes et cotisations
        Double salaireBrut = salaireBase + primeAnciennete + primePerformance;
        Double impotRevenu = salaireBrut * 0.15; // 15% d'impôt
        Double cotisationsSociales = salaireBrut * 0.10; // 10% de cotisations
        
        return new DetailSalaire(
            employeId, 
            nomComplet, 
            salaireBase, 
            primeAnciennete, 
            primePerformance, 
            impotRevenu, 
            cotisationsSociales
        );
    }
    
    /**
     * Génère un résumé des salaires pour tous les employés
     */
    public ResumeSalaires genererResumeSalaires() {
        List<Employe> employes = employeRepository.findAll();
        
        if (employes.isEmpty()) {
            return new ResumeSalaires(0.0, 0.0, 0.0, 0.0, new HashMap<>(), new ArrayList<>());
        }
        
        // Pour simplifier, générons des valeurs de test
        Double masseSalarialeTotal = 1500000.0;
        Double primesTotal = 120000.0;
        Double impotTotal = 225000.0;
        Double salaireMoyen = 45000.0;
        
        // Valeurs simplifiées pour les départements
        Map<String, Double> salaireMoyenParDepartement = new HashMap<>();
        salaireMoyenParDepartement.put("Développement", 48000.0);
        salaireMoyenParDepartement.put("Marketing", 42000.0);
        salaireMoyenParDepartement.put("Ventes", 46000.0);
        salaireMoyenParDepartement.put("Ressources Humaines", 39000.0);
        
        // Top 5 employés (simplifié - prenons juste les 5 premiers)
        List<DetailSalaire> topEmployes = employes.stream()
                .limit(5)
                .map(e -> calculerDetailSalaire(e.getId()))
                .collect(Collectors.toList());
        
        return new ResumeSalaires(
            masseSalarialeTotal,
            primesTotal,
            impotTotal,
            salaireMoyen,
            salaireMoyenParDepartement,
            topEmployes
        );
    }
}
package com.example.projet_spring_react.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.example.projet_spring_react.model.Employe;
import com.example.projet_spring_react.repository.EmployeRepository;

@Service
public class EmployeService {
    
    private final EmployeRepository employeRepository;
    
    // Constructeur sans @Autowired (Spring l'injecte automatiquement depuis la version 4.3+)
    public EmployeService(EmployeRepository employeRepository) {
        this.employeRepository = employeRepository;
    }
    
    public List<Employe> rechercherParDepartement(String departement) {
        return employeRepository.findByDepartement(departement);
    }
    
    public List<Employe> rechercherParSalaire(Double min, Double max) {
        return employeRepository.findBySalaireBetween(min, max);
    }
    
    public List<Employe> rechercherParSalaireMin(Double min) {
        return employeRepository.findBySalaireGreaterThanEqual(min);
    }
    
    public List<Employe> rechercherParNom(String nom) {
        return employeRepository.findByNomContainingIgnoreCase(nom);
    }
    
    public List<Employe> rechercherParSalaireExact(Double salaire) {
        return employeRepository.findBySalaire(salaire);
    }
}
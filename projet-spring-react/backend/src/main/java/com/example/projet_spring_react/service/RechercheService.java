package com.example.projet_spring_react.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.projet_spring_react.model.Employe;
import com.example.projet_spring_react.repository.EmployeRepository;

@Service
public class RechercheService {
    
    @Autowired
    private EmployeRepository employeRepository;
    
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
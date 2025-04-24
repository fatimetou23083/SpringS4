package com.example.projet_spring_react.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.projet_spring_react.model.Employe;

public interface EmployeRepository extends JpaRepository<Employe, Long> {
    List<Employe> findByDepartement(String departement);
    List<Employe> findBySalaireBetween(Double min, Double max);
    List<Employe> findBySalaireGreaterThanEqual(Double min);
    List<Employe> findByNomContainingIgnoreCase(String nom);
    List<Employe> findBySalaire(Double salaire);
}
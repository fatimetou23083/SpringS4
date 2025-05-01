package com.example.projet_spring_react.model;

import java.util.List;
import java.util.Map;

public class ResumeSalaires {
    private Double masseSalarialeTotal;
    private Double primesTotal;
    private Double impotTotal;
    private Double salaireMoyen;
    private Map<String, Double> salaireMoyenParDepartement;
    private List<DetailSalaire> topEmployes;

    public ResumeSalaires() {
    }

    public ResumeSalaires(Double masseSalarialeTotal, Double primesTotal, Double impotTotal, Double salaireMoyen,
                          Map<String, Double> salaireMoyenParDepartement, List<DetailSalaire> topEmployes) {
        this.masseSalarialeTotal = masseSalarialeTotal;
        this.primesTotal = primesTotal;
        this.impotTotal = impotTotal;
        this.salaireMoyen = salaireMoyen;
        this.salaireMoyenParDepartement = salaireMoyenParDepartement;
        this.topEmployes = topEmployes;
    }

    // Getters et Setters
    public Double getMasseSalarialeTotal() {
        return masseSalarialeTotal;
    }

    public void setMasseSalarialeTotal(Double masseSalarialeTotal) {
        this.masseSalarialeTotal = masseSalarialeTotal;
    }

    public Double getPrimesTotal() {
        return primesTotal;
    }

    public void setPrimesTotal(Double primesTotal) {
        this.primesTotal = primesTotal;
    }

    public Double getImpotTotal() {
        return impotTotal;
    }

    public void setImpotTotal(Double impotTotal) {
        this.impotTotal = impotTotal;
    }

    public Double getSalaireMoyen() {
        return salaireMoyen;
    }

    public void setSalaireMoyen(Double salaireMoyen) {
        this.salaireMoyen = salaireMoyen;
    }

    public Map<String, Double> getSalaireMoyenParDepartement() {
        return salaireMoyenParDepartement;
    }

    public void setSalaireMoyenParDepartement(Map<String, Double> salaireMoyenParDepartement) {
        this.salaireMoyenParDepartement = salaireMoyenParDepartement;
    }

    public List<DetailSalaire> getTopEmployes() {
        return topEmployes;
    }

    public void setTopEmployes(List<DetailSalaire> topEmployes) {
        this.topEmployes = topEmployes;
    }
}
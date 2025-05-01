package com.example.projet_spring_react.model;

public class DetailSalaire {
    private Long employeId;
    private String nomComplet;
    private Double salaireBase;
    private Double primeAnciennete;
    private Double primePerformance;
    private Double impotRevenu;
    private Double cotisationsSociales;
    private Double salaireNet;

    // Constructeur par défaut
    public DetailSalaire() {
    }

    // Constructeur complet
    public DetailSalaire(Long employeId, String nomComplet, Double salaireBase, Double primeAnciennete, 
                          Double primePerformance, Double impotRevenu, Double cotisationsSociales) {
        this.employeId = employeId;
        this.nomComplet = nomComplet;
        this.salaireBase = salaireBase;
        this.primeAnciennete = primeAnciennete;
        this.primePerformance = primePerformance;
        this.impotRevenu = impotRevenu;
        this.cotisationsSociales = cotisationsSociales;
        // Calcul automatique du salaire net
        this.salaireNet = salaireBase + primeAnciennete + primePerformance - impotRevenu - cotisationsSociales;
    }

    // Getters et Setters
    public Long getEmployeId() {
        return employeId;
    }

    public void setEmployeId(Long employeId) {
        this.employeId = employeId;
    }

    public String getNomComplet() {
        return nomComplet;
    }

    public void setNomComplet(String nomComplet) {
        this.nomComplet = nomComplet;
    }

    public Double getSalaireBase() {
        return salaireBase;
    }

    public void setSalaireBase(Double salaireBase) {
        this.salaireBase = salaireBase;
    }

    public Double getPrimeAnciennete() {
        return primeAnciennete;
    }

    public void setPrimeAnciennete(Double primeAnciennete) {
        this.primeAnciennete = primeAnciennete;
    }

    public Double getPrimePerformance() {
        return primePerformance;
    }

    public void setPrimePerformance(Double primePerformance) {
        this.primePerformance = primePerformance;
    }

    public Double getImpotRevenu() {
        return impotRevenu;
    }

    public void setImpotRevenu(Double impotRevenu) {
        this.impotRevenu = impotRevenu;
    }

    public Double getCotisationsSociales() {
        return cotisationsSociales;
    }

    public void setCotisationsSociales(Double cotisationsSociales) {
        this.cotisationsSociales = cotisationsSociales;
    }

    public Double getSalaireNet() {
        return salaireNet;
    }

    public void setSalaireNet(Double salaireNet) {
        this.salaireNet = salaireNet;
    }
}
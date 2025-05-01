import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DetailSalaire.css';

function DetailSalaire() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [detailSalaire, setDetailSalaire] = useState(null);
    const [employe, setEmploye] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Récupérer les informations de base de l'employé
                const employeResponse = await axios.get(`http://localhost:8081/api/employes/${id}`, {
                    headers: {
                        'Authorization': `Bearer dummy-token-123`
                    }
                });
                setEmploye(employeResponse.data);
                
                // Récupérer les détails du salaire
                const salaireResponse = await axios.get(`http://localhost:8081/api/salaires/employe/${id}`, {
                    headers: {
                        'Authorization': `Bearer dummy-token-123`
                    }
                });
                setDetailSalaire(salaireResponse.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    if (loading) return <div className="loading">Chargement...</div>;
    if (error) return <div className="error">Erreur: {error}</div>;
    if (!detailSalaire || !employe) return <div className="not-found">Données de salaire non trouvées</div>;

    // Calcul des pourcentages pour l'affichage visuel
    const totalPrimes = detailSalaire.primeAnciennete + detailSalaire.primePerformance;
    const totalDeductions = detailSalaire.impotRevenu + detailSalaire.cotisationsSociales;
    const salaireBrut = detailSalaire.salaireBase + totalPrimes;
    
    const primesPercent = (totalPrimes / salaireBrut) * 100;
    const deductionsPercent = (totalDeductions / salaireBrut) * 100;
    const netPercent = (detailSalaire.salaireNet / salaireBrut) * 100;

    // Fonction pour formater les nombres avec la locale
    const formatNumber = (value) => {
        return value ? value.toLocaleString() : '0';
    };

    return (
        <div className="detail-salaire-container">
            <h2>Détails du salaire de {detailSalaire.nomComplet}</h2>
            
            <div className="card info-card">
                <div className="card-header">Informations générales</div>
                <div className="card-body">
                    <div className="info-row">
                        <span className="label">Nom complet:</span>
                        <span className="value">{detailSalaire.nomComplet}</span>
                    </div>
                    <div className="info-row">
                        <span className="label">Département:</span>
                        <span className="value">{employe.departement}</span>
                    </div>
                </div>
            </div>
            
            <div className="card">
                <div className="card-header">Décomposition du salaire</div>
                <div className="card-body">
                    <div className="salaire-grid">
                        <div className="salaire-item">
                            <h3>Salaire de base</h3>
                            <div className="amount">{formatNumber(detailSalaire.salaireBase)} €</div>
                        </div>
                        
                        <div className="salaire-item">
                            <h3>Primes</h3>
                            <div className="amount positive">{formatNumber(totalPrimes)} €</div>
                            <div className="breakdown">
                                <div className="breakdown-item">
                                    <span>Prime d'ancienneté:</span>
                                    <span>{formatNumber(detailSalaire.primeAnciennete)} €</span>
                                </div>
                                <div className="breakdown-item">
                                    <span>Prime de performance:</span>
                                    <span>{formatNumber(detailSalaire.primePerformance)} €</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="salaire-item">
                            <h3>Déductions</h3>
                            <div className="amount negative">-{formatNumber(totalDeductions)} €</div>
                            <div className="breakdown">
                                <div className="breakdown-item">
                                    <span>Impôt sur le revenu:</span>
                                    <span>{formatNumber(detailSalaire.impotRevenu)} €</span>
                                </div>
                                <div className="breakdown-item">
                                    <span>Cotisations sociales:</span>
                                    <span>{formatNumber(detailSalaire.cotisationsSociales)} €</span>
                                </div>
                            </div>
                        </div>
                        
                        <div className="salaire-item total">
                            <h3>Salaire Net</h3>
                            <div className="amount">{formatNumber(detailSalaire.salaireNet)} €</div>
                        </div>
                    </div>
                    
                    <div className="visual-breakdown">
                        <div className="bar-container">
                            <div className="bar-segment base" style={{width: '100%'}}>
                                <span>Salaire Base: {formatNumber(detailSalaire.salaireBase)} €</span>
                            </div>
                        </div>
                        
                        <div className="bar-container">
                            <div className="bar-segment primes" style={{width: `${primesPercent}%`}}>
                                <span>Primes: {formatNumber(totalPrimes)} €</span>
                            </div>
                        </div>
                        
                        <div className="bar-container">
                            <div className="bar-segment deductions" style={{width: `${deductionsPercent}%`}}>
                                <span>Déductions: {formatNumber(totalDeductions)} €</span>
                            </div>
                        </div>
                        
                        <div className="bar-container">
                            <div className="bar-segment net" style={{width: `${netPercent}%`}}>
                                <span>Net: {formatNumber(detailSalaire.salaireNet)} €</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div className="actions">
                <button className="btn btn-secondary" onClick={() => navigate('/employes')}>
                    Retour à la liste des employés
                </button>
                <button className="btn btn-primary" onClick={() => navigate('/dashboard-salaires')}>
                    Voir le tableau de bord des salaires
                </button>
            </div>
        </div>
    );
}

export default DetailSalaire;
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import './Dashboard.css';

function DashboardSalaires() {
    const navigate = useNavigate();
    const [resumeSalaires, setResumeSalaires] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/salaires/resume', {
                    headers: {
                        'Authorization': `Bearer dummy-token-123`
                    }
                });
                setResumeSalaires(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div className="loading">Chargement du tableau de bord...</div>;
    if (error) return <div className="error">Erreur: {error}</div>;
    if (!resumeSalaires) return <div className="not-found">Données du résumé non trouvées</div>;

    // Préparation des données pour les graphiques
    const pieData = [
        { name: 'Salaires de base', value: resumeSalaires.masseSalarialeTotal - resumeSalaires.primesTotal },
        { name: 'Primes', value: resumeSalaires.primesTotal },
    ];

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

    // S'assurer que salaireMoyenParDepartement existe avant de l'utiliser
    const departementData = resumeSalaires.salaireMoyenParDepartement 
        ? Object.entries(resumeSalaires.salaireMoyenParDepartement).map(
            ([departement, salaireMoyen], index) => ({
                departement,
                salaireMoyen,
                color: COLORS[index % COLORS.length]
            })
        )
        : [];

    const formatCurrency = (value) => {
        return typeof value === 'number' ? `${value.toLocaleString()} €` : '0 €';
    };

    // S'assurer que topEmployes existe et est un tableau
    const topEmployes = Array.isArray(resumeSalaires.topEmployes) ? resumeSalaires.topEmployes : [];

    return (
        <div className="dashboard-container">
            <h2>Tableau de bord des salaires</h2>
            
            <div className="dashboard-summary">
                <div className="summary-card">
                    <div className="summary-value">{formatCurrency(resumeSalaires.masseSalarialeTotal)}</div>
                    <div className="summary-label">Masse salariale totale</div>
                </div>
                <div className="summary-card">
                    <div className="summary-value">{formatCurrency(resumeSalaires.primesTotal)}</div>
                    <div className="summary-label">Total des primes</div>
                </div>
                <div className="summary-card">
                    <div className="summary-value">{formatCurrency(resumeSalaires.impotTotal)}</div>
                    <div className="summary-label">Total des impôts</div>
                </div>
                <div className="summary-card">
                    <div className="summary-value">{formatCurrency(resumeSalaires.salaireMoyen)}</div>
                    <div className="summary-label">Salaire moyen</div>
                </div>
            </div>
            
            <div className="dashboard-charts">
                <div className="chart-container">
                    <h3>Répartition de la masse salariale</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={pieData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {pieData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                
                <div className="chart-container">
                    <h3>Salaire moyen par département</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={departementData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="departement" />
                            <YAxis tickFormatter={formatCurrency} />
                            <Tooltip formatter={(value) => formatCurrency(value)} />
                            <Legend />
                            <Bar dataKey="salaireMoyen" fill="#8884d8">
                                {departementData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
            
            <div className="top-employes">
                <h3>Top 5 des employés les mieux rémunérés</h3>
                <div className="tableau">
                    {topEmployes.length > 0 ? (
                        <table>
                            <thead>
                                <tr>
                                    <th>Nom</th>
                                    <th>Salaire de base</th>
                                    <th>Primes</th>
                                    <th>Salaire net</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topEmployes.map((employe) => (
                                    <tr key={employe.employeId}>
                                        <td>{employe.nomComplet}</td>
                                        <td>{formatCurrency(employe.salaireBase)}</td>
                                        <td>{formatCurrency((employe.primeAnciennete || 0) + (employe.primePerformance || 0))}</td>
                                        <td>{formatCurrency(employe.salaireNet)}</td>
                                        <td>
                                            <button 
                                                className="btn btn-info btn-sm"
                                                onClick={() => navigate(`/salaires/employe/${employe.employeId}`)}
                                            >
                                                Détails
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <div className="no-data">Aucune donnée disponible</div>
                    )}
                </div>
            </div>
            
            <div className="dashboard-actions">
                <button className="btn btn-secondary" onClick={() => navigate('/employes')}>
                    Retour à la liste des employés
                </button>
            </div>
        </div>
    );
}

export default DashboardSalaires;
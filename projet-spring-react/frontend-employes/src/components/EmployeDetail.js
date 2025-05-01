import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

function EmployeDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employe, setEmploye] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmploye = async () => {
            try {
                const response = await axios.get(`http://localhost:8081/api/employes/${id}`);
                setEmploye(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEmploye();
    }, [id]);

    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:8081/api/employes/${id}`);
            navigate('/employes');
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;
    if (!employe) return <div>Employé non trouvé</div>;

    return (
        <div className="container mt-5">
            <h2>Détails de l'employé</h2>
            <div className="card">
                <div className="card-body">
                    <h5 className="card-title">{employe.prenom} {employe.nom}</h5>
                    <p className="card-text">
                        <strong>Département:</strong> {employe.departement}<br />
                        <strong>Salaire:</strong> {employe.salaire.toLocaleString()} €
                    </p>
                    <div className="d-flex gap-2">
                        <button 
                            onClick={() => navigate(`/employes/edit/${employe.id}`)} 
                            className="btn btn-warning"
                        >
                            Modifier
                        </button>
                        <button 
                            onClick={handleDelete} 
                            className="btn btn-danger"
                        >
                            Supprimer
                        </button>
                        <button 
                            onClick={() => navigate('/employes')} 
                            className="btn btn-secondary"
                        >
                            Retour à la liste
                        </button>
                        {/* Nouveau bouton pour accéder aux détails du salaire */}
                        <button 
                            onClick={() => navigate(`/salaires/employe/${employe.id}`)} 
                            className="btn btn-info"
                        >
                            Détails du salaire
                        </button>
                    </div>
                </div>
            </div>
            
            {/* Suggestion pour accéder au tableau de bord des salaires */}
            <div className="mt-3">
                <p>
                    <a href="#" onClick={(e) => { e.preventDefault(); navigate('/dashboard-salaires'); }}>
                        Voir le tableau de bord des salaires pour tous les employés
                    </a>
                </p>
            </div>
        </div>
    );
}

export default EmployeDetail;
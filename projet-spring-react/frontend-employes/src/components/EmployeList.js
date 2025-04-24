import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

function EmployeList() {
    const [employes, setEmployes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchEmployes = async () => {
            try {
                const response = await axios.get('http://localhost:8081/api/employes');
                setEmployes(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };

        fetchEmployes();
    }, []);

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8081/api/employes/${id}`);
            setEmployes(employes.filter(employe => employe.id !== id));
        } catch (err) {
            console.error("Erreur lors de la suppression:", err);
        }
    };

    if (loading) return <div>Chargement...</div>;
    if (error) return <div>Erreur: {error}</div>;

    return (
        <div className="container mt-5">
            <h2>Liste des Employés</h2>
            <Link to="/employes/add" className="btn btn-primary mb-3">Ajouter un employé</Link>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Département</th>
                        <th>Salaire</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {employes.map(employe => (
                        <tr key={employe.id}>
                            <td>{employe.id}</td>
                            <td>{employe.nom}</td>
                            <td>{employe.prenom}</td>
                            <td>{employe.departement}</td>
                            <td>{employe.salaire.toLocaleString()} €</td>
                            <td>
                                <Link to={`/employes/${employe.id}`} className="btn btn-info btn-sm me-2">Voir</Link>
                                <Link to={`/employes/edit/${employe.id}`} className="btn btn-warning btn-sm me-2">Modifier</Link>
                                <button onClick={() => handleDelete(employe.id)} className="btn btn-danger btn-sm">Supprimer</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default EmployeList;
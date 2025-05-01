import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import SearchForm from './SearchForm';

function EmployeList() {
    const navigate = useNavigate();
    const [employes, setEmployes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchEmployes();
    }, []);

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

    const handleDelete = async (id) => {
        if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
            try {
                await axios.delete(`http://localhost:8081/api/employes/${id}`);
                setEmployes(employes.filter(employe => employe.id !== id));
            } catch (err) {
                console.error("Erreur lors de la suppression:", err);
            }
        }
    };

    const handleSearch = async (searchType, searchValue) => {
        if (!searchValue.trim()) {
            fetchEmployes();
            return;
        }
        
        setLoading(true);
        try {
            let response;
            
            switch(searchType) {
                case 'nom':
                    response = await axios.get(`http://localhost:8081/api/recherche/nom/${searchValue}`);
                    break;
                case 'departement':
                    response = await axios.get(`http://localhost:8081/api/recherche/departement/${searchValue}`);
                    break;
                case 'salaire':
                    response = await axios.get(`http://localhost:8081/api/recherche/salaire?min=${searchValue}`);
                    break;
                default:
                    response = await axios.get('http://localhost:8081/api/employes');
            }
            
            setEmployes(response.data);
            setLoading(false);
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    if (loading) return <div className="container mt-5">Chargement...</div>;
    if (error) return <div className="container mt-5">Erreur: {error}</div>;

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>Liste des Employés</h2>
                <div>
                    <Link to="/dashboard-salaires" className="btn btn-info me-2">Tableau de bord des salaires</Link>
                    <Link to="/employes/add" className="btn btn-primary">Ajouter un employé</Link>
                </div>
            </div>
            
            <div className="card mb-4">
                <div className="card-header">Recherche</div>
                <div className="card-body">
                    <SearchForm onSearch={handleSearch} />
                </div>
            </div>
            
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
                                <div className="btn-group" role="group">
                                    <Link to={`/employes/${employe.id}`} className="btn btn-info btn-sm">Voir</Link>
                                    <Link to={`/employes/edit/${employe.id}`} className="btn btn-warning btn-sm">Modifier</Link>
                                    <Link to={`/salaires/employe/${employe.id}`} className="btn btn-primary btn-sm">Salaire</Link>
                                    <button onClick={() => handleDelete(employe.id)} className="btn btn-danger btn-sm">Supprimer</button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            {employes.length === 0 && (
                <div className="alert alert-info">Aucun employé trouvé</div>
            )}
        </div>
    );
}

export default EmployeList;
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';

function EmployeForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [employe, setEmploye] = useState({
        nom: '',
        prenom: '',
        departement: '',
        salaire: '',
        password: ''
    });
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (id) {
            const fetchEmploye = async () => {
                try {
                    const response = await axios.get(`http://localhost:8081/api/employes/${id}`);
                    setEmploye(response.data);
                } catch (err) {
                    console.error("Erreur lors du chargement:", err);
                }
            };
            fetchEmploye();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmploye(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!employe.nom.trim()) newErrors.nom = "Le nom est obligatoire";
        if (!employe.prenom.trim()) newErrors.prenom = "Le prénom est obligatoire";
        if (!employe.departement.trim()) newErrors.departement = "Le département est obligatoire";
        if (!employe.salaire || isNaN(employe.salaire) || employe.salaire <= 0) 
            newErrors.salaire = "Le salaire doit être un nombre positif";
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        try {
            if (id) {
                await axios.put(`http://localhost:8081/api/employes/${id}`, employe);
            } else {
                await axios.post('http://localhost:8081/api/employes', employe);
            }
            navigate('/employes');
        } catch (err) {
            console.error("Erreur lors de l'enregistrement:", err);
        }
    };

    return (
        <div className="container mt-5">
            <h2>{id ? 'Modifier' : 'Ajouter'} un employé</h2>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Nom</label>
                    <input 
                        type="text" 
                        className={`form-control ${errors.nom ? 'is-invalid' : ''}`}
                        name="nom" 
                        value={employe.nom} 
                        onChange={handleChange} 
                    />
                    {errors.nom && <div className="invalid-feedback">{errors.nom}</div>}
                </div>
                <div className="mb-3">
    <label className="form-label">Mot de passe</label>
    <input 
        type="password" 
        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
        name="password" 
        value={employe.password} 
        onChange={handleChange} 
    />
    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
</div>
                <div className="mb-3">
                    <label className="form-label">Prénom</label>
                    <input 
                        type="text" 
                        className={`form-control ${errors.prenom ? 'is-invalid' : ''}`}
                        name="prenom" 
                        value={employe.prenom} 
                        onChange={handleChange} 
                    />
                    {errors.prenom && <div className="invalid-feedback">{errors.prenom}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Département</label>
                    <input 
                        type="text" 
                        className={`form-control ${errors.departement ? 'is-invalid' : ''}`}
                        name="departement" 
                        value={employe.departement} 
                        onChange={handleChange} 
                    />
                    {errors.departement && <div className="invalid-feedback">{errors.departement}</div>}
                </div>
                <div className="mb-3">
                    <label className="form-label">Salaire</label>
                    <input 
                        type="number" 
                        className={`form-control ${errors.salaire ? 'is-invalid' : ''}`}
                        name="salaire" 
                        value={employe.salaire} 
                        onChange={handleChange} 
                        step="0.01"
                    />
                    {errors.salaire && <div className="invalid-feedback">{errors.salaire}</div>}
                </div>
                <button type="submit" className="btn btn-primary me-2">Enregistrer</button>
                <button type="button" className="btn btn-secondary" onClick={() => navigate('/employes')}>Annuler</button>
            </form>
        </div>
    );
}

export default EmployeForm;
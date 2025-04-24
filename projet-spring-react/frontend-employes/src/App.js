import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ApiService from './ApiService';

function App() {
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('nom');
  const [searchValue, setSearchValue] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    departement: '',
    salaire: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchAllEmployes();
  }, []);

  const fetchAllEmployes = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getAllEmployees();
      setEmployes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchValue.trim()) {
      fetchAllEmployes();
      return;
    }
    
    setLoading(true);
    try {
      let response;
      
      switch(searchType) {
        case 'nom':
          // Utilise le endpoint correct pour la recherche par nom
          response = await ApiService.searchByName(searchValue);
          break;
        case 'departement':
          // Utilise le endpoint correct pour la recherche par département
          response = await ApiService.searchByDepartment(searchValue);
          break;
        case 'salaire':
          // Utilise le endpoint correct pour la recherche par salaire minimum
          response = await ApiService.searchBySalaryMin(searchValue);
          break;
        default:
          response = await ApiService.getAllEmployees();
      }
      
      setEmployes(response.data);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await ApiService.updateEmployee(editingId, formData);
      } else {
        await ApiService.createEmployee(formData);
      }
      fetchAllEmployes();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
    }
  };

  const handleEdit = (employe) => {
    setFormData({
      nom: employe.nom,
      prenom: employe.prenom,
      departement: employe.departement,
      salaire: employe.salaire.toString()
    });
    setEditingId(employe.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet employé ?")) {
      try {
        await ApiService.deleteEmployee(id);
        fetchAllEmployes();
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      departement: '',
      salaire: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestion des Employés</h1>
      </header>
      
      <div className="search-container">
        <h3>Rechercher des employés</h3>
        <form onSubmit={handleSearch}>
          <div className="form-group">
            <label>Critère de recherche:</label>
            <select 
              value={searchType} 
              onChange={(e) => setSearchType(e.target.value)}
            >
              <option value="nom">Nom</option>
              <option value="departement">Département</option>
              <option value="salaire">Salaire minimum</option>
            </select>
          </div>
          
          <div className="form-group">
            <label>Valeur:</label>
            <input 
              type={searchType === 'salaire' ? 'number' : 'text'}
              value={searchValue} 
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder={
                searchType === 'salaire' 
                  ? 'Entrez le salaire minimum' 
                  : `Entrez le ${searchType}`
              }
            />
          </div>
          
          <button type="submit">Rechercher</button>
          <button type="button" onClick={() => {
            setSearchValue('');
            fetchAllEmployes();
          }}>Réinitialiser</button>
        </form>
      </div>

      <div className="actions-container">
        <button 
          onClick={() => setShowForm(!showForm)}
          className="toggle-form-btn"
        >
          {showForm ? 'Masquer le formulaire' : 'Ajouter un employé'}
        </button>
      </div>

      {showForm && (
        <div className="form-container">
          <h3>{editingId ? 'Modifier' : 'Ajouter'} un employé</h3>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nom:</label>
              <input
                type="text"
                name="nom"
                value={formData.nom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Prénom:</label>
              <input
                type="text"
                name="prenom"
                value={formData.prenom}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Département:</label>
              <input
                type="text"
                name="departement"
                value={formData.departement}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Salaire:</label>
              <input
                type="number"
                name="salaire"
                value={formData.salaire}
                onChange={handleInputChange}
                step="0.01"
                required
              />
            </div>
            <div className="form-actions">
              <button type="submit">Enregistrer</button>
              <button type="button" onClick={resetForm}>Annuler</button>
            </div>
          </form>
        </div>
      )}
      
      {loading ? (
        <div className="loading">Chargement...</div>
      ) : employes.length === 0 ? (
        <div className="no-results">Aucun employé trouvé</div>
      ) : (
        <div className="employe-list">
          <h3>Liste des employés</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Prénom</th>
                <th>Département</th>
                <th>Salaire (€)</th>
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
                  <td>{employe.salaire.toLocaleString()}</td>
                  <td className="actions">
                    <button onClick={() => handleEdit(employe)}>Modifier</button>
                    <button onClick={() => handleDelete(employe.id)}>Supprimer</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <footer>
        <p>Système de gestion des employés - 2025</p>
      </footer>
    </div>
  );
}

export default App;
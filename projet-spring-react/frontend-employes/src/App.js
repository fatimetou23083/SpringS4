import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ApiService from './ApiService';
import LoginForm from './components/LoginForm';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AuthService from './AuthService';

// Configuration d'axios pour inclure le token
axios.interceptors.request.use(
  (config) => {
    const user = AuthService.getCurrentUser();
    if (user && user.accessToken) {
      config.headers.Authorization = `Bearer ${user.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function App() {
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchType, setSearchType] = useState('nom');
  const [searchValue, setSearchValue] = useState('');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    departement: '',
    salaire: '',
    password: ''
  });
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(!!AuthService.getCurrentUser());

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllEmployes();
    }
  }, [isAuthenticated]);

  const fetchAllEmployes = async () => {
    setLoading(true);
    try {
      const response = await ApiService.getAllEmployees();
      setEmployes(response.data);
    } catch (error) {
      console.error('Erreur lors du chargement des employés:', error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
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
          response = await ApiService.searchByName(searchValue);
          break;
        case 'departement':
          response = await ApiService.searchByDepartment(searchValue);
          break;
        case 'salaire':
          response = await ApiService.searchBySalaryMin(searchValue);
          break;
        default:
          response = await ApiService.getAllEmployees();
      }
      
      setEmployes(response.data);
    } catch (error) {
      console.error("Erreur lors de la recherche:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
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
        // Pour l'update, créer un objet sans le password si vide
        const updateData = { ...formData };
        if (!updateData.password) {
          delete updateData.password;
        }
        await ApiService.updateEmployee(editingId, updateData);
      } else {
        // Pour la création, le password est obligatoire
        await ApiService.createEmployee(formData);
      }
      fetchAllEmployes();
      resetForm();
    } catch (error) {
      console.error("Erreur lors de l'enregistrement:", error);
      if (error.response && error.response.status === 401) {
        handleLogout();
      }
    }
  };

  const handleEdit = (employe) => {
    setFormData({
      nom: employe.nom,
      prenom: employe.prenom,
      departement: employe.departement,
      salaire: employe.salaire.toString(),
      password: employe.password || ''
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
        if (error.response && error.response.status === 401) {
          handleLogout();
        }
      }
    }
  };

  const resetForm = () => {
    setFormData({
      nom: '',
      prenom: '',
      departement: '',
      salaire: '',
      password: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginForm onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <div className="App">
                <header className="App-header">
                  <h1>Gestion des Employés</h1>
                  <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
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
                        <label>Mot de passe:</label>
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
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
            ) : (
              <Navigate to="/login" replace />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
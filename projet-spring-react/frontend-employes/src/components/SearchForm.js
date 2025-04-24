import React, { useState, useEffect } from 'react';
import SearchForm from './components/SearchForm';
import ApiService from './ApiService';
import './App.css';

function App() {
  const [employes, setEmployes] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // Autres états...

  useEffect(() => {
    fetchAllEmployes();
  }, []);

  const fetchAllEmployes = async () => {
    // Votre code existant...
  };

  // Fonction de recherche à passer au composant SearchForm
  const handleSearch = async (searchType, searchValue) => {
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
    } finally {
      setLoading(false);
    }
  };

  // Reste de votre code...

  return (
    <div className="App">
      <header className="App-header">
        <h1>Gestion des Employés</h1>
      </header>
      
      {/* Utiliser le composant SearchForm */}
      <SearchForm onSearch={handleSearch} />

      {/* Reste de votre JSX... */}
    </div>
  );
}

export default App;
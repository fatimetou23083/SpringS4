import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import ApiService from './ApiService';
import LoginForm from './components/LoginForm';
import EmployeList from './components/EmployeList';
import EmployeDetail from './components/EmployeDetail';
import EmployeForm from './components/EmployeForm';
import DetailSalaire from './components/DetailSalaire';
import DashboardSalaires from './components/DashboardSalaires';
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
  const [isAuthenticated, setIsAuthenticated] = useState(!!AuthService.getCurrentUser());

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    AuthService.logout();
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
          <header className="App-header">
            <h1>Gestion des Employés</h1>
            <button onClick={handleLogout} className="logout-btn">Déconnexion</button>
          </header>
        )}
        
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
                <Navigate to="/employes" replace />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          {/* Routes pour la gestion des employés */}
          <Route 
            path="/employes" 
            element={
              isAuthenticated ? <EmployeList /> : <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/employes/:id" 
            element={
              isAuthenticated ? <EmployeDetail /> : <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/employes/add" 
            element={
              isAuthenticated ? <EmployeForm /> : <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/employes/edit/:id" 
            element={
              isAuthenticated ? <EmployeForm /> : <Navigate to="/login" replace />
            } 
          />
          
          {/* Nouvelles routes pour les salaires */}
          <Route 
            path="/salaires/employe/:id" 
            element={
              isAuthenticated ? <DetailSalaire /> : <Navigate to="/login" replace />
            } 
          />
          
          <Route 
            path="/dashboard-salaires" 
            element={
              isAuthenticated ? <DashboardSalaires /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
        
        {isAuthenticated && (
          <footer>
            <p>Système de gestion des employés - 2025</p>
          </footer>
        )}
      </div>
    </Router>
  );
}

export default App;
// src/AuthService.js
import axios from 'axios';

const API_URL = 'http://localhost:8081/api/auth/';

class AuthService {
  login(username, password) {
    return axios
      .post(API_URL + 'login', {
        username: username,
        password: password
      })
      .then(response => {
        if (response.data.accessToken) {
          localStorage.setItem('user', JSON.stringify(response.data));
          // Configurer l'interception d'axios pour ajouter le token
          this.setupAxiosInterceptors(response.data.accessToken);
        }
        return response.data;
      });
  }

  logout() {
    localStorage.removeItem('user');
    // Supprimer l'intercepteur
    axios.interceptors.request.eject(this._interceptor);
    delete this._interceptor;
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }

  // Configurer axios pour ajouter automatiquement le token aux requêtes
  setupAxiosInterceptors(token) {
    // Supprime l'intercepteur existant s'il y en a un
    if (this._interceptor) {
      axios.interceptors.request.eject(this._interceptor);
    }

    // Ajoute un nouvel intercepteur
    this._interceptor = axios.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
  }

  // Vérifier si l'utilisateur est connecté au démarrage de l'application
  initializeAuth() {
    const user = this.getCurrentUser();
    if (user && user.accessToken) {
      this.setupAxiosInterceptors(user.accessToken);
    }
  }
}

const authService = new AuthService();
export default authService;
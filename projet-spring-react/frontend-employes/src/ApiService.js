import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

class ApiService {
  // Endpoints pour les recherches
  searchByName(nom) {
    return axios.get(`${API_BASE_URL}/recherche/nom/${nom}`);
  }

  searchByDepartment(departement) {
    return axios.get(`${API_BASE_URL}/recherche/departement/${departement}`);
  }

  searchBySalaryMin(salaire) {
    return axios.get(`${API_BASE_URL}/recherche/salaire?min=${salaire}`);
  }

  // Endpoints CRUD pour les employés
  getAllEmployees() {
    return axios.get(`${API_BASE_URL}/employes`);
  }

  getEmployeeById(id) {
    return axios.get(`${API_BASE_URL}/employes/${id}`);
  }

  createEmployee(employee) {
    return axios.post(`${API_BASE_URL}/employes`, employee);
  }

  updateEmployee(id, employee) {
    return axios.put(`${API_BASE_URL}/employes/${id}`, employee);
  }

  deleteEmployee(id) {
    return axios.delete(`${API_BASE_URL}/employes/${id}`);
  }
}

export default new ApiService();
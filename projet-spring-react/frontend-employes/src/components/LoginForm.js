import React, { useState } from 'react';
import AuthService from '../AuthService';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css';

function LoginForm({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Login attempt with:', username, password);
    
    try {
      await AuthService.login(username, password);
      if (onLoginSuccess) {
        onLoginSuccess();
      }
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError('Username or password incorrect');
    }
  };

  return (
    <div className="login-form">
      <h2>Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Username:</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Password:</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
    </div>
  );
}

export default LoginForm;
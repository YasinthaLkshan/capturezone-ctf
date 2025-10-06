import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(username, password);
      navigate('/dashboard');
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    console.log('Testing direct API connection...');
    try {
      // Test both the working endpoint and the login endpoint
      console.log('Testing /api/auth/test...');
      const testResponse = await fetch('https://capturezone-ctf-production.up.railway.app/api/auth/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      console.log('Test endpoint - Status:', testResponse.status, 'Data:', await testResponse.text());
      
      console.log('Testing /api/auth/login...');
      const loginResponse = await fetch('https://capturezone-ctf-production.up.railway.app/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: 'test', password: 'test' })
      });
      
      console.log('Login endpoint - Status:', loginResponse.status);
      const loginData = await loginResponse.text();
      console.log('Login endpoint - Data:', loginData);
      
      alert(`Login Test: Status ${loginResponse.status}, Data: ${loginData.substring(0, 100)}...`);
    } catch (error) {
      console.error('Test connection error:', error);
      alert(`Test Error: ${error}`);
    }
  };

  return (
    <div className="card" style={{ maxWidth: '500px', margin: '2rem auto' }}>
      <div className="card-header">
        <h2 className="card-title">🔐 Access Terminal</h2>
        <p style={{ color: '#ffaa00' }}>Enter your credentials to access CaptureZone</p>
      </div>

      {error && (
        <div className="alert alert-error">
          ❌ {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username / Email
          </label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username or email"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
          />
        </div>

        <button 
          type="submit" 
          className="btn" 
          disabled={loading}
          style={{ width: '100%', marginBottom: '1rem' }}
        >
          {loading ? <span className="loading"></span> : '⚡ Initialize Session'}
        </button>

        <button 
          type="button" 
          onClick={testConnection}
          className="btn" 
          style={{ width: '100%', marginBottom: '1rem', backgroundColor: '#ffaa00', color: '#000' }}
        >
          🔧 Test API Connection
        </button>
      </form>

      <div style={{ textAlign: 'center', paddingTop: '1rem', borderTop: '1px solid #00ff00' }}>
        <p>
          New to CaptureZone?{' '}
          <Link to="/register" style={{ color: '#00ff00' }}>
            Create Account
          </Link>
        </p>
      </div>

      <div className="terminal" style={{ marginTop: '1rem' }}>
        <div style={{ color: '#ffaa00' }}>💡 Demo Credentials:</div>
        <div className="terminal-prompt">Username: demo</div>
        <div className="terminal-prompt">Password: demo123</div>
      </div>
    </div>
  );
};

export default Login;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { apiService, Module } from '../services/apiService';

const ModuleList: React.FC = () => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchModules = async () => {
      try {
        // Initialize modules first
        await apiService.initializeModules();
        // Then fetch them
        const moduleData = await apiService.getModules();
        setModules(moduleData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModules();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="loading"></div>
        <p style={{ marginTop: '1rem' }}>Loading modules...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-error">
        ❌ {error}
      </div>
    );
  }

  const getVulnerabilityTag = (vulnerability: string) => {
    const tagClasses = {
      'DOM-Based XSS': 'vuln-xss',
      'SSRF': 'vuln-ssrf',
      'Broken Authentication': 'vuln-auth',
      'NoSQL Injection': 'vuln-nosql'
    };
    
    return tagClasses[vulnerability as keyof typeof tagClasses] || 'vuln-xss';
  };

  const getDifficultyClass = (difficulty: string) => {
    return `difficulty-${difficulty.toLowerCase()}`;
  };

  return (
    <div>
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">🎯 Security Training Modules</h1>
          <p style={{ color: '#ffaa00' }}>
            Choose your cybersecurity challenge. Each module contains a unique vulnerability to exploit.
          </p>
        </div>

        <div className="alert alert-warning">
          <strong>📚 Learning Objectives:</strong> Each module is designed to teach you about a specific 
          cybersecurity vulnerability. Study the documentation, understand the vulnerability, and then 
          exploit it to capture the flag.
        </div>
      </div>

      <div className="module-grid">
        {modules.map((module) => (
          <div key={module.id} className="module-card">
            <div className={`module-difficulty ${getDifficultyClass(module.difficulty)}`}>
              {module.difficulty}
            </div>

            <h3>{module.title}</h3>
            <p style={{ marginBottom: '1rem' }}>{module.description}</p>

            <div style={{ marginBottom: '1rem' }}>
              <span className={`vulnerability-tag ${getVulnerabilityTag(module.vulnerability)}`}>
                {module.vulnerability}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              <Link 
                to={`/modules/${module.id}`} 
                className="btn"
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                📖 Learn & Exploit
              </Link>
              
              <Link 
                to={`/lab/${module.name}`} 
                className="btn btn-warning"
                style={{ fontSize: '0.9rem', padding: '0.5rem 1rem' }}
              >
                🔬 Direct Lab Access
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Module Overview */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <div className="card-header">
          <h2 className="card-title">🎓 Training Path Overview</h2>
        </div>

        <div className="terminal">
          <div style={{ color: '#00ff00' }}>CaptureZone Training Sequence:</div>
          <div className="terminal-prompt">1. Read module documentation and understand the vulnerability</div>
          <div className="terminal-prompt">2. Access the vulnerable application through lab links</div>
          <div className="terminal-prompt">3. Exploit the vulnerability using various techniques</div>
          <div className="terminal-prompt">4. Capture the flag revealed during successful exploitation</div>
          <div className="terminal-prompt">5. Submit the flag to earn points and track progress</div>
        </div>

        <div className="alert alert-success" style={{ marginTop: '1rem' }}>
          <strong>🎯 Pro Tip:</strong> Start with the easier modules (XSS) and work your way up to more 
          complex vulnerabilities (SSTI). Each module builds upon cybersecurity concepts and techniques.
        </div>
      </div>
    </div>
  );
};

export default ModuleList;
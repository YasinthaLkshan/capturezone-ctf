import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { apiService, Module } from '../services/apiService';

const ModuleDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [module, setModule] = useState<Module | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [flag, setFlag] = useState('');
  const [flagResult, setFlagResult] = useState<any>(null);
  const [submittingFlag, setSubmittingFlag] = useState(false);

  useEffect(() => {
    const fetchModule = async () => {
      if (!id) return;
      
      try {
        const moduleData = await apiService.getModule(parseInt(id));
        setModule(moduleData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchModule();
  }, [id]);

  const handleFlagSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!flag.trim() || !module) return;

    setSubmittingFlag(true);
    setFlagResult(null);

    try {
      const result = await apiService.validateFlag(flag.trim(), module.id);
      setFlagResult(result);
      if (result.success) {
        setFlag(''); // Clear flag input on success
      }
    } catch (error: any) {
      setFlagResult({ success: false, message: error.message });
    } finally {
      setSubmittingFlag(false);
    }
  };

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="loading"></div>
        <p style={{ marginTop: '1rem' }}>Loading module...</p>
      </div>
    );
  }

  if (error || !module) {
    return (
      <div className="alert alert-error">
        ❌ {error || 'Module not found'}
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
      {/* Module Header */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">{module.title}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1rem' }}>
            <span className={`module-difficulty ${getDifficultyClass(module.difficulty)}`}>
              {module.difficulty}
            </span>
            <span className={`vulnerability-tag ${getVulnerabilityTag(module.vulnerability)}`}>
              {module.vulnerability}
            </span>
          </div>
        </div>

        <p style={{ fontSize: '1.1rem', marginBottom: '1rem' }}>{module.description}</p>

        <div style={{ marginTop: '1.5rem' }}>
          <Link 
            to={`/lab/${module.name}`} 
            className="btn"
            style={{ marginRight: '1rem' }}
          >
            🔬 Access Lab Environment
          </Link>
          <Link to="/modules" className="btn btn-warning">
            ← Back to Modules
          </Link>
        </div>
      </div>

      {/* Flag Submission */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🚩 Flag Submission</h2>
        </div>

        <form onSubmit={handleFlagSubmission}>
          <div className="form-group">
            <label htmlFor="flag" className="form-label">
              Enter the flag you discovered:
            </label>
            <input
              type="text"
              id="flag"
              className="form-control"
              value={flag}
              onChange={(e) => setFlag(e.target.value)}
              placeholder="CYBER{...}"
              style={{ fontFamily: 'monospace' }}
            />
          </div>

          <button 
            type="submit" 
            className="btn"
            disabled={submittingFlag || !flag.trim()}
          >
            {submittingFlag ? <span className="loading"></span> : '🎯 Submit Flag'}
          </button>
        </form>

        {flagResult && (
          <div className={`alert ${flagResult.success ? 'alert-success' : 'alert-error'}`} style={{ marginTop: '1rem' }}>
            {flagResult.success ? '✅' : '❌'} {flagResult.message}
          </div>
        )}
      </div>

      {/* Vulnerability Overview */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📚 Vulnerability Overview</h2>
        </div>

        <div>
          <h3 style={{ color: '#00ff00', marginBottom: '1rem' }}>What is {module.vulnerability}?</h3>
          <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {module.documentation.overview}
          </p>

          <h3 style={{ color: '#00ff00', marginBottom: '1rem' }}>Technical Details</h3>
          <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
            {module.documentation.vulnerability_details}
          </p>
        </div>
      </div>

      {/* Exploitation Steps */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🎯 Exploitation Guide</h2>
        </div>

        <div className="terminal">
          <div style={{ color: '#00ff00' }}>Exploitation Steps:</div>
          {module.documentation.exploitation_steps.map((step, index) => (
            <div key={index} className="terminal-prompt">
              {index + 1}. {step}
            </div>
          ))}
        </div>
      </div>

      {/* Hints */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">💡 Hints</h2>
        </div>

        {module.hints.map((hint, index) => (
          <div key={index} className="alert alert-warning" style={{ marginBottom: '0.5rem' }}>
            <strong>Hint {index + 1}:</strong> {hint}
          </div>
        ))}
      </div>

      {/* Prevention */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🛡️ Prevention & Mitigation</h2>
        </div>

        <p style={{ lineHeight: '1.6', marginBottom: '1.5rem' }}>
          {module.documentation.prevention}
        </p>

        <h3 style={{ color: '#00ff00', marginBottom: '1rem' }}>Additional Resources</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {module.documentation.references.map((ref, index) => (
            <li key={index} style={{ marginBottom: '0.5rem' }}>
              <a 
                href={ref} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#00ff00', textDecoration: 'underline' }}
              >
                🔗 {ref}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ModuleDetail;
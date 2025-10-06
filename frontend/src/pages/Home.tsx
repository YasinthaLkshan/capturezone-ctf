import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="hero-container">
      <div className="hero-background">
        <div className="cyber-grid"></div>
        <div className="floating-particles"></div>
      </div>
      
      <div className="hero-content">
        <div className="hero-header">
          <h1 className="hero-title glitch" data-text="CAPTUREZONE">
            CAPTUREZONE
          </h1>
          <div className="hero-subtitle">
            <span className="gradient-text">CYBER APOCALYPSE</span>
            <div className="subtitle-line">Ready to save the world?</div>
          </div>
          <div className="hero-description">
            Interactive Cybersecurity Training Platform - Unlock the secrets of digital warfare
          </div>
        </div>

        <div className="hero-actions">
          {isAuthenticated ? (
            <Link to="/dashboard" className="btn btn-primary hero-btn">
              <span className="btn-icon">🎯</span>
              ENTER DASHBOARD
            </Link>
          ) : (
            <div className="hero-buttons">
              <Link to="/register" className="btn btn-primary hero-btn">
                <span className="btn-icon">🔐</span>
                START TRAINING
              </Link>
              <Link to="/login" className="btn btn-secondary hero-btn">
                <span className="btn-icon">⚡</span>
                LOGIN
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="modules-section">
        <h2 className="section-title">
          <span className="gradient-text">SECURITY MODULES</span>
        </h2>
        
        <div className="module-grid">
          <div className="module-card cyber-card">
            <div className="module-header">
              <div className="module-difficulty difficulty-easy">EASY</div>
              <div className="module-icon">🛡️</div>
            </div>
            <h3 className="module-title">Feedback Portal</h3>
            <p className="module-description">Explore DOM-based Cross-Site Scripting (XSS) vulnerabilities</p>
            <div className="module-tags">
              <span className="vulnerability-tag vuln-xss">XSS</span>
            </div>
          </div>

          <div className="module-card cyber-card">
            <div className="module-header">
              <div className="module-difficulty difficulty-medium">MEDIUM</div>
              <div className="module-icon">🌐</div>
            </div>
            <h3 className="module-title">Digital Archive</h3>
            <p className="module-description">Investigate Server-Side Request Forgery (SSRF) attacks</p>
            <div className="module-tags">
              <span className="vulnerability-tag vuln-ssrf">SSRF</span>
            </div>
          </div>

          <div className="module-card cyber-card">
            <div className="module-header">
              <div className="module-difficulty difficulty-hard">HARD</div>
              <div className="module-icon">⚡</div>
            </div>
            <h3 className="module-title">System Diagnostics</h3>
            <p className="module-description">Master Broken Authentication bypass techniques</p>
            <div className="module-tags">
              <span className="vulnerability-tag vuln-auth">AUTH</span>
            </div>
          </div>

          <div className="module-card cyber-card">
            <div className="module-header">
              <div className="module-difficulty difficulty-medium">MEDIUM</div>
              <div className="module-icon">🔒</div>
            </div>
            <h3 className="module-title">Admin Portal</h3>
            <p className="module-description">Break authentication using NoSQL Injection</p>
            <div className="module-tags">
              <span className="vulnerability-tag vuln-nosql">NoSQL</span>
            </div>
          </div>
        </div>
      </div>

      <div className="info-section">
        <div className="cyber-terminal">
          <div className="terminal-header">
            <span className="terminal-title">MISSION BRIEFING</span>
            <div className="terminal-controls">
              <span className="control-dot red"></span>
              <span className="control-dot yellow"></span>
              <span className="control-dot green"></span>
            </div>
          </div>
          <div className="terminal-content">
            <div className="terminal-line">→ Initialize your cybersecurity journey</div>
            <div className="terminal-line">→ Exploit vulnerabilities to capture flags</div>
            <div className="terminal-line">→ Learn real-world security concepts</div>
            <div className="terminal-line">→ Track your progress and compete</div>
          </div>
        </div>

        <div className="warning-panel">
          <div className="warning-header">
            <span className="warning-icon">⚠️</span>
            <span className="warning-title">EDUCATIONAL PURPOSE ONLY</span>
          </div>
          <div className="warning-content">
            This platform contains intentionally vulnerable code for educational purposes. 
            Do not use these patterns in production applications. Always follow secure 
            coding practices in real-world scenarios.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
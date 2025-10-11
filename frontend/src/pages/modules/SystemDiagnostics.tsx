import React, { useState } from 'react';
import { apiService } from '../../services/apiService';

const SystemDiagnostics: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [sessionToken, setSessionToken] = useState('');
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setRunning(true);
    setResult(null);

    try {
      const response = await apiService.authenticateSystem(username.trim(), password.trim(), sessionToken.trim());
      setResult(response);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setRunning(false);
    }
  };

  const clearResults = () => {
    setResult(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">� Broken Authentication Challenge</h1>
          <p style={{ color: '#ffaa00' }}>
            Exploit authentication vulnerabilities to bypass security controls and gain unauthorized access
          </p>
        </div>

        <div className="alert alert-warning">
          <strong>🎯 Challenge:</strong> This authentication system demonstrates common Broken Authentication vulnerabilities. 
          Try bypassing authentication using weak credentials, SQL injection, session manipulation, or other authentication bypass techniques.
        </div>
      </div>

      {/* Authentication Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">� System Authentication</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter admin username"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">
              Password (Vulnerable Field!)
            </label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password or try injection..."
              required
            />
            <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
              Try weak passwords, SQL injection, or leave empty with a session token
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="sessionToken" className="form-label">
              Session Token (Optional)
            </label>
            <input
              type="text"
              id="sessionToken"
              className="form-control"
              value={sessionToken}
              onChange={(e) => setSessionToken(e.target.value)}
              placeholder="Enter session token to bypass password"
            />
            <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
              Session tokens can bypass password authentication if valid
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button 
              type="submit" 
              className="btn"
              disabled={running || !username.trim() || !password.trim()}
            >
              {running ? <span className="loading"></span> : '� Authenticate'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-warning"
              onClick={clearResults}
            >
              🗑️ Clear Results
            </button>
          </div>
        </form>
      </div>

      {/* Results Display */}
      {result && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">� Authentication Result</h2>
          </div>

          {result.success ? (
            <div>
              <div 
                style={{
                  padding: '1rem',
                  border: '1px solid #00ff00',
                  borderRadius: '5px',
                  backgroundColor: 'rgba(0, 255, 0, 0.05)',
                  marginBottom: '1rem'
                }}
              >
                <h3 style={{ color: '#00ff00' }}>✅ Authentication Successful!</h3>
                <p><strong>Welcome:</strong> {result.user?.username || 'Unknown User'}</p>
                <p><strong>Role:</strong> {result.user?.role || 'Standard User'}</p>
                <p><strong>Permissions:</strong> {result.user?.permissions?.join(', ') || 'None'}</p>
                <p><strong>Session ID:</strong> {result.sessionId || 'N/A'}</p>
                {result.adminAccess && (
                  <p style={{ color: '#ff6600' }}><strong>⚠️ Admin Access Granted!</strong></p>
                )}
              </div>

              {/* Flag Display */}
              {result.flag && (
                <div className="alert alert-success">
                  <strong>🎉 FLAG CAPTURED!</strong><br />
                  <code style={{ fontSize: '1.2rem', color: '#00ff00' }}>{result.flag}</code><br />
                  <em>You successfully exploited the broken authentication vulnerability! Copy this flag and submit it in the module page.</em>
                </div>
              )}
            </div>
          ) : (
            <div>
              <div className="alert alert-error">
                <strong>❌ Authentication Failed:</strong> {result.error}
              </div>
              
              {/* Flag might be in error response for some attacks */}
              {result.flag && (
                <div className="alert alert-success">
                  <strong>🎉 FLAG CAPTURED!</strong><br />
                  <code style={{ fontSize: '1.2rem', color: '#00ff00' }}>{result.flag}</code><br />
                  <em>You successfully exploited authentication through error injection!</em>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Broken Authentication Exploitation Guide */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">💡 Broken Authentication Exploitation Guide</h2>
        </div>

        <div className="terminal">
          <div style={{ color: '#00ff00' }}>Authentication Bypass Techniques:</div>
          <div className="terminal-prompt">1. Weak passwords: admin:123, admin:password</div>
          <div className="terminal-prompt">2. SQL injection: username: admin' OR '1'='1 --</div>
          <div className="terminal-prompt">3. Session token bypass: Use valid token without password</div>
          <div className="terminal-prompt">4. Credential stuffing: Try common admin credentials</div>
          <div className="terminal-prompt">5. Empty password bypass: Leave password empty with session token</div>
        </div>

        <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
          <strong>🎯 Goal:</strong> Bypass authentication to gain unauthorized access to the system. 
          The flag will be revealed when successful authentication bypass is detected.
        </div>
      </div>

      {/* Authentication Syntax Reference */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📖 Authentication Attack Reference</h2>
        </div>

        <div className="module-grid">
          <div className="module-card">
            <h4>� Weak Credentials</h4>
            <div className="terminal" style={{ fontSize: '0.9rem' }}>
              <div>admin:123</div>
              <div>admin:password</div>
              <div>admin:admin</div>
              <div>root:toor</div>
            </div>
          </div>

          <div className="module-card">
            <h4>� SQL Injection</h4>
            <div className="terminal" style={{ fontSize: '0.9rem' }}>
              <div>admin' OR '1'='1</div>
              <div>admin' OR 1=1 --</div>
              <div>' OR 'a'='a</div>
              <div>admin'; DROP TABLE--</div>
            </div>
          </div>

          <div className="module-card">
            <h4>🎫 Session Manipulation</h4>
            <div className="terminal" style={{ fontSize: '0.9rem' }}>
              <div>admin_session_token</div>
              <div>expired_admin_token_abc123</div>
              <div>guest_token_promoted</div>
              <div>debug_admin_access</div>
            </div>
          </div>

          <div className="module-card">
            <h4>💥 Logic Bypass</h4>
            <div className="terminal" style={{ fontSize: '0.9rem' }}>
              <div>Empty password + token</div>
              <div>Case sensitivity bypass</div>
              <div>Unicode normalization</div>
              <div>Parameter pollution</div>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Analysis */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🔬 Technical Analysis</h2>
        </div>

        <h3 style={{ color: '#00ff00', marginBottom: '1rem' }}>Vulnerability Details</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
          This authentication system demonstrates a Broken Authentication vulnerability from OWASP A02:2021. 
          The system has multiple weaknesses including weak password policies, improper session management, 
          and insufficient input validation that allow attackers to bypass authentication controls.
        </p>

        <h3 style={{ color: '#00ff00', marginBottom: '1rem' }}>Attack Progression</h3>
        <ol style={{ lineHeight: '1.6', paddingLeft: '2rem' }}>
          <li><strong>Credential Discovery:</strong> Test for common weak passwords and default credentials</li>
          <li><strong>SQL Injection:</strong> Bypass authentication using malicious SQL payloads</li>
          <li><strong>Session Token Abuse:</strong> Reuse or manipulate session tokens to bypass passwords</li>
          <li><strong>Logic Flaws:</strong> Exploit authentication bypass conditions and edge cases</li>
          <li><strong>Privilege Escalation:</strong> Gain unauthorized administrative access</li>
        </ol>

        <div className="alert alert-error" style={{ marginTop: '1rem' }}>
          <strong>⚠️ Prevention:</strong> Implement strong password policies, multi-factor authentication, 
          proper session management, input validation, and account lockout mechanisms. Use secure authentication 
          frameworks and conduct regular security assessments.
        </div>
      </div>
    </div>
  );
};

export default SystemDiagnostics;
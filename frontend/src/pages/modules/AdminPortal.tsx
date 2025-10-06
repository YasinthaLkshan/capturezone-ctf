import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/apiService';

const AdminPortal: React.FC = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [loginMode, setLoginMode] = useState<'form' | 'json'>('form');
  const [jsonPayload, setJsonPayload] = useState('{\n  "username": "",\n  "password": ""\n}');
  const [authenticating, setAuthenticating] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [adminSetup, setAdminSetup] = useState(false);

  useEffect(() => {
    // Setup admin user on component mount
    const setupAdmin = async () => {
      try {
        await apiService.setupAdmin();
        setAdminSetup(true);
      } catch (error) {
        console.error('Admin setup failed:', error);
      }
    };
    setupAdmin();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await attemptLogin(credentials.username, credentials.password);
  };

  const handleJsonSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = JSON.parse(jsonPayload);
      await attemptLogin(payload.username, payload.password);
    } catch (error) {
      setResult({ success: false, error: 'Invalid JSON payload' });
    }
  };

  const attemptLogin = async (username: any, password: any) => {
    setAuthenticating(true);
    setResult(null);

    try {
      const response = await apiService.adminLogin(username, password);
      setResult(response);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setAuthenticating(false);
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
          <h1 className="card-title">🔐 CaptureZone Admin Portal</h1>
          <p style={{ color: '#ffaa00' }}>
            Administrative access to CaptureZone management system
          </p>
        </div>

        <div className="alert alert-warning">
          <strong>🎯 Challenge:</strong> This admin portal contains a NoSQL Injection vulnerability. 
          Try bypassing authentication using MongoDB operators to gain unauthorized access.
        </div>

        {adminSetup && (
          <div className="alert alert-success">
            ✅ Admin users initialized. Default credentials: admin:secret123
          </div>
        )}
      </div>

      {/* Login Mode Selector */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🚪 Authentication Method</h2>
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            className={`btn ${loginMode === 'form' ? '' : 'btn-warning'}`}
            onClick={() => setLoginMode('form')}
          >
            📝 Form Login
          </button>
          <button 
            className={`btn ${loginMode === 'json' ? '' : 'btn-warning'}`}
            onClick={() => setLoginMode('json')}
          >
            🔧 JSON API Login (Vulnerable!)
          </button>
        </div>

        {/* Form-based Login */}
        {loginMode === 'form' && (
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="form-control"
                value={credentials.username}
                onChange={handleInputChange}
                placeholder="Enter admin username"
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
                name="password"
                className="form-control"
                value={credentials.password}
                onChange={handleInputChange}
                placeholder="Enter admin password"
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn"
              disabled={authenticating}
            >
              {authenticating ? <span className="loading"></span> : '🔓 Login'}
            </button>
          </form>
        )}

        {/* JSON-based Login */}
        {loginMode === 'json' && (
          <form onSubmit={handleJsonSubmit}>
            <div className="form-group">
              <label htmlFor="jsonPayload" className="form-label">
                JSON Authentication Payload (Vulnerable to NoSQL Injection!)
              </label>
              <textarea
                id="jsonPayload"
                className="form-control"
                value={jsonPayload}
                onChange={(e) => setJsonPayload(e.target.value)}
                placeholder="Enter JSON payload..."
                rows={8}
                required
                style={{ fontFamily: 'monospace', fontSize: '0.9rem' }}
              />
              <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
                Content-Type: application/json - Direct object injection into MongoDB query
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <button 
                type="submit" 
                className="btn"
                disabled={authenticating}
              >
                {authenticating ? <span className="loading"></span> : '🚀 Send JSON Request'}
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
        )}
      </div>

      {/* Results Display */}
      {result && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">🔍 Authentication Result</h2>
          </div>

          {result.success ? (
            <div>
              <div className="alert alert-success">
                <strong>✅ Authentication Successful!</strong><br />
                Welcome to the admin panel, {result.admin.username}!
              </div>

              <div 
                style={{
                  padding: '1rem',
                  border: '1px solid #00ff00',
                  borderRadius: '5px',
                  backgroundColor: 'rgba(0, 255, 0, 0.05)',
                  marginBottom: '1rem'
                }}
              >
                <h4>🎛️ Admin Dashboard</h4>
                <p><strong>User ID:</strong> {result.admin.id}</p>
                <p><strong>Username:</strong> {result.admin.username}</p>
                <p><strong>Role:</strong> {result.admin.role}</p>
                <p><strong>Permissions:</strong> {result.admin.permissions.join(', ')}</p>
                <p><strong>Last Login:</strong> {result.admin.lastLogin || 'First time'}</p>
              </div>

              {/* Flag Display */}
              {result.flag && (
                <div className="alert alert-success">
                  <strong>🎉 FLAG CAPTURED!</strong><br />
                  <code style={{ fontSize: '1.2rem', color: '#00ff00' }}>{result.flag}</code><br />
                  <em>You successfully bypassed authentication with NoSQL injection! Copy this flag and submit it in the module page.</em>
                </div>
              )}
            </div>
          ) : (
            <div className="alert alert-error">
              <strong>❌ Authentication Failed:</strong> {result.error}
              {result.hint && (
                <><br /><strong>💡 Hint:</strong> {result.hint}</>
              )}
            </div>
          )}
        </div>
      )}

      {/* NoSQL Injection Guide */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">💡 NoSQL Injection Guide</h2>
        </div>

        <div className="terminal">
          <div style={{ color: '#00ff00' }}>MongoDB Operators for Injection:</div>
          <div className="terminal-prompt">1. $ne (not equal): {"{"}"username": {"{"}"$ne": null{"}"}, "password": {"{"}"$ne": null{"}"}{"}"}</div>
          <div className="terminal-prompt">2. $gt (greater than): {"{"}"username": {"{"}"$gt": ""{"}"}{"}"}</div>
          <div className="terminal-prompt">3. $regex (regex match): {"{"}"username": {"{"}"$regex": "admin"{"}"}{"}"}</div>
          <div className="terminal-prompt">4. $where (JavaScript): {"{"}"username": {"{"}"$where": "return true"{"}"}{"}"}</div>
          <div className="terminal-prompt">5. $exists (field exists): {"{"}"username": {"{"}"$exists": true{"}"}{"}"}</div>
        </div>

        <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
          <strong>🎯 Goal:</strong> Use MongoDB operators to bypass the authentication check. The application 
          directly embeds user input into the database query, allowing query manipulation.
        </div>
      </div>

      {/* MongoDB Operators Reference */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📚 MongoDB Operators Reference</h2>
        </div>

        <div className="module-grid">
          <div className="module-card">
            <h4>🔍 Comparison Operators</h4>
            <div className="terminal" style={{ fontSize: '0.9rem' }}>
              <div>$eq - Equal</div>
              <div>$ne - Not equal</div>
              <div>$gt - Greater than</div>
              <div>$gte - Greater than or equal</div>
              <div>$lt - Less than</div>
              <div>$lte - Less than or equal</div>
            </div>
          </div>

          <div className="module-card">
            <h4>🔧 Logical Operators</h4>
            <div className="terminal" style={{ fontSize: '0.9rem' }}>
              <div>$and - Logical AND</div>
              <div>$or - Logical OR</div>
              <div>$not - Logical NOT</div>
              <div>$nor - Logical NOR</div>
            </div>
          </div>

          <div className="module-card">
            <h4>🎯 Element Operators</h4>
            <div className="terminal" style={{ fontSize: '0.9rem' }}>
              <div>$exists - Field exists</div>
              <div>$type - Field type</div>
            </div>
          </div>

          <div className="module-card">
            <h4>💥 Evaluation Operators</h4>
            <div className="terminal" style={{ fontSize: '0.9rem' }}>
              <div>$regex - Regular expression</div>
              <div>$where - JavaScript expression</div>
              <div>$expr - Aggregation expression</div>
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
          This admin portal demonstrates a NoSQL Injection vulnerability where user input is directly embedded 
          into MongoDB queries without proper sanitization. When using JSON authentication, the application 
          constructs queries like: <code>db.admins.findOne({'{username: userInput, password: userInput}'})</code>
        </p>

        <h3 style={{ color: '#00ff00', marginBottom: '1rem' }}>Attack Scenarios</h3>
        <ul style={{ lineHeight: '1.6', paddingLeft: '2rem' }}>
          <li><strong>Authentication Bypass:</strong> Use $ne operator to match any non-null value</li>
          <li><strong>User Enumeration:</strong> Use $regex to check if usernames exist</li>
          <li><strong>Data Extraction:</strong> Use comparison operators to extract information</li>
          <li><strong>Code Execution:</strong> Use $where operator for JavaScript execution (dangerous)</li>
        </ul>

        <div className="alert alert-error" style={{ marginTop: '1rem' }}>
          <strong>⚠️ Prevention:</strong> Always validate and sanitize input, use parameterized queries, 
          implement proper data typing, and avoid using $where operator. Consider using ODM libraries 
          that provide built-in protection against injection attacks.
        </div>
      </div>
    </div>
  );
};

export default AdminPortal;
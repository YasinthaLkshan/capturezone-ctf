import React, { useState } from 'react';
import { apiService } from '../../services/apiService';

const DigitalArchive: React.FC = () => {
  const [url, setUrl] = useState('');
  const [fetching, setFetching] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setFetching(true);
    setResult(null);

    try {
      const response = await apiService.fetchArchiveResource(url.trim());
      setResult(response);
    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setFetching(false);
    }
  };

  const clearResults = () => {
    setResult(null);
    setUrl('');
  };

  const tryExampleUrl = (exampleUrl: string) => {
    setUrl(exampleUrl);
  };

  return (
    <div>
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">📚 CaptureZone Digital Archive</h1>
          <p style={{ color: '#ffaa00' }}>
            Access and retrieve documents from our digital archive system
          </p>
        </div>

        <div className="alert alert-warning">
          <strong>🎯 Challenge:</strong> This archive system contains a Server-Side Request Forgery (SSRF) vulnerability. 
          Try accessing internal network resources that shouldn't be publicly accessible.
        </div>
      </div>

      {/* URL Fetch Interface */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🌐 Resource Fetcher</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="url" className="form-label">
              Document URL
            </label>
            <input
              type="url"
              id="url"
              className="form-control"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/document.pdf"
              required
            />
            <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>
              Enter a URL to fetch and display the resource content
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <button 
              type="submit" 
              className="btn"
              disabled={fetching || !url.trim()}
            >
              {fetching ? <span className="loading"></span> : '📥 Fetch Resource'}
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
            <h2 className="card-title">📄 Fetched Content</h2>
          </div>

          {result.success ? (
            <div>
              <div style={{ marginBottom: '1rem' }}>
                <strong>URL:</strong> <code>{result.url}</code>
              </div>
              
              <div 
                className="terminal"
                style={{ 
                  maxHeight: '400px', 
                  overflow: 'auto',
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-all'
                }}
              >
                {result.data}
              </div>

              {/* Flag Display */}
              {result.flag && (
                <div className="alert alert-success" style={{ marginTop: '1rem' }}>
                  <strong>🎉 FLAG CAPTURED!</strong><br />
                  <code style={{ fontSize: '1.2rem', color: '#00ff00' }}>{result.flag}</code><br />
                  <em>You successfully accessed internal resources! Copy this flag and submit it in the module page.</em>
                </div>
              )}
            </div>
          ) : (
            <div className="alert alert-error">
              <strong>❌ Fetch Failed:</strong> {result.error}
            </div>
          )}
        </div>
      )}

      {/* SSRF Exploitation Guide */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">💡 SSRF Exploitation Guide</h2>
        </div>

        <div className="terminal">
          <div style={{ color: '#00ff00' }}>SSRF Attack Vectors:</div>
          <div className="terminal-prompt">1. Internal network: http://localhost:PORT/path</div>
          <div className="terminal-prompt">2. Loopback address: http://127.0.0.1:PORT/admin</div>
          <div className="terminal-prompt">3. Private IP ranges: http://192.168.1.1/config</div>
          <div className="terminal-prompt">4. File system access: file:///etc/passwd</div>
          <div className="terminal-prompt">5. Cloud metadata: http://169.254.169.254/metadata</div>
        </div>

        <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
          <strong>🎯 Goal:</strong> Use the resource fetcher to access internal services or resources that shouldn't 
          be publicly accessible. Try the internal URLs in the examples above to discover hidden services.
        </div>
      </div>

      {/* Common SSRF Targets */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🎯 Common SSRF Targets</h2>
        </div>

        <div className="module-grid">
          <div className="module-card">
            <h4>🏠 Localhost Services</h4>
            <p>Internal services running on localhost</p>
            <div className="terminal" style={{ fontSize: '0.8rem' }}>
              <div>http://localhost:5001/admin</div>
              <div>http://localhost:8080/status</div>
              <div>http://127.0.0.1:3000/debug</div>
            </div>
          </div>

          <div className="module-card">
            <h4>🔒 Private Networks</h4>
            <p>Internal network resources</p>
            <div className="terminal" style={{ fontSize: '0.8rem' }}>
              <div>http://192.168.1.1/admin</div>
              <div>http://10.0.0.1/config</div>
              <div>http://172.16.0.1/status</div>
            </div>
          </div>

          <div className="module-card">
            <h4>☁️ Cloud Metadata</h4>
            <p>Cloud provider metadata services</p>
            <div className="terminal" style={{ fontSize: '0.8rem' }}>
              <div>http://169.254.169.254/</div>
              <div>http://metadata.google.internal/</div>
              <div>http://100.100.100.200/</div>
            </div>
          </div>

          <div className="module-card">
            <h4>📁 File System</h4>
            <p>Local file system access</p>
            <div className="terminal" style={{ fontSize: '0.8rem' }}>
              <div>file:///etc/passwd</div>
              <div>file:///windows/system32/drivers/etc/hosts</div>
              <div>file:///proc/version</div>
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
          This digital archive system demonstrates a Server-Side Request Forgery (SSRF) vulnerability where 
          the application makes HTTP requests to user-supplied URLs without proper validation. This allows 
          attackers to probe internal networks and access services that should not be publicly accessible.
        </p>

        <h3 style={{ color: '#00ff00', marginBottom: '1rem' }}>Attack Impact</h3>
        <ul style={{ lineHeight: '1.6', paddingLeft: '2rem' }}>
          <li>Access to internal services and APIs</li>
          <li>Port scanning of internal networks</li>
          <li>Reading local files (in some configurations)</li>
          <li>Bypassing firewall restrictions</li>
          <li>Potential for further exploitation of discovered services</li>
        </ul>

        <div className="alert alert-error" style={{ marginTop: '1rem' }}>
          <strong>⚠️ Prevention:</strong> Always validate and sanitize URLs, use allowlists for permitted domains, 
          implement network segmentation, and restrict outbound connections from application servers.
        </div>
      </div>
    </div>
  );
};

export default DigitalArchive;
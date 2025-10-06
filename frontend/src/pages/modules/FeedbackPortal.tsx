import React, { useState, useRef } from 'react';
import { apiService } from '../../services/apiService';

const FeedbackPortal: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    rating: 5
  });
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);
  const displayRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'rating' ? parseInt(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setResult(null);

    try {
      const response = await apiService.submitFeedback(formData);
      setResult(response);
      
      // Display the feedback (vulnerable to DOM-based XSS)
      if (response.data) {
        
        // Intentionally vulnerable: Direct HTML insertion
        if (displayRef.current) {
          displayRef.current.innerHTML = `
            <div class="feedback-display">
              <h4>Feedback Submitted Successfully!</h4>
              <p><strong>Name:</strong> ${response.data.name}</p>
              <p><strong>Email:</strong> ${response.data.email}</p>
              <p><strong>Subject:</strong> ${response.data.subject}</p>
              <p><strong>Message:</strong> ${response.data.message}</p>
              <p><strong>Rating:</strong> ${response.data.rating}/5</p>
              <p><strong>Submitted:</strong> ${new Date(response.data.submittedAt).toLocaleString()}</p>
            </div>
          `;
        }
      }

      // Check for flag in response
      if (response.flag) {
        setResult((prev: any) => ({ ...prev, flag: response.flag }));
      }

    } catch (error: any) {
      setResult({ success: false, error: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const clearForm = () => {
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: '',
      rating: 5
    });
    setResult(null);
    if (displayRef.current) {
      displayRef.current.innerHTML = '';
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="card">
        <div className="card-header">
          <h1 className="card-title">💬 CaptureZone Feedback Portal</h1>
          <p style={{ color: '#ffaa00' }}>
            Share your experience with our services. Your feedback is valuable to us!
          </p>
        </div>

        <div className="alert alert-warning">
          <strong>🎯 Challenge:</strong> This feedback portal contains a DOM-based XSS vulnerability. 
          Try injecting JavaScript code in the form fields to execute scripts and capture the flag.
        </div>
      </div>

      {/* Feedback Form */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📝 Submit Feedback</h2>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name" className="form-label">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-control"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="subject" className="form-label">
              Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              className="form-control"
              value={formData.subject}
              onChange={handleInputChange}
              placeholder="Feedback subject"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="message" className="form-label">
              Message (Vulnerable Field - Try XSS Here!)
            </label>
            <textarea
              id="message"
              name="message"
              className="form-control"
              value={formData.message}
              onChange={handleInputChange}
              placeholder="Enter your feedback message... Try: &lt;script&gt;alert('XSS')&lt;/script&gt;"
              rows={5}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="rating" className="form-label">
              Rating
            </label>
            <select
              id="rating"
              name="rating"
              className="form-control"
              value={formData.rating}
              onChange={handleInputChange}
            >
              <option value={1}>1 - Poor</option>
              <option value={2}>2 - Fair</option>
              <option value={3}>3 - Good</option>
              <option value={4}>4 - Very Good</option>
              <option value={5}>5 - Excellent</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              type="submit" 
              className="btn"
              disabled={submitting}
            >
              {submitting ? <span className="loading"></span> : '📤 Submit Feedback'}
            </button>
            
            <button 
              type="button" 
              className="btn btn-warning"
              onClick={clearForm}
            >
              🗑️ Clear Form
            </button>
          </div>
        </form>
      </div>

      {/* Feedback Display (Vulnerable Area) */}
      {result && (
        <div className="card">
          <div className="card-header">
            <h2 className="card-title">📋 Submitted Feedback</h2>
          </div>

          {/* Vulnerable div for DOM-based XSS */}
          <div 
            ref={displayRef}
            style={{
              padding: '1rem',
              border: '1px solid #00ff00',
              borderRadius: '5px',
              backgroundColor: 'rgba(0, 255, 0, 0.05)'
            }}
          ></div>

          {/* Flag Display */}
          {result.flag && (
            <div className="alert alert-success" style={{ marginTop: '1rem' }}>
              <strong>🎉 FLAG CAPTURED!</strong><br />
              <code style={{ fontSize: '1.2rem', color: '#00ff00' }}>{result.flag}</code><br />
              <em>Copy this flag and submit it in the module page to earn points!</em>
            </div>
          )}
        </div>
      )}

      {/* Exploitation Hints */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">💡 XSS Exploitation Hints</h2>
        </div>

        <div className="terminal">
          <div style={{ color: '#00ff00' }}>DOM-based XSS Attack Vectors:</div>
          <div className="terminal-prompt">1. Basic script injection: &lt;script&gt;alert('XSS')&lt;/script&gt;</div>
          <div className="terminal-prompt">2. Event handlers: &lt;img src=x onerror=alert('XSS')&gt;</div>
          <div className="terminal-prompt">3. SVG payload: &lt;svg onload=alert('XSS')&gt;</div>
          <div className="terminal-prompt">4. iframe injection: &lt;iframe src=javascript:alert('XSS')&gt;</div>
        </div>

        <div className="alert alert-warning" style={{ marginTop: '1rem' }}>
          <strong>🎯 Goal:</strong> Inject JavaScript code in the message field that executes when the feedback is displayed. 
          The flag will be revealed when successful XSS execution is detected by the server.
        </div>

        <div className="alert alert-error" style={{ marginTop: '1rem' }}>
          <strong>⚠️ Learning Note:</strong> This vulnerability exists because the application directly inserts user input 
          into the DOM using innerHTML without proper sanitization. In real applications, always sanitize user input 
          and use safe DOM manipulation methods.
        </div>
      </div>

      {/* Technical Details */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🔬 Technical Analysis</h2>
        </div>

        <h3 style={{ color: '#00ff00', marginBottom: '1rem' }}>Vulnerability Details</h3>
        <p style={{ lineHeight: '1.6', marginBottom: '1rem' }}>
          This feedback portal demonstrates a DOM-based XSS vulnerability where user input is processed 
          on the client-side without proper sanitization. The application uses <code>innerHTML</code> to 
          display feedback data, which allows HTML and JavaScript execution.
        </p>

        <h3 style={{ color: '#00ff00', marginBottom: '1rem' }}>Attack Flow</h3>
        <ol style={{ lineHeight: '1.6', paddingLeft: '2rem' }}>
          <li>User submits feedback with malicious JavaScript payload</li>
          <li>Server processes and returns the unsanitized data</li>
          <li>Client-side JavaScript inserts the data into DOM using innerHTML</li>
          <li>Malicious script executes in the user's browser context</li>
          <li>Flag is revealed when XSS execution is detected</li>
        </ol>
      </div>
    </div>
  );
};

export default FeedbackPortal;
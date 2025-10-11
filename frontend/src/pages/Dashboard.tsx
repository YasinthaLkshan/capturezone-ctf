import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { apiService, Progress } from '../services/apiService';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressData = await apiService.getProgress();
        setProgress(progressData);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
        <div className="loading"></div>
        <p style={{ marginTop: '1rem' }}>Loading dashboard...</p>
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

  const getModuleStatusIcon = (completed: boolean) => {
    return completed ? '✅' : '⏳';
  };

  const getModuleName = (moduleId: number) => {
    const moduleNames = {
      1: 'Feedback Portal',
      2: 'Digital Archive',
      3: 'Broken Authentication',
      4: 'Admin Portal'
    };
    return moduleNames[moduleId as keyof typeof moduleNames] || `Module ${moduleId}`;
  };

  return (
    <div>
      {/* Welcome Section */}
      <div className="card" style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div className="card-header">
          <h1 style={{ 
            fontSize: '2.5rem', 
            background: 'linear-gradient(45deg, #00ff88, #00ffff)', 
            WebkitBackgroundClip: 'text', 
            WebkitTextFillColor: 'transparent',
            marginBottom: '1rem'
          }}>
            🎯 Welcome to CaptureZone
          </h1>
          <p style={{ 
            color: '#ffaa00', 
            fontSize: '1.2rem',
            marginBottom: '0.5rem'
          }}>
            Welcome back, Agent <strong style={{ color: '#00ff88' }}>{user?.username}</strong>
          </p>
          <p style={{ 
            color: '#cccccc', 
            fontSize: '1rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Your cybersecurity training command center. Track your progress, monitor completed missions, 
            and continue your journey to become an elite security specialist.
          </p>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <h2 className="card-title">📊 Mission Control Dashboard</h2>
        </div>

        {progress && (
          <div className="module-grid">
            {/* Progress Overview */}
            <div className="module-card">
              <h3>📊 Training Progress</h3>
              <div className="progress-bar" style={{ margin: '1rem 0' }}>
                <div 
                  className="progress-fill" 
                  style={{ width: `${progress.progress.completionPercentage}%` }}
                ></div>
              </div>
              <p>{progress.progress.completionPercentage}% Complete</p>
              <p>{progress.progress.totalFlags} / {progress.progress.totalModules} Flags Captured</p>
            </div>

            {/* Quick Stats */}
            <div className="module-card">
              <h3>🏆 Achievement Stats</h3>
              <div style={{ fontSize: '1.1rem' }}>
                <p>🚩 Flags Captured: <strong>{progress.progress.totalFlags}</strong></p>
                <p>📚 Modules Completed: <strong>{progress.progress.completedModules}</strong></p>
                <p>⚡ Last Activity: <strong>{new Date(progress.progress.lastActivity).toLocaleDateString()}</strong></p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Module Status */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">🎮 Module Status</h2>
        </div>

        {progress && (
          <div className="module-grid">
            {progress.progress.moduleStatus.map((module) => (
              <div key={module.moduleId} className="module-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h4>{getModuleStatusIcon(module.completed)} {getModuleName(module.moduleId)}</h4>
                  <span className={`module-difficulty ${module.completed ? 'difficulty-easy' : 'difficulty-medium'}`}>
                    {module.completed ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
                
                {module.completed && module.completedAt && (
                  <p style={{ color: '#00ff00', fontSize: '0.9rem' }}>
                    Completed: {new Date(module.completedAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">⚡ Quick Actions</h2>
        </div>

        <div className="module-grid">
          <div className="module-card">
            <h4>🎯 Continue Training</h4>
            <p>Access all available security modules and start your next challenge.</p>
            <Link to="/modules" className="btn">
              View All Modules
            </Link>
          </div>

          <div className="module-card">
            <h4>🔬 Practice Labs</h4>
            <p>Jump directly into the vulnerable applications to test your skills.</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
              <Link to="/lab/feedback-portal" className="btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                XSS Lab
              </Link>
              <Link to="/lab/digital-archive" className="btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                SSRF Lab
              </Link>
              <Link to="/lab/system-diagnostics" className="btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                Auth Lab
              </Link>
              <Link to="/lab/admin-portal" className="btn" style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}>
                NoSQL Lab
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      {progress && progress.progress.totalFlags > 0 && (
        <div className="alert alert-success">
          <strong>🎉 Great Progress!</strong> You've successfully captured {progress.progress.totalFlags} flag{progress.progress.totalFlags !== 1 ? 's' : ''}. 
          Keep exploring the platform to discover more vulnerabilities and enhance your cybersecurity skills!
        </div>
      )}
    </div>
  );
};

export default Dashboard;
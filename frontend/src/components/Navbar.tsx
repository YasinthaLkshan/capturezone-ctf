import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🔒 CaptureZone
      </Link>
      
      <ul className="navbar-nav">
        {isAuthenticated ? (
          <>
            <li>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/modules" className="nav-link">
                Tasks
              </Link>
            </li>
            <li>
              <span className="nav-link" style={{ cursor: 'default' }}>
                Welcome, {user?.username}
              </span>
            </li>
            <li>
              <button onClick={handleLogout} className="btn btn-danger">
                Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
            <li>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
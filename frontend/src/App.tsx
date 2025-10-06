import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ModuleList from './pages/ModuleList';
import ModuleDetail from './pages/ModuleDetail';
import FeedbackPortal from './pages/modules/FeedbackPortal';
import DigitalArchive from './pages/modules/DigitalArchive';
import SystemDiagnostics from './pages/modules/SystemDiagnostics';
import AdminPortal from './pages/modules/AdminPortal';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/dashboard" 
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/modules" 
                element={
                  <ProtectedRoute>
                    <ModuleList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/modules/:id" 
                element={
                  <ProtectedRoute>
                    <ModuleDetail />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/lab/feedback-portal" 
                element={
                  <ProtectedRoute>
                    <FeedbackPortal />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/lab/digital-archive" 
                element={
                  <ProtectedRoute>
                    <DigitalArchive />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/lab/system-diagnostics" 
                element={
                  <ProtectedRoute>
                    <SystemDiagnostics />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/lab/admin-portal" 
                element={
                  <ProtectedRoute>
                    <AdminPortal />
                  </ProtectedRoute>
                } 
              />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

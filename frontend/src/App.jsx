import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import AdminDashboard from './pages/AdminDashboard';
import JudgeDashboard from './pages/JudgeDashboard';
import LawyerDashboard from './pages/LawyerDashboard';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

// Placeholder Dashboards

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/citizen" element={
            <ProtectedRoute roles={['CITIZEN']}>
              <CitizenDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="/police" element={
            <ProtectedRoute roles={['POLICE']}>
              <PoliceDashboard />
            </ProtectedRoute>
          } />

          <Route path="/lawyer" element={
            <ProtectedRoute roles={['LAWYER']}>
              <LawyerDashboard />
            </ProtectedRoute>
          } />

          <Route path="/judge" element={
            <ProtectedRoute roles={['JUDGE']}>
              <JudgeDashboard />
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />

          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

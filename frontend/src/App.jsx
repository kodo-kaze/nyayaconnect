import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import PoliceDashboard from './pages/PoliceDashboard';
import InvestigationPanel from './pages/InvestigationPanel';
import CaseInvestigation from './pages/CaseInvestigation';
import AdminDashboard from './pages/AdminDashboard';
import JudgeDashboard from './pages/JudgeDashboard';
import LawyerDashboard from './pages/LawyerDashboard';
import NotFound from './pages/NotFound';

// Protected Route Component
const ProtectedRoute = ({ children, roles }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;
  return children;
};

// Root Redirect Component
const RootRedirect = () => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" />;
  
  const role = user.role;
  if (role === 'ADMIN') return <Navigate to="/admin" />;
  if (role === 'JUDGE') return <Navigate to="/judge" />;
  if (role === 'POLICE') return <Navigate to="/police" />;
  if (role === 'LAWYER') return <Navigate to="/lawyer" />;
  return <Navigate to="/citizen" />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/citizen" element={
            <ProtectedRoute roles={['CITIZEN']}>
              <Layout>
                <CitizenDashboard />
              </Layout>
            </ProtectedRoute>
          } />
          
          <Route path="/police" element={
            <ProtectedRoute roles={['POLICE']}>
              <Layout>
                <PoliceDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/police/investigation" element={
            <ProtectedRoute roles={['POLICE']}>
              <Layout>
                <InvestigationPanel />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/police/investigation/:id" element={
            <ProtectedRoute roles={['POLICE']}>
              <Layout>
                <CaseInvestigation />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/lawyer" element={
            <ProtectedRoute roles={['LAWYER']}>
              <Layout>
                <LawyerDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/judge" element={
            <ProtectedRoute roles={['JUDGE']}>
              <Layout>
                <JudgeDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/admin" element={
            <ProtectedRoute roles={['ADMIN']}>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          } />

          <Route path="/" element={<RootRedirect />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Layout from './components/layout/Layout';

// Pages d'authentification
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Pages administrateur
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import CircuitManagement from './pages/admin/CircuitManagement';
import BorneManagement from './pages/admin/BorneManagement';

import UserDashboard from './pages/user/userDashboard';
import DossierList from './pages/user/dossierList';
import DossierCreate from './pages/user/DossierCreate';
import CircuitList from './pages/user/CircuitList';
import NotificationList from './pages/user/NotificationList';
import MessageList from './pages/user/MessageList';
import Profile from './pages/user/Profile';

// Pages utilisateur
//import UserDashboard from './pages/user/userDashboard';
//import DossierList from './pages/user/DossierList'

// Composant de protection de route
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  if (adminOnly && !isAdmin) {
    return <Navigate to="/user/dashboard" replace />;
  }
  
  return children;
};

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="App">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      <Layout>
        <Routes>
          {/* Routes publiques */}
          <Route
            path="/login"
            element={!user ? <Login /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />}
          />
          <Route
            path="/register"
            element={!user ? <Register /> : <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard'} replace />}
          />
          
          {/* Redirection par défaut */}
          <Route 
            path="/" 
            element={<Navigate to={user ? (user.role === 'admin' ? '/admin/dashboard' : '/user/dashboard') : '/login'} replace />} 
          />

          {/* Routes administrateur */}
          <Route 
            path="/admin/dashboard" 
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/users" 
            element={
              <ProtectedRoute adminOnly={true}>
                <UserManagement />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin/circuits" 
            element={
              <ProtectedRoute adminOnly={true}>
                <CircuitManagement />
              </ProtectedRoute>
            } 
          />
          <Route
            path="/admin/circuits/:circuitId/bornes"
            element={
              <ProtectedRoute adminOnly={true}>
                <BorneManagement />
              </ProtectedRoute>
            }
          />

          {/* Routes utilisateur */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dossiers"
            element={
              <ProtectedRoute>
                <DossierList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dossiers/create"
            element={
              <ProtectedRoute>
                <DossierCreate />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/circuits"
            element={
              <ProtectedRoute>
                <CircuitList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/notifications"
            element={
              <ProtectedRoute>
                <NotificationList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/messages"
            element={
              <ProtectedRoute>
                <MessageList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Route de fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </div>
  );
}

export default App;

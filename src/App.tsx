import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import EnvChecker from './components/EnvChecker';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Promotions from './pages/Promotions';
import Properties from './pages/Properties';
import Clients from './pages/Clients';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Setup from './pages/Setup';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <EnvChecker />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
          <Route path="/setup" element={<Setup />} />
          <Route
            path="/*"
            element={
              user ? (
                <Layout>
                  <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route
                      path="/promotions"
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'commercial']}>
                          <Promotions />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/properties"
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'commercial']}>
                          <Properties />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/clients"
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'commercial']}>
                          <Clients />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/documents"
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'commercial']}>
                          <Documents />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/reports"
                      element={
                        <ProtectedRoute allowedRoles={['admin', 'commercial']}>
                          <Reports />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <ProtectedRoute allowedRoles={['admin']}>
                          <Users />
                        </ProtectedRoute>
                      }
                    />
                  </Routes>
                </Layout>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
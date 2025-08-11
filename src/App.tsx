import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import EnvChecker from './components/EnvChecker';
import Dashboard from './pages/Dashboard';
import Promotions from './pages/Promotions';
import Properties from './pages/Properties';
import Clients from './pages/Clients';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Users from './pages/Users';
import Setup from './pages/Setup';

function App() {
  // Temporarily disable authentication - always show as logged in admin user
  const mockUser = {
    id: 'mock-admin-id',
    email: 'admin@crm.com',
    full_name: 'Administrador',
    role: 'admin' as const
  };

  return (
    <Router>
      <div className="App">
        <EnvChecker />
        <Toaster position="top-right" />
        <Routes>
          <Route path="/setup" element={<Setup />} />
          <Route
            path="/*"
            element={
              <Layout mockUser={mockUser}>
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/promotions" element={<Promotions />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/clients" element={<Clients />} />
                  <Route path="/documents" element={<Documents />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/users" element={<Users />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
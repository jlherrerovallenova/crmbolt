import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout';
import EnvChecker from './components/EnvChecker';
import Dashboard from './pages/Dashboard';
import Promotions from './pages/Promotions';
import Properties from './pages/Properties';
import Clients from './pages/Clients';
import Documents from './pages/Documents';
import Reports from './pages/Reports';
import Users from './pages/Users';

function App() {
  return (
    <Router>
      <div className="App">
        <EnvChecker />
        <Toaster position="top-right" />
        <Layout>
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
      </div>
    </Router>
  );
}

export default App;
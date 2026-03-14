import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ContactProvider } from './context/ContactContext';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/layout/PrivateRoute';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Groups from './pages/Groups';
import Login from './pages/Login';
import Register from './pages/Register';

// ── Authenticated layout ───────────────────────────────────
const AppLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[#0f172a] overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar — fixed width on desktop, slide-in on mobile */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content — takes remaining space */}
      <div className="flex-1 flex flex-col overflow-hidden md:ml-0">
        <Navbar onMenuClick={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected */}
          <Route path="/" element={
            <PrivateRoute>
              <ContactProvider>
                <AppLayout><Dashboard /></AppLayout>
              </ContactProvider>
            </PrivateRoute>
          } />
          <Route path="/favorites" element={
            <PrivateRoute>
              <ContactProvider>
                <AppLayout><Favorites /></AppLayout>
              </ContactProvider>
            </PrivateRoute>
          } />
          <Route path="/groups" element={
            <PrivateRoute>
              <ContactProvider>
                <AppLayout><Groups /></AppLayout>
              </ContactProvider>
            </PrivateRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
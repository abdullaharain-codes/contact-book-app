import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ContactProvider } from './context/ContactContext';
import Dashboard from './pages/Dashboard';
import Favorites from './pages/Favorites';
import Groups from './pages/Groups';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Toast from './components/ui/Toast';
import { useState } from 'react';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
  };

  return (
    <ContactProvider>
      <Router>
        <div className="flex min-h-screen bg-dark text-white">
          <Sidebar 
            isOpen={sidebarOpen} 
            onClose={handleCloseSidebar}
          />
          
          {/* Main Content */}
          <div className="flex-1 flex flex-col md:ml-[260px] w-full">
            <Navbar 
              onAddContact={() => setShowAddModal(true)}
              onMenuClick={handleMenuClick}
            />
            
            <main className="flex-1 overflow-y-auto p-4 md:p-6">
              <Routes>
                <Route 
                  path="/" 
                  element={
                    <Dashboard 
                      showAddModal={showAddModal} 
                      setShowAddModal={setShowAddModal} 
                    />
                  } 
                />
                <Route 
                  path="/favorites" 
                  element={
                    <Favorites 
                      showAddModal={showAddModal} 
                      setShowAddModal={setShowAddModal} 
                    />
                  } 
                />
                <Route 
                  path="/groups" 
                  element={
                    <Groups 
                      showAddModal={showAddModal} 
                      setShowAddModal={setShowAddModal} 
                    />
                  } 
                />
              </Routes>
            </main>
          </div>
        </div>
        <Toast />
      </Router>
    </ContactProvider>
  );
}

export default App;
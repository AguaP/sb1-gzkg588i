import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import HomePage from './pages/HomePage';
import AdminPanel from './pages/AdminPanel';
import AdminLogin from './components/AdminLogin';
import { Moon, Sun } from 'lucide-react';

function App() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDark.toString());
  }, [isDark]);

  const handleAdminClick = () => {
    setShowAdminLogin(true);
  };

  const handleLoginSuccess = () => {
    setShowAdminLogin(false);
    setIsAdmin(true);
  };

  const handleLogout = () => {
    setIsAdmin(false);
    setShowAdminLogin(false);
  };

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <AppProvider>
      {showAdminLogin ? (
        <AdminLogin 
          onSuccess={handleLoginSuccess} 
          onBack={() => setShowAdminLogin(false)}
        />
      ) : isAdmin ? (
        <AdminPanel onLogout={handleLogout} isDark={isDark} onThemeToggle={toggleDarkMode} />
      ) : (
        <HomePage onAdminClick={handleAdminClick} isDark={isDark} onThemeToggle={toggleDarkMode} />
      )}
    </AppProvider>
  );
}

export default App;
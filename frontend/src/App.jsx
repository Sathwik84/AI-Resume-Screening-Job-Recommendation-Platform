import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import Ats from './pages/Ats';
import Jobs from './pages/Jobs';
import Profile from './pages/Profile';
import AiTools from './pages/AiTools';
import TailorAssistant from './pages/TailorAssistant';
import WorkflowVisuals from './pages/WorkflowVisuals';

function MainApp() {
  const [currentTab, setCurrentTab] = useState('landing');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50 dark:bg-darkBg transition-colors">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <span className="text-sm text-gray-400 font-semibold tracking-wide animate-pulse">Initializing ElevateResume...</span>
        </div>
      </div>
    );
  }

  // Route Safeguard: redirect to login if unauthenticated on dashboard tabs
  const dashboardTabs = ['dashboard', 'upload', 'ats', 'jobs', 'profile', 'ai-tools', 'tailor-assistant', 'n8n-visuals'];
  if (!token && dashboardTabs.includes(currentTab)) {
    setCurrentTab('login');
  }

  const renderContent = () => {
    switch (currentTab) {
      case 'landing':
        return <Landing setCurrentTab={setCurrentTab} token={token} />;
      case 'login':
        return <Login setCurrentTab={setCurrentTab} />;
      case 'dashboard':
        return <Dashboard setCurrentTab={setCurrentTab} />;
      case 'upload':
        return <Upload setCurrentTab={setCurrentTab} />;
      case 'ats':
        return <Ats setCurrentTab={setCurrentTab} />;
      case 'tailor-assistant':
        return <TailorAssistant />;
      case 'jobs':
        return <Jobs />;
      case 'profile':
        return <Profile />;
      case 'ai-tools':
        return <AiTools />;
      case 'n8n-visuals':
        return <WorkflowVisuals />;
      default:
        return <Landing setCurrentTab={setCurrentTab} token={token} />;
    }
  };

  const isFullWidthPage = currentTab === 'landing' || currentTab === 'login';

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-darkBg text-gray-900 dark:text-gray-100 transition-colors">
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      
      {isFullWidthPage ? (
        <main className="flex-grow">
          {renderContent()}
        </main>
      ) : (
        <div className="flex-grow flex relative">
          <Sidebar 
            currentTab={currentTab} 
            setCurrentTab={setCurrentTab} 
            sidebarOpen={sidebarOpen} 
            setSidebarOpen={setSidebarOpen} 
          />
          <main className="flex-grow p-6 md:p-8 max-w-7xl mx-auto overflow-x-hidden">
            {renderContent()}
          </main>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ThemeProvider>
  );
}

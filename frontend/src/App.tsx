import { useState } from 'react';
import MainLayout from './components/layout/MainLayout';
import ChatArea from './components/chat/ChatArea';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import ExplorePage from './components/pages/ExplorePage';
import PromptsPage from './components/pages/PromptsPage';
import MediaPage from './components/pages/MediaPage';
import SettingsPage from './components/pages/SettingsPage';
import ImageGenPage from './components/pages/ImageGenPage';
import LoginPage from './components/pages/LoginPage';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('home');

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'explore': return <ExplorePage />;
      case 'prompts': return <PromptsPage onNavigateHome={() => setCurrentPage('home')} />;
      case 'media': return <MediaPage />;
      case 'image-gen': return <ImageGenPage />;
      case 'settings': return <SettingsPage />;
      case 'home':
      default:
        return <ChatArea />;
    }
  };

  return (
    <ChatProvider>
      <MainLayout currentPage={currentPage} onNavigate={setCurrentPage}>
        {renderPage()}
      </MainLayout>
    </ChatProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

import React from 'react';
import { GlobalStateProvider } from './context/GlobalStateContext.tsx';
import ModalProvider from './components/providers/ModalProvider.tsx';
import AppLayout from './components/layout/AppLayout.tsx';
import AppRouter from './components/layout/AppRouter.tsx';
import LoginPage from './pages/LoginPage.tsx';
import { useGlobalState } from './context/GlobalStateContext.tsx';

function AppContent() {
  const { currentUser, appTheme, sheetsConfig, loginError, loginEmail, setLoginEmail, loginPassword, setLoginPassword, isRememberLogin, setIsRememberLogin, handleLoginSubmit } = useGlobalState();
  
  // Return login if not logged in
  if (!currentUser) {
    return (
      <LoginPage appTheme={appTheme} sheetsConfig={sheetsConfig} 
        loginError={loginError}
        loginEmail={loginEmail}
        setLoginEmail={setLoginEmail}
        loginPassword={loginPassword}
        setLoginPassword={setLoginPassword}
        isRememberLogin={isRememberLogin}
        setIsRememberLogin={setIsRememberLogin}
        handleLoginSubmit={handleLoginSubmit}
      />
    );
  }

  return (
    <ModalProvider>
      <AppLayout>
        <AppRouter />
      </AppLayout>
    </ModalProvider>
  );
}

export default function App() {
  return (
    <GlobalStateProvider>
      <AppContent />
    </GlobalStateProvider>
  );
}

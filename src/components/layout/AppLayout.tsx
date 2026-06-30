import React from 'react';
import { useGlobalState } from '../../context/GlobalStateContext';
import Header from './Header.tsx';
import Banner from './Banner.tsx';
import TabNavigation from './TabNavigation.tsx';
import RestockAlertBanner from './RestockAlertBanner.tsx';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const g = useGlobalState();
  const {
    currentTheme, appTheme, sheetsConfig, currentUser, isOfflineMode, handleLogoutAction,
    activeTab, hasPermission, setIsScanChoiceOpen, setActiveTab, restockAlertsCount
  } = g;

  return (
    <div className={currentTheme.appBgGradient} data-theme={appTheme}>
      <Header 
        currentTheme={currentTheme}
        sheetsConfig={sheetsConfig}
        currentUser={currentUser}
        isOfflineMode={isOfflineMode}
        handleLogoutAction={handleLogoutAction}
      />
      <div className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8 space-y-6 min-h-[640px]">
        {activeTab === 'dashboard' && (
          <Banner 
            currentTheme={currentTheme}
            appTheme={appTheme}
            currentUser={currentUser}
            hasPermission={hasPermission}
            setIsScanChoiceOpen={setIsScanChoiceOpen}
          />
        )}
        <TabNavigation 
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          currentUser={currentUser}
          hasPermission={hasPermission}
          appTheme={appTheme}
        />
        {activeTab === 'dashboard' && (
          <RestockAlertBanner
            restockAlertsCount={restockAlertsCount}
            hasPermission={hasPermission}
            setActiveTab={setActiveTab}
          />
        )}
        {children}
      </div>
    </div>
  );
}

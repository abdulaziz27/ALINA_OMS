import React from 'react';
import { LogOut } from 'lucide-react';
import { User, SheetsConfig } from '../../types.ts';

interface HeaderProps {
  currentTheme: any;
  sheetsConfig: SheetsConfig;
  currentUser: User | null;
  isOfflineMode: boolean;
  handleLogoutAction: () => void;
}

export default function Header({
  currentTheme,
  sheetsConfig,
  currentUser,
  isOfflineMode,
  handleLogoutAction
}: HeaderProps) {
  return (
    <header className="sticky top-3 z-40 mx-4 max-w-7xl lg:mx-auto select-none">
      <div className={`${currentTheme.headerBg} rounded-2xl sm:rounded-[24px] px-4.5 py-2.5 sm:py-3 flex justify-between items-center transition-all duration-300`}>
        <div className="flex items-center gap-2.5">
          {sheetsConfig.customLogoUrl ? (
            <img 
              src={sheetsConfig.customLogoUrl} 
              alt="Logo" 
              className="w-8 h-8 rounded-full object-cover shadow-md border border-pink-100 bg-white"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#EC4899] via-pink-400 to-white p-[1px] shadow-md flex items-center justify-center transform hover:rotate-6 transition-all select-none">
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center font-sans">
                <span className="text-xs font-black tracking-tighter bg-gradient-to-r from-[#EC4899] to-pink-400 bg-clip-text text-transparent leading-none">Alina</span>
                <span className="text-xs font-bold text-pink-500 uppercase leading-none">Official</span>
              </div>
            </div>
          )}
          <div className="text-left">
            <h1 className="text-xs sm:text-sm font-extrabold text-gray-900 tracking-tight leading-none">{currentTheme.brandName}</h1>
            <p className={`text-xs ${currentTheme.text} font-black font-mono tracking-wider mt-0.5 uppercase`}>
              {currentUser?.Role} PORTAL {currentTheme.deco && <span className="inline-block">{currentTheme.deco}</span>}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden md:block">
            <p className="text-xs font-bold text-gray-950">{currentUser?.Full_Name}</p>
            <p className="text-xs text-gray-400 font-mono select-none flex items-center gap-1 justify-end">
              <span className={`w-1.5 h-1.5 rounded-full inline-block ${isOfflineMode ? 'bg-amber-500 animate-pulse' : 'bg-emerald-500'}`}></span>
              {isOfflineMode ? 'Mode Offline-First' : (currentTheme.petSpeech ? currentTheme.petSpeech : 'Koneksi Server Aktif')}
            </p>
          </div>
          
          <button
            onClick={handleLogoutAction}
            className={`${currentTheme.buttonSecondary} transition-all font-bold px-3 py-1.5 rounded-xl text-sm sm:text-xs flex items-center gap-1.5 cursor-pointer`}
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}

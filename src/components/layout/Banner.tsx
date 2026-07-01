import React from 'react';
import { Barcode } from 'lucide-react';
import { User } from '../../types.ts';
import { AppTheme } from '../../utils/theme.ts';

interface BannerProps {
  currentTheme: any;
  appTheme: AppTheme;
  currentUser: User | null;
  hasPermission: (tabId: string) => boolean;
  setIsScanChoiceOpen: (val: boolean) => void;
}

export default function Banner({
  currentTheme,
  appTheme,
  currentUser,
  hasPermission,
  setIsScanChoiceOpen
}: BannerProps) {
  return (
    <div className={`${currentTheme.bannerGradient} text-white p-6 rounded-[32px] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden text-left shadow-md`}>
      <div className="space-y-2 max-w-xl z-10">
        <span className={`text-sm ${currentTheme.bannerText} px-3 py-1 rounded-full font-bold uppercase tracking-wider`}>
          Live Ops Dashboard {currentTheme.deco && `• ${currentTheme.deco}`}
        </span>
        <h2 className="text-xl font-extrabold tracking-tight">
          Assalamu'alaikum, {currentUser?.Full_Name}! {currentTheme.deco && <span className="inline-block animate-bounce">{currentTheme.deco}</span>}
        </h2>
        <p className="text-xs text-white/85">
          {appTheme === 'ayam' ? (
            'Kukuruyuk! Kelola sirkulasi inventaris celamis dan jilbab brand Alina tercinta bersama ayam-ayam hoki pembawa rezeki!'
          ) : appTheme === 'kucing' ? (
            'Meow! Kelola sirkulasi inventaris celamis dan jilbab brand Alina Anda dengan sentuhan cakar ceria pembongkar stok lancar!'
          ) : appTheme === 'ios' ? (
            'Secure Enterprise Architecture. Standardized data mapping via secure channels with integrated live camera logic.'
          ) : (
            'Kelola sirkulasi inventaris celamis dan jilbab brand Alina Anda dengan integrasi pencatatan Google Sheets secara langsung.'
          )}
        </p>
        {currentTheme.petSpeech && (
          <div className="text-[11px] font-mono bg-white/10 text-white px-2.5 py-1 rounded-xl w-fit mt-1.5 flex items-center gap-1.5">
            <span className="animate-wiggle">🔔</span>
            <span>{currentTheme.petSpeech}</span>
          </div>
        )}
      </div>
      <div className="flex gap-2 z-10">
      {(hasPermission('inventory') || hasPermission('opname')) && (
        <button
          onClick={() => setIsScanChoiceOpen(true)}
          className="bg-white text-slate-900 font-bold py-2.5 px-4 rounded-xl text-xs hover:bg-gray-100 transition cursor-pointer flex items-center gap-1.5 shadow-sm"
        >
          <Barcode className="w-4 h-4" /> Scan Kamera
        </button>
      )}
      </div>
      {/* Decorative background shape */}
      <div className="absolute right-0 top-0 w-44 h-44 bg-white/10 rounded-full translate-x-12 -translate-y-10 filter blur-xl" />
    </div>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Heart } from 'lucide-react';
import { AppTheme } from '../utils/theme.ts';
import { SheetsConfig } from '../types.ts';

interface LoginPageProps {
  appTheme: AppTheme;
  sheetsConfig: SheetsConfig;
  loginEmail: string;
  setLoginEmail: (val: string) => void;
  loginPassword: string;
  setLoginPassword: (val: string) => void;
  isRememberLogin: boolean;
  setIsRememberLogin: (val: boolean) => void;
  loginError: string | null;
  handleLoginSubmit: (e: React.FormEvent) => void;
}

export default function LoginPage({
  appTheme,
  sheetsConfig,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  isRememberLogin,
  setIsRememberLogin,
  loginError,
  handleLoginSubmit
}: LoginPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#FFF8FB] via-white to-[#FCE7F3] flex items-center justify-center p-4 select-none font-sans relative overflow-hidden" data-theme={appTheme}>
      
      {/* Soft floating dynamic shapes for retro visual richness */}
      <div className="absolute top-10 left-10 w-44 h-44 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse" />
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40" />

      {/* Apple standard Rounded corner 24px Card style */}
      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        className="bg-white/80 backdrop-blur-md rounded-[32px] w-full max-w-sm p-8 shadow-2xl border border-pink-100 flex flex-col space-y-6 relative"
      >
        {/* Brand Presentation */}
        <div className="text-center space-y-1.5 flex flex-col items-center">
          {sheetsConfig.customLogoUrl ? (
            <img 
              src={sheetsConfig.customLogoUrl} 
              alt="Brand Logo" 
              className="w-16 h-16 rounded-full object-cover shadow-lg border-2 border-pink-200 mb-1 bg-white"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#EC4899] via-pink-400 to-white p-0.5 shadow-lg border border-pink-200 mb-1 flex items-center justify-center transform hover:rotate-6 transition-all duration-300 select-none">
              <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-1 font-sans">
                <span className="text-[14px] font-black tracking-tight bg-gradient-to-r from-[#EC4899] to-pink-400 bg-clip-text text-transparent leading-none">Alina</span>
                <span className="text-xs font-bold text-pink-500 tracking-wider uppercase mt-0.5">Official</span>
              </div>
            </div>
          )}
          <span className="text-sm bg-pink-50 text-pink-500 font-black tracking-widest px-3 py-1 rounded-full border border-pink-100/60 uppercase">
            MOSLEM FASHION ERP
          </span>
          <h1 className="text-2xl font-extrabold tracking-tight text-[#111827]">ALINA WMS & OMS</h1>
          <p className="text-xs text-gray-400">Warehouse & Order Fulfillment Portal</p>
        </div>

        <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
          <div className="space-y-1">
            <label className="font-bold text-gray-500 uppercase tracking-wide block">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                id="login-email-input"
                placeholder="e.g. owner@alina.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                className="w-full bg-pink-50 border border-pink-100 hover:border-pink-300 rounded-xl py-2 px-3 pl-9 focus:outline-none focus:border-pink-500 text-gray-900 transition"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-500 uppercase tracking-wide block">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                id="login-password-input"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                className="w-full bg-pink-50 border border-pink-100 hover:border-pink-300 rounded-xl py-2 px-3 pl-9 focus:outline-none focus:border-pink-500 text-gray-900 transition"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          <div className="flex items-center justify-between py-1 select-none text-[11px]">
            <label className="flex items-center gap-1.5 font-bold text-gray-500 cursor-pointer">
              <input
                type="checkbox"
                checked={isRememberLogin}
                onChange={(e) => setIsRememberLogin(e.target.checked)}
                className="w-3.5 h-3.5 rounded text-pink-500 focus:ring-pink-400"
              />
              Remember login context
            </label>
            
            <button 
              type="button"
              onClick={() => alert("Lupa password? Silakan hubungi akun OWNER utama (owner@alina.com) untuk mereset kredensial Anda.")}
              className="text-pink-500 hover:underline font-bold"
            >
              Lupa Password?
            </button>
          </div>

          {loginError && (
            <p className="text-red-500 font-bold text-sm text-center bg-red-50 py-2 rounded-xl">
              ⚠️ {loginError}
            </p>
          )}

          <button
            type="submit"
            id="login-submit-btn"
            className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 px-4 rounded-xl cursor-pointer transition shadow-md border border-pink-400/20 tracking-wider text-xs uppercase"
          >
            Sign In to System
          </button>
        </form>

        <div className="text-center font-mono text-xs text-gray-400 flex items-center justify-center gap-1.5">
          ALINA MOSLEM FASHION SYSTEMS <Heart className="w-3 h-3 text-pink-500 fill-current" /> UTC-2026
        </div>
      </motion.div>
    </div>
  );
}

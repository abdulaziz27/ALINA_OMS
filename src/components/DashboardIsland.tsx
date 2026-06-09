/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Package, Users, ShoppingCart, Truck, TrendingUp, Settings, 
  LogOut, AlertTriangle, ShieldCheck, HelpCircle, Activity 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types.ts';

interface DashboardIslandProps {
  currentTab: string;
  setTab: (tab: string) => void;
  currentUser: { Full_Name: string; Email: string; Role: UserRole } | null;
  onLogout: () => void;
  alertsCount: number;
  syncStatus: boolean;
}

export default function DashboardIsland({
  currentTab,
  setTab,
  currentUser,
  onLogout,
  alertsCount,
  syncStatus
}: DashboardIslandProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [islandState, setIslandState] = useState<'idle' | 'notification' | 'expanded'>('idle');

  // Automatically pulse if alertsCount increases
  useEffect(() => {
    if (alertsCount > 0) {
      setIslandState('notification');
      const timer = setTimeout(() => {
        setIslandState('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [alertsCount]);

  const toggleExpand = () => {
    if (islandState === 'expanded') {
      setIsExpanded(false);
      setIslandState('idle');
    } else {
      setIsExpanded(true);
      setIslandState('expanded');
    }
  };

  const navItems = [
    { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
    { id: 'products', name: 'Product Master', icon: Package },
    { id: 'customers', name: 'Customers', icon: Users },
    { id: 'inventory', name: 'Stock Trx', icon: Activity },
    { id: 'opname', name: 'Stock Opname', icon: ShieldCheck },
    { id: 'orders', name: 'Sales Orders', icon: ShoppingCart },
    { id: 'shipping', name: 'Shipping', icon: Truck },
    { id: 'reports', name: 'Forecast & Reports', icon: TrendingUp },
    ...(currentUser?.Role === 'OWNER' ? [{ id: 'users', name: 'Users', icon: Users }] : []),
    { id: 'settings', name: 'Sheets Connector', icon: Settings },
  ];

  return (
    <>
      {/* Blurred dark backdrop overlay to prevent background text bleed-through and visual clashes */}
      <AnimatePresence>
        {islandState === 'expanded' && (
          <motion.div
            key="island-backdrop-blur"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            onClick={toggleExpand}
            className="fixed inset-0 bg-slate-950/50 backdrop-blur-md z-40 cursor-pointer"
          />
        )}
      </AnimatePresence>

      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-4 font-sans select-none">
        <AnimatePresence mode="popLayout">
          {islandState === 'notification' ? (
            <motion.div
              id="island-notification"
              key="notification"
              onClick={toggleExpand}
              initial={{ scale: 0.8, y: -20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, y: -20, opacity: 0 }}
              transition={{ type: 'spring', damping: 15, stiffness: 200 }}
              className="cursor-pointer bg-[#111827] text-white rounded-full py-2.5 px-5 flex items-center justify-between gap-3 shadow-xl border border-pink-500/30"
            >
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-pink-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-pink-500"></span>
                </span>
                <p className="text-xs font-semibold tracking-wide">
                  ALINA ALERTS: {alertsCount} Action Required!
                </p>
              </div>
              <div className="flex items-center gap-1.5 bg-pink-500/20 px-2.5 py-0.5 rounded-full border border-pink-400/20">
                <AlertTriangle className="w-3.5 h-3.5 text-pink-400" />
                <span className="text-[10px] font-bold text-pink-300">RESTOCK</span>
              </div>
            </motion.div>
          ) : islandState === 'expanded' ? (
            <motion.div
              id="island-expanded"
              key="expanded"
              initial={{ height: 44, width: 220, borderRadius: 24, opacity: 0.8 }}
              animate={{ height: 'auto', width: '100%', borderRadius: 28, opacity: 1 }}
              exit={{ height: 44, width: 220, borderRadius: 24, opacity: 0.8 }}
              transition={{ type: 'spring', damping: 18, stiffness: 160 }}
              className="bg-[#111827] text-white p-5 shadow-2xl border border-white/10 overflow-hidden"
            >
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center font-bold text-sm text-white shadow-md">
                  A
                </div>
                <div>
                  <h3 className="font-bold text-sm text-pink-400 tracking-tight">ALINA ENTERPRISE</h3>
                  <p className="text-[10px] text-gray-400 font-mono">
                    {currentUser?.Full_Name} ({currentUser?.Role})
                  </p>
                </div>
              </div>
              
              <button 
                onClick={onLogout}
                className="p-1 px-3 rounded-full hover:bg-pink-500/20 text-pink-400 hover:text-white transition-colors duration-200 text-xs flex items-center gap-1.5"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </button>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = currentTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => {
                      setTab(item.id);
                      setIsExpanded(false);
                      setIslandState('idle');
                    }}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all duration-200 gap-1 text-center border cursor-pointer ${
                      active 
                        ? 'bg-pink-500/25 border-pink-500 text-pink-300 font-semibold' 
                        : 'bg-white/5 border-transparent text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-[10px] tracking-wide truncate w-full">{item.name}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-[10px] text-gray-400 font-mono">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${syncStatus ? 'bg-emerald-400 shadow-emerald-400/50 animate-pulse' : 'bg-amber-400'}`} />
                <span>{syncStatus ? 'Live Google Sheets Linked' : 'Local Sandbox Mode'}</span>
              </div>
              <button 
                onClick={toggleExpand}
                className="text-pink-400 hover:underline hover:text-pink-300"
              >
                Minimize ↑
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            id="island-idle"
            key="idle"
            onClick={toggleExpand}
            whileHover={{ scale: 1.03 }}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="cursor-pointer bg-[#111827] text-white h-11 px-5 mx-auto rounded-full flex items-center justify-between gap-5 shadow-lg border border-pink-500/20 w-fit max-w-full hover:border-pink-500/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500 animate-pulse" />
              <p className="text-xs font-bold tracking-wider uppercase pr-2">
                ALINA WMS & OMS
              </p>
            </div>
            
            <div className="h-4 w-px bg-white/20" />
            
            <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium">
              <p className="truncate max-w-[120px]">
                {navItems.find(n => n.id === currentTab)?.name || 'Dashboard'}
              </p>
              {alertsCount > 0 && (
                <span className="text-[9px] bg-pink-500 text-white font-bold h-4 px-1.5 rounded-full flex items-center justify-center">
                  {alertsCount}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
    </>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import { 
  Users, ShoppingCart, Truck, TrendingUp, Settings, 
  ShieldCheck, Activity, Lock, Package, ArrowLeft
} from 'lucide-react';
import { User } from '../../types.ts';
import { AppTheme } from '../../utils/theme.ts';

interface TabNavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  hasPermission: (tabId: string) => boolean;
  appTheme: AppTheme;
}

export default function TabNavigation({
  activeTab,
  setActiveTab,
  currentUser,
  hasPermission,
  appTheme
}: TabNavigationProps) {
  if (activeTab === 'dashboard') {
    return (
      <div className="space-y-2 text-left mb-4 bg-white p-3.5 rounded-[24px] border border-pink-100/80 shadow-sm animate-[fadeIn_0.2s_ease-out]">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
            <h3 className="text-[10px] font-extrabold uppercase tracking-widest text-[#EC4899]">
              Menu Operasional Alina
            </h3>
          </div>
          <span className="text-[9px] text-gray-400 font-mono">
            Role: {currentUser?.Role}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-3 md:gap-4 max-w-3xl">
          {[
            { id: 'dashboard', name: 'Dashboard', icon: TrendingUp },
            { id: 'products', name: 'Catalog', icon: Package },
            { id: 'inventory', name: 'Stock Trx', icon: Activity },
            { id: 'opname', name: 'Opname', icon: ShieldCheck },
            { id: 'orders', name: 'Orders', icon: ShoppingCart },
            { id: 'shipping', name: 'Shipping', icon: Truck },
            { id: 'reports', name: 'Reports', icon: TrendingUp },
            { id: 'customers', name: 'Customers', icon: Users },
            ...(currentUser?.Role === 'OWNER' ? [{ id: 'users', name: 'Users', icon: Lock }] : []),
            { id: 'settings', name: 'Sheets', icon: Settings },
          ].filter(item => hasPermission(item.id)).map((item) => {
            const Icon = item.icon;
            const isCurrent = activeTab === item.id;
            
            // Mascot active decoration map
            const animalDecorations: Record<string, { ayam: string; kucing: string }> = {
              dashboard: { ayam: '🐔', kucing: '🐱' },
              products: { ayam: '🥚', kucing: '🧶' },
              inventory: { ayam: '🐣', kucing: '🐾' },
              opname: { ayam: '🐓', kucing: '🐟' },
              orders: { ayam: '🌾', kucing: '🐭' },
              shipping: { ayam: '🪶', kucing: '📦' },
              reports: { ayam: '🐓📊', kucing: '🐾📈' },
              customers: { ayam: '🐤', kucing: '😸' },
              users: { ayam: '👨‍🌾', kucing: '🧙‍♂️' },
              settings: { ayam: '🪵', kucing: '🥫' }
            };

            const currentDeco = animalDecorations[item.id];

            return (
              <motion.button
                key={item.id}
                id={`dash-quicknav-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                whileHover={{ scale: 1.04, y: -1 }}
                whileTap={{ scale: 0.96 }}
                className={`flex flex-col items-center justify-center p-2 rounded-xl bg-white border shadow-sm transition-all cursor-pointer text-center group min-h-[72px] ${
                  isCurrent 
                    ? 'border-[#EC4899] ring-2 ring-pink-100 shadow-pink-50'
                    : 'border-pink-100/50 hover:border-pink-200'
                }`}
              >
                <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center relative transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[#EC4899] text-white'
                    : 'bg-[#FFF3F8] text-[#EC4899] group-hover:bg-[#EC4899] group-hover:text-white'
                }`}>
                  <Icon className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                  
                  {/* Animal Mascot overlay absolute indicator badges */}
                  {appTheme === 'ayam' && currentDeco && (
                    <span className="absolute -bottom-1 -right-1 text-[9px] select-none animate-bounce">
                      {currentDeco.ayam}
                    </span>
                  )}
                  {appTheme === 'kucing' && currentDeco && (
                    <span className="absolute -bottom-1 -right-1 text-[9px] select-none scale-105">
                      {currentDeco.kucing}
                    </span>
                  )}
                </div>
                <span className={`mt-1.5 text-[9px] sm:text-[10px] font-extrabold tracking-tight leading-none line-clamp-1 ${
                  isCurrent ? 'text-[#EC4899]' : 'text-gray-600 group-hover:text-[#EC4899]'
                }`}>
                  {item.name}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between bg-white/80 p-3 rounded-2xl border border-pink-100/70 shadow-sm text-left mb-1 animate-[fadeIn_0.25s_ease-out]">
      <button
        onClick={() => setActiveTab('dashboard')}
        className="flex items-center gap-2 bg-white hover:bg-pink-500 hover:text-white text-[#EC4899] transition-all font-extrabold px-4 py-2 rounded-xl text-xs cursor-pointer shadow-sm border border-pink-100/80 group"
      >
        <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
        <span>Kembali ke Dashboard</span>
      </button>
      <div className="flex items-center gap-2 bg-pink-50 px-3 py-1 rounded-full border border-pink-100/40">
        <span className="w-1.5 h-1.5 rounded-full bg-[#EC4899] animate-pulse" />
        <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#EC4899] font-mono">
          Layar {activeTab.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

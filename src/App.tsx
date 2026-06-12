/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Users, ShoppingCart, Truck, TrendingUp, Settings, 
  LogOut, AlertTriangle, ShieldCheck, HelpCircle, Activity,
  Lock, Mail, Heart, RefreshCw, Barcode, ClipboardCheck,
  CheckCircle2, Plus, Calendar, Filter, Archive, CheckSquare, Search, BookOpen, Package,
  ArrowLeft, Trash2, Eye, Printer, ArrowDownCircle, ArrowUpCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateCode128SvgPath } from './barcodeUtils.ts';

// Subcomponents
import DashboardIsland from './components/DashboardIsland.tsx';
import BarcodeScannerModal from './components/BarcodeScannerModal.tsx';
import OwnerFinancials from './components/OwnerFinancials.tsx';
import ProductForm from './components/ProductForm.tsx';

import BackupCenter from './components/BackupCenter.tsx';

// Models
import { 
  User, Product, Customer, StockIn, StockOut, 
  StockOpname, Order, Shipping, ActivityLog, SheetsConfig, OrderStatus, UserRole 
} from './types.ts';

// Pricing and Product presets/helpers
interface ColorPreset {
  name: string;
  hex: string;
  border?: boolean;
}

const celamisRegularColors: ColorPreset[] = [
  { name: 'Hitam', hex: '#111827' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Abu²', hex: '#9CA3AF' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Coksu', hex: '#D2B48C' },
  { name: 'Coktu', hex: '#5C4033' },
  { name: 'Ungu Tua', hex: '#581C87' },
  { name: 'Toska', hex: '#0F766E' },
  { name: 'Plum Truffle', hex: '#4E2F4F' },
  { name: 'Magenta', hex: '#D946EF' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Hijau Army', hex: '#3F6212' },
  { name: 'Mint', hex: '#A7F3D0' }
];

const celamisRibColors: ColorPreset[] = [
  { name: 'Hitam', hex: '#111827' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Abu²', hex: '#9CA3AF' },
  { name: 'Coktu', hex: '#5C4033' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Maroon', hex: '#991B1B' }
];

const celamisShortPantsColors: ColorPreset[] = [
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Pink', hex: '#FBCFE8' },
  { name: 'Ungu Muda', hex: '#E9D5FF' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'Hijau Mint', hex: '#A7F3D0' },
  { name: 'Magenta', hex: '#D946EF' },
  { name: 'Hitam', hex: '#111827' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Coktu', hex: '#5C4033' }
];

const celamisKidsColors: ColorPreset[] = [
  { name: 'Hitam', hex: '#111827' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Coktu', hex: '#5C4033' },
  { name: 'Pink', hex: '#FBCFE8' },
  { name: 'Ungu Muda', hex: '#E9D5FF' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'Hijau Mint', hex: '#A7F3D0' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Abu²', hex: '#9CA3AF' },
  { name: 'Coksu', hex: '#D2B48C' }
];

const celamisKidsRibColors: ColorPreset[] = [
  { name: 'Hitam', hex: '#111827' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Coktu', hex: '#5C4033' },
  { name: 'Pink', hex: '#FBCFE8' },
  { name: 'Ungu Muda', hex: '#E9D5FF' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'Hijau Mint', hex: '#A7F3D0' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Abu²', hex: '#9CA3AF' },
  { name: 'Coksu', hex: '#D2B48C' }
];

const jilbabWoolpeachColors: ColorPreset[] = [
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Milo', hex: '#A58B74' },
  { name: 'Hijau Army', hex: '#3F6212' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Abu abu', hex: '#9CA3AF' },
  { name: 'Tosca', hex: '#0F766E' },
  { name: 'Hitam', hex: '#111827' },
  { name: 'Dark Lavender', hex: '#5E3A8C' },
  { name: 'Coklat tua', hex: '#3E2723' }
];

const jilbabWollycrapeColors: ColorPreset[] = [
  { name: 'Hijau Army', hex: '#3F6212' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'OffWhite', hex: '#FAF9F6', border: true },
  { name: 'Hitam', hex: '#111827' },
  { name: 'Abu abu', hex: '#9CA3AF' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Milo', hex: '#A58B74' },
  { name: 'Coklat susu', hex: '#D2B48C' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Pink', hex: '#FBCFE8' },
  { name: 'Lavender', hex: '#E9D5FF' },
  { name: 'Coklat tua', hex: '#3E2723' }
];

const jilbabAnakColors: ColorPreset[] = [
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Light Cream', hex: '#FFFDD0', border: true },
  { name: 'Baby Pink', hex: '#FFD1DC' },
  { name: 'Hitam', hex: '#111827' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Abu abu', hex: '#9CA3AF' },
  { name: 'Biru langit', hex: '#87CEEB' },
  { name: 'Coklat susu', hex: '#D2B48C' },
  { name: 'Kuning', hex: '#FBBF24' },
  { name: 'merah', hex: '#EF4444' },
  { name: 'Magenta', hex: '#D946EF' },
  { name: 'Mint', hex: '#A7F3D0' }
];

const getColorHexFromName = (colorName: string): string => {
  const name = (colorName || '').trim().toLowerCase();
  
  const allPresets = [
    ...celamisRegularColors,
    ...celamisRibColors,
    ...celamisShortPantsColors,
    ...celamisKidsColors,
    ...celamisKidsRibColors,
    ...jilbabWoolpeachColors,
    ...jilbabWollycrapeColors,
    ...jilbabAnakColors
  ];
  const found = allPresets.find(p => p.name.trim().toLowerCase() === name);
  if (found) return found.hex;

  if (name.includes('hitam') || name.includes('black')) return '#111827';
  if (name.includes('putih') || name.includes('white')) return '#FFFFFF';
  if (name.includes('navy') || name.includes('dongker')) return '#1E3A8A';
  if (name.includes('maroon') || name.includes('marun')) return '#991B1B';
  if (name.includes('pink') || name.includes('merah muda')) return '#FBCFE8';
  if (name.includes('peach')) return '#FDBA74';
  if (name.includes('mint')) return '#A7F3D0';
  if (name.includes('toska') || name.includes('tosca')) return '#0F766E';
  if (name.includes('abu') || name.includes('grey') || name.includes('gray')) return '#9CA3AF';
  if (name.includes('coklat') || name.includes('brown') || name.includes('coktu')) return '#5C4033';
  if (name.includes('coksu') || name.includes('susu')) return '#D2B48C';
  if (name.includes('army') || name.includes('tentara')) return '#3F6212';
  if (name.includes('ungu') || name.includes('purple') || name.includes('violet')) return '#8B5CF6';
  if (name.includes('hijau') || name.includes('green')) return '#10B981';
  if (name.includes('kuning') || name.includes('yellow')) return '#F59E0B';
  if (name.includes('orange') || name.includes('jingga')) return '#F97316';
  if (name.includes('merah') || name.includes('red')) return '#EF4444';
  if (name.includes('salmon')) return '#FDA4AF';
  if (name.includes('magenta')) return '#D946EF';
  if (name.includes('plum')) return '#4E2F4F';
  if (name.includes('cream') || name.includes('krem')) return '#FEF3C7';
  if (name.includes('muda')) return '#DDD6FE';

  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h = Math.abs(hash % 360);
  return `hsl(${h}, 75%, 75%)`;
};

const getColorsByCategory = (cat: string): ColorPreset[] => {
  const c = cat || '';
  switch (c) {
    case 'Celamis Regular':
      return celamisRegularColors;
    case 'Celamis Rib':
      return celamisRibColors;
    case 'Celamis Short Pants':
      return celamisShortPantsColors;
    case 'Celamis Kids':
      return celamisKidsColors;
    case 'Celamis Kids Rib':
      return celamisKidsRibColors;
    case 'Jilbab Woolpeach':
      return jilbabWoolpeachColors;
    case 'Jilbab Wollycrape':
      return jilbabWollycrapeColors;
    case 'Jilbab Anak':
      return jilbabAnakColors;
    default:
      return celamisRegularColors;
  }
};

const getVariantsByCategory = (cat: string): string[] => {
  const c = cat || '';
  switch (c) {
    case 'Celamis Regular':
    case 'Celamis Rib':
    case 'Celamis Short Pants':
      return ['All Size', 'Jumbo', 'Ekstra Jumbo'];
    case 'Celamis Kids':
    case 'Celamis Kids Rib':
      return ['Kids 1', 'Kids 2', 'Kids 3'];
    case 'Jilbab Woolpeach':
    case 'Jilbab Wollycrape':
      return ['M', 'L', 'XL'];
    case 'Jilbab Anak':
      return ['Jilbab Anak 1', 'Jilbab Anak 2', 'Jilbab Anak 3'];
    default:
      return ['All Size'];
  }
};

export function getProductPriceFromSchema(category: string, variant: string, channel: string, fallbackPrice: number): number {
  const cat = category || '';
  const catLower = cat.toLowerCase();
  const isRib = catLower.includes('rib');
  const isKids = catLower.includes('kids') || catLower.includes('anak');

  const vName = variant || '';
  let v = vName.toLowerCase().replace(/\s+/g, '');
  if (v === 'allsize' || v === 'all_size') v = 'allsize';
  else if (v === 'jumbo') v = 'jumbo';
  else if (v === 'ekstrajumbo' || v === 'extrajumbo') v = 'ekstrajumbo';
  else if (v === 'kids1' || v === 'jilbabanak1' || v === 'anak1') v = 'kids1';
  else if (v === 'kids2' || v === 'jilbabanak2' || v === 'anak2') v = 'kids2';
  else if (v === 'kids3' || v === 'jilbabanak3' || v === 'anak3') v = 'kids3';
  else if (v === 'm') v = 'allsize';
  else if (v === 'l') v = 'jumbo';
  else if (v === 'xl') v = 'ekstrajumbo';

  const chName = channel || '';
  let channelType: 'ecer' | 'marketer' | 'reseller' | 'agen' | 'distributor' = 'ecer';
  const cLower = chName.toLowerCase();
  if (cLower.includes('marketer')) channelType = 'marketer';
  else if (cLower.includes('reseller')) channelType = 'reseller';
  else if (cLower.includes('agen')) channelType = 'agen';
  else if (cLower.includes('distributor')) channelType = 'distributor';
  else channelType = 'ecer';

  if (!isKids) {
    if (channelType === 'ecer') {
      if (isRib) {
        if (v === 'allsize') return 90000;
        if (v === 'jumbo') return 95000;
        if (v === 'ekstrajumbo') return 105000;
      } else {
        if (v === 'allsize') return 85000;
        if (v === 'jumbo') return 90000;
        if (v === 'ekstrajumbo') return 97500;
      }
    } else {
      if (isRib) {
        if (v === 'allsize') {
          if (channelType === 'marketer') return 75000;
          if (channelType === 'reseller') return 62500;
          if (channelType === 'agen') return 55000;
          if (channelType === 'distributor') return 47500;
        }
        if (v === 'jumbo') {
          if (channelType === 'marketer') return 80000;
          if (channelType === 'reseller') return 67500;
          if (channelType === 'agen') return 60000;
          if (channelType === 'distributor') return 52500;
        }
        if (v === 'ekstrajumbo') {
          if (channelType === 'marketer') return 87500;
          if (channelType === 'reseller') return 72500;
          if (channelType === 'agen') return 65000;
          if (channelType === 'distributor') return 57500;
        }
      } else {
        if (v === 'allsize') {
          if (channelType === 'marketer') return 70000;
          if (channelType === 'reseller') return 57500;
          if (channelType === 'agen') return 50000;
          if (channelType === 'distributor') return 42500;
        }
        if (v === 'jumbo') {
          if (channelType === 'marketer') return 75000;
          if (channelType === 'reseller') return 62500;
          if (channelType === 'agen') return 55000;
          if (channelType === 'distributor') return 47500;
        }
        if (v === 'ekstrajumbo') {
          if (channelType === 'marketer') return 82500;
          if (channelType === 'reseller') return 67500;
          if (channelType === 'agen') return 60000;
          if (channelType === 'distributor') return 52500;
        }
      }
    }
  } else {
    if (channelType === 'ecer') {
      if (isRib) {
        if (v === 'kids1') return 70000;
        if (v === 'kids2') return 75000;
        if (v === 'kids3') return 80000;
      } else {
        if (v === 'kids1') return 65000;
        if (v === 'kids2') return 70000;
        if (v === 'kids3') return 75000;
      }
    } else {
      if (isRib) {
        if (v === 'kids1') {
          if (channelType === 'marketer') return 55500;
          if (channelType === 'reseller') return 48000;
          if (channelType === 'agen') return 41500;
          if (channelType === 'distributor') return 35000;
        }
        if (v === 'kids2') {
          if (channelType === 'marketer') return 60000;
          if (channelType === 'reseller') return 52500;
          if (channelType === 'agen') return 45000;
          if (channelType === 'distributor') return 37500;
        }
        if (v === 'kids3') {
          if (channelType === 'marketer') return 65000;
          if (channelType === 'reseller') return 55500;
          if (channelType === 'agen') return 48000;
          if (channelType === 'distributor') return 41500;
        }
      } else {
        if (v === 'kids1') {
          if (channelType === 'marketer') return 52500;
          if (channelType === 'reseller') return 45000;
          if (channelType === 'agen') return 38500;
          if (channelType === 'distributor') return 32500;
        }
        if (v === 'kids2') {
          if (channelType === 'marketer') return 55000;
          if (channelType === 'reseller') return 47500;
          if (channelType === 'agen') return 41500;
          if (channelType === 'distributor') return 35000;
        }
        if (v === 'kids3') {
          if (channelType === 'marketer') return 60000;
          if (channelType === 'reseller') return 52500;
          if (channelType === 'agen') return 46500;
          if (channelType === 'distributor') return 39000;
        }
      }
    }
  }

  return fallbackPrice;
}

const SESSION_TIMEOUT = 8 * 60 * 60 * 1000; // 8 hours in ms

const categoryList = [
  "Celamis Regular",
  "Celamis Rib",
  "Celamis Short Pants",
  "Celamis Kids",
  "Celamis Kids Rib",
  "Jilbab Woolpeach",
  "Jilbab Wollycrape",
  "Jilbab Anak"
];

const safeLocalStorage = {
  getItem: (key: string): string | null => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn("localStorage.getItem blocked or failed:", e);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage.setItem blocked or failed:", e);
    }
  },
  removeItem: (key: string): void => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn("localStorage.removeItem blocked or failed:", e);
    }
  }
};

type AppTheme = 'default' | 'ios' | 'ayam' | 'kucing';

const T = (theme: AppTheme) => {
  const isDefault = theme === 'default';
  const isIos = theme === 'ios';
  const isAyam = theme === 'ayam';
  const isKucing = theme === 'kucing';

  return {
    id: theme,
    logo: isDefault ? 'A' : isIos ? '💎' : isAyam ? '🐔' : '🐱',
    brandName: isDefault 
      ? 'ALINA ENTERPRISE' 
      : isIos 
      ? 'ALINA iOS 26' 
      : isAyam 
      ? 'ALINA CHICKEN MODE 🐔' 
      : 'ALINA MEOW MODE 🐱',
    logoBg: isIos 
      ? 'bg-white/90 shadow-sm border border-slate-200/60 text-slate-800' 
      : isAyam 
      ? 'bg-gradient-to-tr from-orange-500 to-amber-300 border border-orange-200' 
      : isKucing 
      ? 'bg-gradient-to-tr from-amber-800 to-amber-950 border border-amber-700' 
      : 'bg-gradient-to-tr from-[#EC4899] to-[#F9A8D4]',

    // Primary Text styles
    text: isIos ? 'text-slate-900' : isAyam ? 'text-orange-600' : isKucing ? 'text-amber-800' : 'text-[#EC4899]',
    textMuted: isIos ? 'text-slate-500' : isAyam ? 'text-orange-500 font-bold' : isKucing ? 'text-amber-700 font-bold' : 'text-pink-600',
    textHover: isIos ? 'hover:text-black' : isAyam ? 'hover:text-orange-500' : isKucing ? 'hover:text-amber-700' : 'hover:text-[#EC4899]',
    bg: isIos ? 'bg-black' : isAyam ? 'bg-orange-600' : isKucing ? 'bg-amber-800' : 'bg-[#EC4899]',
    bgHover: isIos ? 'hover:bg-gray-900' : isAyam ? 'hover:bg-orange-700' : isKucing ? 'hover:bg-amber-900' : 'hover:bg-pink-600',
    
    // Light backgrounds
    lightBg: isIos ? 'bg-slate-50/70' : isAyam ? 'bg-orange-50/80' : isKucing ? 'bg-amber-50/60' : 'bg-pink-50',
    lightBgHover: isIos ? 'hover:bg-slate-100' : isAyam ? 'hover:bg-orange-100' : isKucing ? 'hover:bg-amber-100/50' : 'hover:bg-pink-100',
    lightBgHalf: isIos ? 'bg-slate-100/40' : isAyam ? 'bg-orange-50/40' : isKucing ? 'bg-amber-50/30' : 'bg-pink-50/50',
    lightBgQuarter: isIos ? 'bg-slate-50/10' : isAyam ? 'bg-orange-50/15' : isKucing ? 'bg-amber-50/10' : 'bg-pink-50/20',

    // Borders
    border: isIos ? 'border-slate-200/50' : isAyam ? 'border-orange-100' : isKucing ? 'border-amber-200/40' : 'border-pink-100',
    borderHover: isIos ? 'hover:border-slate-400' : isAyam ? 'hover:border-orange-300' : isKucing ? 'hover:border-amber-300' : 'hover:border-pink-300',
    borderSolid: isIos ? 'border-slate-200' : isAyam ? 'border-orange-200' : isKucing ? 'border-amber-200' : 'border-pink-200',
    borderLeftAccent: isIos ? 'border-slate-900' : isAyam ? 'border-orange-600' : isKucing ? 'border-amber-800' : 'border-[#EC4899]',
    borderFocus: isIos ? 'focus:border-slate-900 focus:ring-slate-900/10' : isAyam ? 'focus:border-orange-500 focus:ring-orange-500/10' : isKucing ? 'focus:border-amber-700 focus:ring-amber-700/10' : 'focus:border-pink-500 focus:ring-pink-500/10',

    // Shadows
    shadowAccent: isIos ? 'shadow-[0_16px_50px_rgba(0,0,0,0.04)]' : isAyam ? 'shadow-[0_12px_40px_rgba(249,115,22,0.05)]' : isKucing ? 'shadow-[0_12px_40px_rgba(120,53,15,0.04)]' : 'shadow-[0_12px_40px_rgba(236,72,153,0.06)]',
    ringAccent: isIos ? 'ring-slate-500/5' : isAyam ? 'ring-orange-500/10' : isKucing ? 'ring-amber-800/10' : 'ring-pink-500/10',

    // Header Liquid Glass styling
    headerBg: isIos
      ? 'bg-white/70 backdrop-blur-3xl border border-slate-200/40 ring-1 ring-slate-100/50 shadow-xl shadow-slate-900/[0.015]'
      : isAyam
      ? 'bg-white/80 backdrop-blur-xl border border-orange-200/60 ring-1 ring-orange-500/15 shadow-[0_12px_40px_rgba(249,115,22,0.05)]'
      : isKucing
      ? 'bg-white/80 backdrop-blur-xl border border-amber-200/40 ring-1 ring-amber-800/10 shadow-[0_12px_40px_rgba(120,53,15,0.04)]'
      : 'bg-white/65 backdrop-blur-xl border border-white/60 ring-1 ring-pink-500/10 shadow-[0_12px_40px_rgba(236,72,153,0.06)]',

    // Main App Background Gradient
    appBgGradient: isIos 
      ? 'min-h-screen bg-[#FBFBFD] pb-24 font-sans antialiased text-slate-900 relative'
      : isAyam
      ? 'min-h-screen bg-gradient-to-tr from-[#FFFDF9] via-white to-[#FFFBEB] pb-24 font-sans antialiased text-gray-900 relative'
      : isKucing
      ? 'min-h-screen bg-gradient-to-tr from-[#FAF9F6] via-white to-[#F5F2EB] pb-24 font-sans antialiased text-zinc-900 relative'
      : 'min-h-screen bg-gradient-to-tr from-[#FFF8FB] via-white to-[#FCE7F3] pb-24 font-sans antialiased text-gray-900 relative',

    // Banner gradients
    bannerGradient: isIos
      ? 'bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-lg'
      : isAyam
      ? 'bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 shadow-md shadow-orange-500/10'
      : isKucing
      ? 'bg-gradient-to-r from-stone-900 via-amber-900 to-stone-950 border border-amber-950/20 shadow-lg'
      : 'bg-gradient-to-r from-[#EC4899] to-[#F9A8D4]',

    bannerText: isIos 
      ? 'text-[10px] bg-white/10 text-slate-100 font-bold tracking-wide' 
      : isAyam 
      ? 'text-[10px] bg-orange-700/40 text-orange-50 font-bold shadow-sm'
      : isKucing
      ? 'text-[10px] bg-white/15 text-amber-100 font-bold shadow-sm'
      : 'text-[10px] bg-white/20 text-white',

    // Buttons
    buttonSecondary: isIos
      ? 'bg-white hover:bg-slate-100/70 text-slate-950 border border-slate-200/80 shadow-sm'
      : isAyam
      ? 'bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
      : isKucing
      ? 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 shadow-sm'
      : 'bg-white hover:bg-pink-50 text-[#EC4899] border border-pink-100/60 shadow-sm',

    // Speech and dynamic messages
    petSpeech: isDefault 
      ? null 
      : isIos 
      ? 'iOS System: Status normal. Haptic engine ready.' 
      : isAyam 
      ? 'Petok petok! Mandor berkokok di kandang Alina! 🐔'
      : 'Ngeong! Kucing alina siap melompat menjaga stok! 🐱🐾',

    deco: isAyam ? '🐔' : isKucing ? '🐱' : null,
    decoSub: isAyam ? '🐣' : isKucing ? '🐾' : null,
  };
};

export default function App() {
  // Theme state
  const [appTheme, setAppTheme] = useState<AppTheme>(() => {
    return (safeLocalStorage.getItem('alina_app_theme') as AppTheme) || 'default';
  });

  const currentTheme = T(appTheme);

  // Session States
  const [currentUser, setCurrentUser] = useState<{ User_ID?: string; Full_Name: string; Email: string; Role: UserRole; Permissions?: string[] } | null>(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isRememberLogin, setIsRememberLogin] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Active Tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Database States (Refetched on change)
  const [users, setUsers] = useState<User[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stockIn, setStockIn] = useState<StockIn[]>([]);
  const [stockOut, setStockOut] = useState<StockOut[]>([]);
  const [stockOpname, setStockOpname] = useState<StockOpname[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [shipping, setShipping] = useState<Shipping[]>([]);
  const [activityLog, setActivityLog] = useState<ActivityLog[]>([]);
  const [sheetsConfig, setSheetsConfig] = useState<SheetsConfig>({
    scriptUrl: '',
    spreadsheetId: '',
    isLinked: false,
    autoSync: false
  });

  const [isOfflineMode, setIsOfflineMode] = useState(false);

  // Loading indicator for global sync actions
  const [isSyncingGlobal, setIsSyncingGlobal] = useState(false);

  // Scanner States
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const scanCallbackRef = useRef<(sku: string) => void>(() => {});
  const [scannerTitle, setScannerTitle] = useState("SCAN SKU TAG");
  const [isScanChoiceOpen, setIsScanChoiceOpen] = useState(false);

  // Operational form states
  const [activeStockOpnameMonth, setActiveStockOpnameMonth] = useState("Juni 2026");
  const [opnameQuantities, setOpnameQuantities] = useState<{ [sku: string]: string }>({});

  // Stock Trx inputs
  const [selectedTrxType, setSelectedTrxType] = useState<'IN' | 'OUT'>('IN');
  const [trxSku, setTrxSku] = useState('');
  const [stockSkuDropdownOpen, setStockSkuDropdownOpen] = useState(false);
  const [stockSkuSearch, setStockSkuSearch] = useState('');
  const [trxQty, setTrxQty] = useState('');
  const [trxCustomer, setTrxCustomer] = useState('Rania Hijab Store');
  const [trxNotes, setTrxNotes] = useState('');
  const [trxSource, setTrxSource] = useState<'Konveksi' | 'Return'>('Konveksi');
  const [trxQuality, setTrxQuality] = useState<'Good' | 'Reject'>('Good');
  const [trxDestination, setTrxDestination] = useState<'Sales' | 'Return to Konveksi' | 'Reject Disposal'>('Sales');
  const [trxOutQuality, setTrxOutQuality] = useState<'Good' | 'Reject'>('Good');

  // Orders creation inputs
  const [ordCustomer, setOrdCustomer] = useState('Rania Hijab Store');
  const [ordChannel, setOrdChannel] = useState<'Reseller' | 'Agen' | 'Marketer' | 'Konsinyasi' | 'Retail IG' | 'Shopee' | 'TikTok & Tokopedia' | 'Distributor' | 'Ecer'>('Reseller');
  const [ordCategory, setOrdCategory] = useState('Celamis Regular');
  const [ordVariant, setOrdVariant] = useState('All Size');
  const [ordColor, setOrdColor] = useState('Hitam');
  const [ordSku, setOrdSku] = useState('');
  const [ordQty, setOrdQty] = useState('1');
  const [ordPrice, setOrdPrice] = useState('');
  const [tempOrderItems, setTempOrderItems] = useState<{
    SKU: string;
    Product_Name: string;
    Qty: number;
    Price: number;
    Total: number;
  }[]>([]);

  // Derived state to filter categories, variants, and colors available based on master products with Current_Stock > 0
  const readyProducts = products.filter(p => p.Current_Stock > 0);
  
  const availableCategories = Array.from(new Set(
    readyProducts.map(p => p.Category).filter(Boolean)
  )).sort();

  const availableVariants = ordCategory
    ? Array.from(new Set(
        readyProducts
          .filter(p => p.Category.toLowerCase() === ordCategory.toLowerCase())
          .map(p => p.Variant)
          .filter(Boolean)
      )).sort()
    : [];

  const availableColorPresets = (ordCategory && ordVariant)
    ? Array.from(new Set(
        readyProducts
          .filter(p => 
            p.Category.toLowerCase() === ordCategory.toLowerCase() && 
            p.Variant.toLowerCase() === ordVariant.toLowerCase()
          )
          .map(p => p.Color)
          .filter(Boolean)
      )).map((colorName: any) => ({
        name: String(colorName),
        hex: getColorHexFromName(String(colorName))
      }))
    : [];

  // Shipping updates
  const [selectedShipOrder, setSelectedShipOrder] = useState<string | null>(null);
  const [shipCourier, setShipCourier] = useState('JNE Reg');
  const [shipTracking, setShipTracking] = useState('');
  const [shipStatus, setShipStatus] = useState<'Waiting Pickup' | 'In Transit' | 'Delivered'>('In Transit');

  // Picking & Packing checklist
  const [activePackOrder, setActivePackOrder] = useState<Order | null>(null);
  const [packChecklist, setPackChecklist] = useState<{ [item: string]: boolean }>({});
  const [activeDetailOrderNum, setActiveDetailOrderNum] = useState<string | null>(null);

  // Form states for managing Customers (Modal/Inline editing)
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Partial<Customer> | null>(null);

  // User Administration (Owner)
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<Partial<User> | null>(null);

  // RBAC permissions helper
  const hasPermission = (tabId: string): boolean => {
    if (!currentUser) return false;
    // OWNER has full privilege always
    if (currentUser.Role === 'OWNER') return true;
    // Users tab is strictly OWNER-only
    if (tabId === 'users') return false;
    // If no permission array is provided on user, fallback to allowed everything for backwards compatibility
    if (!currentUser.Permissions || currentUser.Permissions.length === 0) return true;
    return currentUser.Permissions.includes(tabId);
  };

  // Reports Filter state
  const [reportsFilter, setReportsFilter] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');

  // ----------------------------------------------------------------------
  // LIFE CYCLE & SESSION GUARDIAN
  // ----------------------------------------------------------------------
  useEffect(() => {
    // Check remembered login Session from storage
    const storedUser = safeLocalStorage.getItem('alina_user');
    const storedTime = safeLocalStorage.getItem('alina_login_time');
    
    if (storedUser && storedTime) {
      const parsedTime = Number(storedTime);
      const currentTime = Date.now();
      
      if (currentTime - parsedTime < SESSION_TIMEOUT) {
        setCurrentUser(JSON.parse(storedUser));
        // Reset guardian timer
        safeLocalStorage.setItem('alina_login_time', currentTime.toString());
      } else {
        // Enforce 8-hour auto-logout
        handleLogoutAction();
      }
    }

    // Load initial data
    fetchDatabaseState();
  }, []);

  // Periodic Session activity checking (Auto Logout)
  useEffect(() => {
    if (!currentUser) return;

    const activityHandler = () => {
      safeLocalStorage.setItem('alina_login_time', Date.now().toString());
    };

    window.addEventListener('mousemove', activityHandler);
    window.addEventListener('keydown', activityHandler);

    // Enforce background polling timer every 10 min
    const timer = setInterval(() => {
      const storedTime = safeLocalStorage.getItem('alina_login_time');
      if (storedTime) {
        const timeDiff = Date.now() - Number(storedTime);
        if (timeDiff > SESSION_TIMEOUT) {
          handleLogoutAction();
        }
      }
    }, 60000);

    return () => {
      window.removeEventListener('mousemove', activityHandler);
      window.removeEventListener('keydown', activityHandler);
      clearInterval(timer);
    };
  }, [currentUser]);

  // Realtime Background Synchronization (Polls server database every 15 seconds)
  useEffect(() => {
    if (!currentUser) return;

    const realTimeInterval = setInterval(() => {
      fetchDatabaseState();
    }, 15000);

    return () => {
      clearInterval(realTimeInterval);
    };
  }, [currentUser]);

  // Redirect to first permitted tab if activeTab is not permitted
  useEffect(() => {
    if (currentUser) {
      if (!hasPermission(activeTab)) {
        const allTabs = ['dashboard', 'products', 'inventory', 'opname', 'orders', 'shipping', 'reports', 'customers', 'settings'];
        const firstPermitted = allTabs.find(tabId => hasPermission(tabId));
        if (firstPermitted) {
          setActiveTab(firstPermitted);
        }
      }
    }
  }, [currentUser, activeTab]);

  // Sync Customer type to Sales Channel automatically
  useEffect(() => {
    if (!ordCustomer || customers.length === 0) return;
    const matchedCust = customers.find(c => c.Customer_Name === ordCustomer);
    if (matchedCust) {
      setOrdChannel(matchedCust.Customer_Type as any);
    }
  }, [ordCustomer, customers]);

  // Set default customer if current one doesn't exist
  useEffect(() => {
    if (customers.length > 0 && !customers.some(c => c.Customer_Name === ordCustomer)) {
      setOrdCustomer(customers[0].Customer_Name);
    }
  }, [customers, ordCustomer]);

  // Handle cascading default selection when available options change based on ready/in-stock items
  useEffect(() => {
    if (products.length === 0) return;

    const readyItems = products.filter(p => p.Current_Stock > 0);
    
    // 1. Resolve Category
    const validCategories = Array.from(new Set(
      readyItems.map(p => p.Category).filter(Boolean)
    )).sort();

    let targetCategory = ordCategory;
    if (validCategories.length > 0) {
      if (!validCategories.includes(ordCategory)) {
        targetCategory = validCategories[0];
      }
    } else {
      targetCategory = '';
    }

    // 2. Resolve Variant based on Category
    const variantsForCat = targetCategory
      ? Array.from(new Set(
          readyItems
            .filter(p => p.Category.toLowerCase() === targetCategory.toLowerCase())
            .map(p => p.Variant)
            .filter(Boolean)
        )).sort()
      : [];

    let targetVariant = ordVariant;
    if (variantsForCat.length > 0) {
      if (!variantsForCat.includes(ordVariant)) {
        targetVariant = variantsForCat[0];
      }
    } else {
      targetVariant = '';
    }

    // 3. Resolve Color based on Category & Variant
    const colorsForCatAndVar = (targetCategory && targetVariant)
      ? Array.from(new Set(
          readyItems
            .filter(p => 
              p.Category.toLowerCase() === targetCategory.toLowerCase() && 
              p.Variant.toLowerCase() === targetVariant.toLowerCase()
            )
            .map(p => p.Color)
            .filter(Boolean)
        ))
      : [];

    let targetColor = ordColor;
    if (colorsForCatAndVar.length > 0) {
      if (!colorsForCatAndVar.includes(ordColor)) {
        targetColor = colorsForCatAndVar[0];
      }
    } else {
      targetColor = '';
    }

    // Batch apply updates only if they've changed to avoid cyclic state updates
    if (ordCategory !== targetCategory) {
      setOrdCategory(targetCategory);
    }
    if (ordVariant !== targetVariant) {
      setOrdVariant(targetVariant);
    }
    if (ordColor !== targetColor) {
      setOrdColor(targetColor);
    }
  }, [products, ordCategory, ordVariant, ordColor]);

  // Automatically find matching product in products database based on Category, Variant, Color
  useEffect(() => {
    if (!products.length) return;
    const matched = products.find(p => 
      p.Category.toLowerCase().trim() === ordCategory.toLowerCase().trim() &&
      p.Variant.toLowerCase().trim() === ordVariant.toLowerCase().trim() &&
      p.Color.toLowerCase().trim() === ordColor.toLowerCase().trim()
    );

    if (matched) {
      setOrdSku(matched.SKU);
      // Auto custom priced from Mitra Alina schema
      const calculatedPrice = getProductPriceFromSchema(ordCategory, ordVariant, ordChannel, matched.Selling_Price);
      setOrdPrice(String(calculatedPrice));
    } else {
      setOrdSku('');
      // Show default calculated price for non-existent master variant just in case
      const calculatedPrice = getProductPriceFromSchema(ordCategory, ordVariant, ordChannel, 0);
      setOrdPrice(String(calculatedPrice));
    }
  }, [ordCategory, ordVariant, ordColor, ordChannel, products]);

  // Helper to pull database directly from Google Sheets on the client side.
  // This achieves true 100% live real-time sync with Google Sheets even if running on 
  // serverless platforms like Vercel (where server background setInterval / background workers do not persist).
  const pullDirectlyFromGoogleSheetsOnClient = async (scriptUrl: string) => {
    try {
      const url = `${scriptUrl}?action=readAll`;
      const response = await fetch(url);
      if (!response.ok) return false;
      const data = await response.json();
      if (!data) return false;

      const parseNumber = (v: any) => {
        if (v === "" || v === null || v === undefined) return 0;
        const num = Number(v);
        return isNaN(num) ? v : num;
      };

      if (data.Products && Array.isArray(data.Products) && data.Products.length > 0) {
        setProducts(data.Products.map((p: any) => ({
          Product_ID: p.Product_ID || p.product_ID || '',
          SKU: p.SKU || p.sku || '',
          Barcode: p.Barcode || p.barcode || p.SKU || '',
          QR_Code: p.QR_Code || p.qr_Code || p.SKU || '',
          Product_Name: p.Product_Name || p.product_Name || '',
          Category: p.Category || p.category || '',
          Variant: p.Variant || p.variant || '',
          Color: p.Color || p.color || '',
          Size: p.Size || p.size || '',
          Cost_Price: parseNumber(p.Cost_Price),
          Selling_Price: parseNumber(p.Selling_Price),
          Current_Stock: parseNumber(p.Current_Stock),
          Minimum_Stock: parseNumber(p.Minimum_Stock),
          Status: p.Status || 'Active'
        })));
      }

      if (data.Customers && Array.isArray(data.Customers) && data.Customers.length > 0) {
        setCustomers(data.Customers.map((c: any) => ({
          Customer_ID: c.Customer_ID || '',
          Customer_Name: c.Customer_Name || '',
          Customer_Type: c.Customer_Type || 'Reseller',
          Phone: c.Phone || '',
          Email: c.Email || '',
          Address: c.Address || '',
          City: c.City || '',
          Status: c.Status || 'Active'
        })));
      }

      if (data.Stock_In && Array.isArray(data.Stock_In)) {
        setStockIn(data.Stock_In.map((s: any) => ({
          Transaction_ID: s.Transaction_ID || '',
          Date: s.Date || '',
          SKU: s.SKU || '',
          Product_Name: s.Product_Name || '',
          Qty: parseNumber(s.Qty),
          Notes: s.Notes || ''
        })));
      }

      if (data.Stock_Out && Array.isArray(data.Stock_Out)) {
        setStockOut(data.Stock_Out.map((s: any) => ({
          Transaction_ID: s.Transaction_ID || '',
          Date: s.Date || '',
          SKU: s.SKU || '',
          Product_Name: s.Product_Name || '',
          Customer: s.Customer || '',
          Qty: parseNumber(s.Qty),
          Notes: s.Notes || ''
        })));
      }

      if (data.Stock_Opname && Array.isArray(data.Stock_Opname)) {
        setStockOpname(data.Stock_Opname.map((s: any) => ({
          Opname_ID: s.Opname_ID || '',
          Month: s.Month || '',
          SKU: s.SKU || '',
          Product_Name: s.Product_Name || '',
          System_Stock: parseNumber(s.System_Stock),
          Physical_Stock: parseNumber(s.Physical_Stock),
          Difference: parseNumber(s.Difference),
          Date: s.Date || ''
        })));
      }

      if (data.Orders && Array.isArray(data.Orders)) {
        setOrders(data.Orders.map((o: any) => ({
          Order_Number: o.Order_Number || '',
          Order_Date: o.Order_Date || '',
          Customer: o.Customer || '',
          Channel: o.Channel || 'Retail',
          SKU: o.SKU || '',
          Product: o.Product || '',
          Qty: parseNumber(o.Qty),
          Price: parseNumber(o.Price),
          Total: parseNumber(o.Total),
          Status: o.Status || 'New Order'
        })));
      }

      if (data.Shipping && Array.isArray(data.Shipping)) {
        setShipping(data.Shipping.map((s: any) => ({
          Tracking_Number: s.Tracking_Number || '',
          Courier: s.Courier || '',
          Order_Number: s.Order_Number || '',
          Shipping_Date: s.Shipping_Date || '',
          Status: s.Status || 'In Transit'
        })));
      }

      if (data.Users && Array.isArray(data.Users) && data.Users.length > 0) {
        setUsers(data.Users.map((u: any) => {
          let parsedPerms = [];
          if (typeof u.Permissions === 'string') {
            try {
              parsedPerms = JSON.parse(u.Permissions);
            } catch (err) {
              parsedPerms = [];
            }
          } else {
            parsedPerms = u.Permissions || [];
          }
          return {
            User_ID: u.User_ID || '',
            Full_Name: u.Full_Name || '',
            Email: u.Email || '',
            Password_Hash: u.Password_Hash || '',
            Password: u.Password || '',
            Role: u.Role || 'ADMIN',
            Status: u.Status || 'Active',
            Last_Login: u.Last_Login || '',
            Created_Date: u.Created_Date || '',
            Permissions: parsedPerms
          };
        }));
      }

      if (data.Activity_Log && Array.isArray(data.Activity_Log)) {
        setActivityLog(data.Activity_Log.map((l: any) => ({
          Log_ID: l.Log_ID || '',
          User_Name: l.User_Name || '',
          User_Role: l.User_Role || 'ADMIN',
          Activity: l.Activity || '',
          Module: l.Module || '',
          Timestamp: l.Timestamp || '',
          Device: l.Device || ''
        })));
      }
      return true;
    } catch (e) {
      console.warn("Direct Google Sheets pull failed on client:", e);
      return false;
    }
  };

  // Sync state triggers
  const fetchDatabaseState = async () => {
    try {
      const res = await fetch(`/api/db?t=${Date.now()}`);
      if (res.ok) {
        const data = await res.json();
        const serverConfig = data.sheetsConfig;
        const localSavedConfigStr = safeLocalStorage.getItem('alina_sheets_config');
        let finalConfig = serverConfig || { scriptUrl: '', spreadsheetId: '', isLinked: false, autoSync: false };
        
        if (localSavedConfigStr) {
          try {
            const localSavedConfig = JSON.parse(localSavedConfigStr);
            // If the server config is empty/not linked, but we have a valid local config, restore it silently on the server
            if ((!serverConfig || !serverConfig.isLinked || !serverConfig.scriptUrl) && localSavedConfig.scriptUrl && localSavedConfig.spreadsheetId) {
              finalConfig = { ...localSavedConfig, isLinked: true };
              fetch('/api/settings/sheets-config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  ...finalConfig,
                  user: { name: 'System Auto-Restore', role: 'OWNER' },
                  isRestore: true
                })
              }).catch(err => console.error("Auto-restore sheets config failed", err));
            } else if (serverConfig && serverConfig.isLinked && serverConfig.scriptUrl) {
              // Ensure local storage is in sync with server config
              safeLocalStorage.setItem('alina_sheets_config', JSON.stringify(serverConfig));
            }
          } catch (e) {
            console.error("Failed to parse local sheets config:", e);
          }
        } else if (serverConfig && serverConfig.isLinked && serverConfig.scriptUrl) {
          // If server has it but local doesn't, save it locally
          safeLocalStorage.setItem('alina_sheets_config', JSON.stringify(serverConfig));
        }
        
        setSheetsConfig(finalConfig);

        // Always trust the local Express backend's data as the primary source of truth if it responds successfully
        setUsers(data.users || []);
        setProducts(data.products || []);
        setCustomers(data.customers || []);
        setStockIn(data.stockIn || []);
        setStockOut(data.stockOut || []);
        setStockOpname(data.stockOpname || []);
        setOrders(data.orders || []);
        setShipping(data.shipping || []);
        setActivityLog(data.activityLog || []);
      }
    } catch (e) {
      console.warn("Failed to connect to backend REST database:", e);
      // Fallback: If backend is fully offline, but we have locally saved sheets credentials, pull directly!
      const localSavedConfigStr = safeLocalStorage.getItem('alina_sheets_config');
      if (localSavedConfigStr) {
        try {
          const localSavedConfig = JSON.parse(localSavedConfigStr);
          if (localSavedConfig.scriptUrl) {
            setSheetsConfig({ ...localSavedConfig, isLinked: true });
            await pullDirectlyFromGoogleSheetsOnClient(localSavedConfig.scriptUrl);
          }
        } catch (err) {
          console.error("Failed parsing local sheets config during offline fallback:", err);
        }
      }
    }
  };

  // ----------------------------------------------------------------------
  // AUTH LOGIC
  // ----------------------------------------------------------------------
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword })
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentUser(data.user);
        
        if (isRememberLogin) {
          safeLocalStorage.setItem('alina_user', JSON.stringify(data.user));
          safeLocalStorage.setItem('alina_login_time', Date.now().toString());
        }
        
        fetchDatabaseState();
      } else {
        let errorMsg = 'Invalid credentials.';
        try {
          const rawText = await response.text();
          try {
            const errorData = JSON.parse(rawText);
            errorMsg = errorData.error || errorMsg;
          } catch(e) {
            errorMsg = 'Server response: ' + rawText.substring(0, 100);
          }
        } catch(e) {}
        setLoginError('Error API Server: ' + errorMsg);
      }
    } catch (err: any) {
      setLoginError('Gagal terhubung ke API Vercel/Express Server. Server mungkin bermasalah atau koneksi offline.');
    }
  };

  const handleLogoutAction = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userName: currentUser?.Full_Name, role: currentUser?.Role })
      });
    } catch (e) {}

    setCurrentUser(null);
    safeLocalStorage.removeItem('alina_user');
    safeLocalStorage.removeItem('alina_login_time');
    setLoginPassword('');
  };

  // ----------------------------------------------------------------------
  // RESTOCK FORECAST METRICS
  // ----------------------------------------------------------------------
  // Average Sales 30 Hari Terakhir:
  // If stock is predicted to deplete within 14 days, forecast warning RESTOCK REQUIRED is generated.
  const calculateRestockForecast = () => {
    const forecastAlerts: { sku: string; name: string; current: number; dsr: number; daysToEmpty: number; predictedDate: string }[] = [];
    
    // Past 30 days orders that are active/sold
    const activeOrders = orders.filter(o => 
      !['Draft', 'Cancelled'].includes(o.Status) && 
      (Date.now() - new Date(o.Order_Date).getTime()) < (30 * 24 * 60 * 60 * 1000)
    );

    products.forEach(p => {
      // Calculate Sum Qty in past 30 days
      const totalSoldIn30Days = activeOrders
        .filter(o => o.SKU === p.SKU)
        .reduce((sum, current) => sum + current.Qty, 0);

      const dailySalesRate = totalSoldIn30Days / 30; // units per day

      if (dailySalesRate > 0) {
        const daysToEmpty = p.Current_Stock / dailySalesRate;
        if (daysToEmpty <= 14) {
          // Calculate predicted date
          const pDateStr = new Date(Date.now() + (daysToEmpty * 24 * 60 * 60 * 1000)).toISOString().slice(0, 10);
          
          forecastAlerts.push({
            sku: p.SKU,
            name: p.Product_Name,
            current: p.Current_Stock,
            dsr: Number(dailySalesRate.toFixed(2)),
            daysToEmpty: Math.round(daysToEmpty),
            predictedDate: pDateStr
          });
        }
      } else if (p.Current_Stock <= p.Minimum_Stock) {
        // Fallback warning based on minimum physical stock alert thresholds
        forecastAlerts.push({
          sku: p.SKU,
          name: p.Product_Name,
          current: p.Current_Stock,
          dsr: 0,
          daysToEmpty: 0,
          predictedDate: "Segera"
        });
      }
    });

    return forecastAlerts;
  };

  const restockForecastList = calculateRestockForecast();
  const restockAlertsCount = restockForecastList.length;

  // ----------------------------------------------------------------------
  // OPERATIONAL SAVE MUTATION HANDLERS
  // ----------------------------------------------------------------------
  
  // Product Form Save
  const handleSaveProduct = async (prod: Partial<Product>, isNew: boolean, id?: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: isNew ? 'CREATE' : 'UPDATE', 
          product: prod, 
          user: { name: currentUser?.Full_Name, role: currentUser?.Role },
          id 
        })
      });
      if (res.ok) {
        await fetchDatabaseState();
        return { success: true };
      } else {
        const data = await res.json();
        console.error('Server error on save:', data.error);
        return { success: false, error: data.error || 'Server error' };
      }
    } catch (e: any) {
      console.error('Network catch during save:', e);
      return { success: false, error: e.message || 'Network error' };
    }
  };

  const handleDeleteProduct = async (id: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          action: 'DELETE', 
          user: { name: currentUser?.Full_Name, role: currentUser?.Role },
          id 
        })
      });
      if (res.ok) {
        await fetchDatabaseState();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  const handleImportProducts = async (importedList: any[]): Promise<boolean> => {
    try {
      const res = await fetch('/api/products/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          products: importedList,
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });
      if (res.ok) {
        await fetchDatabaseState();
        return true;
      }
    } catch (e) {
      console.error(e);
    }
    return false;
  };

  // Stock Trx Stock-In and Stock-Out
  const handleRecordStockTrxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trxSku || !trxQty) return;

    try {
      const endpoint = selectedTrxType === 'IN' ? '/api/inventory/stock-in' : '/api/inventory/stock-out';
      const bodyPayload = selectedTrxType === 'IN' 
        ? { 
            sku: trxSku, 
            qty: Number(trxQty), 
            notes: trxNotes, 
            source_type: trxSource, 
            quality_type: trxQuality,
            user: { name: currentUser?.Full_Name, role: currentUser?.Role } 
          }
        : { 
            sku: trxSku, 
            customer: trxCustomer, 
            qty: Number(trxQty), 
            notes: trxNotes, 
            destination_type: trxDestination,
            quality_type: trxOutQuality,
            user: { name: currentUser?.Full_Name, role: currentUser?.Role } 
          };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyPayload)
      });

      if (res.ok) {
        alert(`Stock ${selectedTrxType} recorded successfully for SKU ${trxSku}!`);
        setTrxQty('');
        setTrxNotes('');
        setTrxSource('Konveksi');
        setTrxQuality('Good');
        setTrxDestination('Sales');
        setTrxOutQuality('Good');
        await fetchDatabaseState();
      } else {
        const err = await res.json();
        alert(`Transaction failure: ${err.error}`);
      }
    } catch (e) {
      alert("Network server connection error.");
    }
  };

  // Scanning triggers
  const triggerCameraScanner = (titleMsg: string, successCallback: (sku: string) => void) => {
    setScannerTitle(titleMsg);
    scanCallbackRef.current = successCallback;
    setIsScannerOpen(true);
  };

  // Stock Opname Monthly Matrix Save
  const handleSaveOpnameSubmit = async (sku: string, physicalCountStr: string) => {
    if (physicalCountStr === undefined || physicalCountStr === '') return;
    
    try {
      const res = await fetch('/api/inventory/stock-opname', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          month: activeStockOpnameMonth,
          sku,
          physicalStock: Number(physicalCountStr),
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      if (res.ok) {
        await fetchDatabaseState();
        // Clear value input
        setOpnameQuantities(prev => ({ ...prev, [sku]: '' }));
      } else {
        const err = await res.json();
        alert(`Opname Error: ${err.error}`);
      }
    } catch (e) {
      alert("Error logging Stock Opname.");
    }
  };

  // Add item to temporary checklist
  const handleAddProductToStaging = () => {
    if (!ordSku) {
      alert("Pilihan kombinasi warna/ukuran/kategori belum menghasilkan SKU valid di Master Produk.");
      return;
    }
    const matchedProduct = products.find(p => p.SKU === ordSku);
    if (!matchedProduct) {
      alert("Master produk tidak ditemukan.");
      return;
    }

    const qtyVal = Number(ordQty);
    if (qtyVal <= 0) {
      alert("Kuantitas pemesanan harus lebih dari 0.");
      return;
    }
    const priceVal = ordPrice ? Number(ordPrice) : matchedProduct.Selling_Price;

    const existingIndex = tempOrderItems.findIndex(item => item.SKU === ordSku);
    if (existingIndex > -1) {
      const updated = [...tempOrderItems];
      updated[existingIndex].Qty += qtyVal;
      updated[existingIndex].Total = updated[existingIndex].Qty * updated[existingIndex].Price;
      setTempOrderItems(updated);
    } else {
      setTempOrderItems(prev => [
        ...prev,
        {
          SKU: ordSku,
          Product_Name: `${matchedProduct.Product_Name} (${matchedProduct.Variant} - ${matchedProduct.Color})`,
          Qty: qtyVal,
          Price: priceVal,
          Total: qtyVal * priceVal
        }
      ]);
    }
    setOrdQty('1');
  };

  const handleRemoveProductFromStaging = (index: number) => {
    setTempOrderItems(prev => prev.filter((_, i) => i !== index));
  };

  // OMS Create New Order Submission
  const handleCreateOrderSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    // We can stage the currently selected item if tempOrderItems is empty
    let itemsToSubmit = [...tempOrderItems];
    if (itemsToSubmit.length === 0) {
      if (!ordSku) {
        alert("Tambahkan minimal 1 barang sebelum menyimpan order.");
        return;
      }
      const matchedProduct = products.find(p => p.SKU === ordSku);
      if (!matchedProduct) return;
      const qtyVal = Number(ordQty);
      const priceVal = ordPrice ? Number(ordPrice) : matchedProduct.Selling_Price;
      itemsToSubmit = [{
        SKU: ordSku,
        Product_Name: `${matchedProduct.Product_Name} (${matchedProduct.Variant} - ${matchedProduct.Color})`,
        Qty: qtyVal,
        Price: priceVal,
        Total: qtyVal * priceVal
      }];
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'CREATE',
          order: {
            Customer: ordCustomer,
            Channel: ordChannel,
            items: itemsToSubmit
          },
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      if (res.ok) {
        alert("Sales order created successfully!");
        setOrdQty('1');
        setOrdPrice('');
        setTempOrderItems([]);
        await fetchDatabaseState();
      } else {
        const err = await res.json();
        alert(`Order failed: ${err.error}`);
      }
    } catch (err) {
      alert("Connection failed.");
    }
  };

  // Update Sales Order Status Cycle (WMS Workflow)
  const handleUpdateOrderStatus = async (ordNum: string, nextStat: OrderStatus, customCarryObj?: any) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPDATE_STATUS',
          orderNumber: ordNum,
          order: {
            Status: nextStat,
            ...customCarryObj
          },
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      if (res.ok) {
        await fetchDatabaseState();
      } else {
        const err = await res.json();
        alert(`Workflow violation: ${err.error}`);
      }
    } catch (err) {
      alert("Connector error.");
    }
  };

  const handlePrintInvoice = (orderNumber: string) => {
    const relatedItems = orders.filter(item => item.Order_Number === orderNumber);
    if (relatedItems.length === 0) return;

    const rep = relatedItems[0];
    const totalSum = relatedItems.reduce((acc, item) => acc + item.Total, 0);
    const totalQty = relatedItems.reduce((acc, item) => acc + item.Qty, 0);
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const { path, width } = generateCode128SvgPath(orderNumber);
    const dateFormatted = new Date(rep.Order_Date).toLocaleString('id-ID', {
      year: 'numeric', month: 'long', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const itemsRowsHtml = relatedItems.map(item => `
      <div style="margin-bottom: 8px;">
        <div style="font-weight: bold; font-size: 11px;">${item.Product.toUpperCase()}</div>
        <div style="display: flex; justify-content: space-between; font-size: 10px; color: #555; font-family: monospace;">
          <span>${item.SKU} (${item.Qty} Pcs x Rp ${item.Price.toLocaleString()})</span>
          <span>Rp ${item.Total.toLocaleString()}</span>
        </div>
      </div>
    `).join('');

    printWindow.document.write(`
      <html>
        <head>
          <title>STRUK PENJUALAN - ${orderNumber}</title>
          <style>
            @media print {
              body { margin: 0; padding: 10px; width: 80mm; }
              @page { size: 80mm auto; margin: 0; }
            }
            body {
              font-family: 'Courier New', Courier, monospace;
              color: #000;
              background-color: #fff;
              width: 320px;
              margin: 0 auto;
              padding: 15px;
              box-sizing: border-box;
            }
            .header { text-align: center; margin-bottom: 12px; }
            .brand { font-size: 16px; font-weight: bold; letter-spacing: 1px; margin-bottom: 2px; }
            .subtitle { font-size: 9px; color: #444; line-height: 1.2; }
            .divider { border-top: 1px dashed #000; margin: 8px 0; }
            .meta-item { display: flex; justify-content: space-between; font-size: 10px; margin-bottom: 2px; }
            .meta-label { font-weight: bold; }
            .totals { font-size: 11px; font-family: monospace; }
            .total-row { display: flex; justify-content: space-between; margin-bottom: 3px; }
            .grand-total { font-size: 13px; font-weight: bold; border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 4px 0; margin-top: 4px; }
            .barcode-container { text-align: center; margin-top: 15px; margin-bottom: 5px; }
            .footer { text-align: center; font-size: 8px; margin-top: 15px; line-height: 1.3; }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          <div class="header">
            <div class="brand">ALINA OFFICIAL</div>
            <div class="subtitle">Depok</div>
            <div class="subtitle">08979888648</div>
            <div class="subtitle">@Alinaofficial.id</div>
          </div>
          
          <div class="divider"></div>
          
          <div class="meta-item">
            <span class="meta-label">NO ORDER:</span>
            <span style="font-weight: bold;">${orderNumber}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">TANGGAL:</span>
            <span>${dateFormatted}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">PELANGGAN:</span>
            <span>${rep.Customer}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">CHANNEL:</span>
            <span>${rep.Channel.toUpperCase()}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">ADMIN/KASIR:</span>
            <span>${currentUser ? currentUser.Full_Name : 'Administrator'}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">STATUS ORDER:</span>
            <span style="font-weight: bold;">[ ${rep.Status.toUpperCase()} ]</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="items-container">
            ${itemsRowsHtml}
          </div>
          
          <div class="divider"></div>
          
          <div class="totals">
            <div class="total-row">
              <span>TOTAL PRODUK:</span>
              <span>${totalQty} PCS</span>
            </div>
            <div class="total-row grand-total">
              <span>GRAND TOTAL:</span>
              <span>Rp ${totalSum.toLocaleString()}</span>
            </div>
          </div>
          
          <div class="barcode-container">
            <svg width="220" height="45" viewBox="0 0 ${width} 65" style="margin: 0 auto; display: block;">
              <path d="${path}" stroke="#000000" stroke-width="2" />
            </svg>
            <div style="font-size: 9px; font-weight: bold; margin-top: 4px; letter-spacing: 2px;">${orderNumber}</div>
          </div>
          
          <div class="footer">
            <div style="text-align: left; margin-bottom: 8px; padding-left: 10px;">
              <div style="font-weight: bold; font-size: 10px; margin-bottom: 4px;">Info Pembayaran Silakan transfer ke</div>
              <div style="font-size: 10px; font-family: monospace; line-height: 1.4;">
                BCA : 740 184 7590<br/>
                BRI : 117 00100 7704 500<br/>
                BSI : 562 852 9660 <br/>
                Mandiri : 101 000 5544 059<br/>
                <span style="font-weight: bold; display: block; margin-top: 4px;">An. Fina Mokoginta</span>
              </div>
            </div>
            <div style="font-weight: bold; font-size: 11px; margin-top: 10px;">Terima kasih banyak</div>
            <div style="margin-top: 8px; font-style: italic; font-size: 7px; color: #777;">Powered by ALINA Enterprise - OMS WMS Portal</div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  // Start Picking or Packing Verification station
  const handleOpenPackStation = (o: Order) => {
    setActivePackOrder(o);
    const relatedItems = orders.filter(item => item.Order_Number === o.Order_Number);
    
    const checklist: { [key: string]: boolean } = {};
    relatedItems.forEach(item => {
      checklist[`Verify SKU tag: ${item.SKU} (${item.Product})`] = false;
      checklist[`Confirm Quantity: ${item.Qty} pcs`] = false;
    });
    checklist[`Match Customer details: ${o.Customer}`] = false;
    checklist["Bubble Wrap & Polymailer wrapping complete"] = false;
    
    setPackChecklist(checklist);
  };

  const handleTogglePackItem = (key: string) => {
    setPackChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleConfirmPackCompleted = async () => {
    if (!activePackOrder) return;
    const isAllChecked = Object.values(packChecklist).every(val => val === true);
    if (!isAllChecked) {
      alert("Verify and check off all WMS verification lines before sealing package.");
      return;
    }

    // Move state to Ready To Ship
    await handleUpdateOrderStatus(activePackOrder.Order_Number, 'Ready To Ship');
    alert(`Order ${activePackOrder.Order_Number} packed and verified! Waiting courier pickup.`);
    setActivePackOrder(null);
  };

  // Shipping Assignment
  const handleAssignShippingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedShipOrder || !shipTracking) return;

    try {
      const res = await fetch('/api/shipping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'UPSERT',
          shipping: {
            Order_Number: selectedShipOrder,
            Courier: shipCourier,
            Tracking_Number: shipTracking,
            Status: shipStatus
          },
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      if (res.ok) {
        alert("Shipping courier status assigned successfully!");
        setSelectedShipOrder(null);
        setShipTracking('');
        await fetchDatabaseState();
      } else {
        const err = await res.json();
        alert(`Error: ${err.error}`);
      }
    } catch (err) {
      alert("Connection failure.");
    }
  };

  // Customer Management Save
  const handleSaveCustomerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCustomer || !editingCustomer.Customer_Name) return;

    try {
      const isNew = !editingCustomer.Customer_ID;
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isNew ? 'CREATE' : 'UPDATE',
          customer: editingCustomer,
          user: { name: currentUser?.Full_Name, role: currentUser?.Role },
          id: editingCustomer.Customer_ID
        })
      });

      if (res.ok) {
        alert(isNew ? "Customer added successfully!" : "Customer details updated.");
        setIsCustomerModalOpen(false);
        setEditingCustomer(null);
        await fetchDatabaseState();
      } else {
        alert("Failed to save Customer details.");
      }
    } catch (err) {
      alert("Connection failed.");
    }
  };

  const handleDeleteCustomer = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) return;
    try {
      const res = await fetch('/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE',
          id,
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      if (res.ok) {
        alert("Customer deleted successfully.");
        await fetchDatabaseState();
      }
    } catch (err) {
      alert("Failed to delete customer.");
    }
  };

  // Sheets Connector settings save
  const handleSaveSheetsConfig = async (cfg: { scriptUrl: string; spreadsheetId: string; autoSync: boolean; customLogoUrl?: string }): Promise<boolean> => {
    try {
      const res = await fetch('/api/settings/sheets-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...cfg,
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });
      if (res.ok) {
        safeLocalStorage.setItem('alina_sheets_config', JSON.stringify({ ...cfg, isLinked: !!(cfg.scriptUrl) }));
        await fetchDatabaseState();
        return true;
      } else {
        const err = await res.json();
        alert(err.error || "Gagal menyimpan konfigurasi Sheets.");
      }
    } catch (e) {
      console.error(e);
      alert("Koneksi gagal. Silahkan coba lagi.");
    }
    return false;
  };

  const handleSyncSheetsNow = async (): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await fetch('/api/settings/sync-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        await fetchDatabaseState();
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.error || "Gagal menyinkronkan data dengan Google Sheets." };
      }
    } catch (e) {
      console.error(e);
      return { success: false, message: "Koneksi ke server backend gagal atau tidak merespons." };
    }
  };

  // User Administration Save (Owner)
  const handleSaveUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser || !editingUser.Email || !editingUser.Full_Name) return;

    try {
      const isNew = !editingUser.User_ID;
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: isNew ? 'CREATE' : 'UPDATE',
          targetUser: editingUser,
          user: { name: currentUser?.Full_Name, role: currentUser?.Role },
          id: editingUser.User_ID
        })
      });

      if (res.ok) {
        alert(isNew ? "User account created!" : "User status updated.");
        setIsUserModalOpen(false);
        setEditingUser(null);
        await fetchDatabaseState();
      } else {
        const err = await res.json();
        alert(`Failed: ${err.error}`);
      }
    } catch (err) {
      alert("Connector error.");
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (id === 'USR-001') {
      alert("Primary owner account is protected from deletion.");
      return;
    }
    if (!window.confirm("Are you sure you want to dissolve this user credential?")) return;

    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'DELETE',
          id,
          user: { name: currentUser?.Full_Name, role: currentUser?.Role }
        })
      });

      if (res.ok) {
        alert("User deleted.");
        await fetchDatabaseState();
      }
    } catch (e) {
      alert("Delete failed.");
    }
  };

  // Format currency helper
  const formatIDR = (num: number) => {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID');
  };

  // Count metrics for general Dashboard indicators
  const totalStockAmount = products.reduce((sum, curr) => sum + (curr.Current_Stock || 0), 0);
  const totalSkuAmount = products.length;
  
  const todayStr = new Date().toISOString().slice(0, 10);
  const ordersTodayList = orders.filter(o => o.Order_Date.startsWith(todayStr));
  const ordersTodayCount = ordersTodayList.length;
  
  const ordersThisMonthCount = orders.filter(o => {
    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    return o.Order_Date.startsWith(currentMonth);
  }).length;

  const pendingOrdersCount = orders.filter(o => ['New Order', 'Processing', 'Picking'].includes(o.Status)).length;
  const packedOrdersCount = orders.filter(o => o.Status === 'Packing').length;
  const shippedOrdersCount = orders.filter(o => o.Status === 'Shipped').length;

  // Render Login UI if session doesn't exist
  if (!currentUser) {
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
                  <span className="text-[8px] font-bold text-[#EC4899] tracking-wider uppercase mt-0.5">Official</span>
                </div>
              </div>
            )}
            <span className="text-[10px] bg-[#FFF3F8] text-[#EC4899] font-black tracking-widest px-3 py-1 rounded-full border border-pink-100/60 uppercase">
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
                  className="w-full bg-[#FFF8FB] border border-pink-100 hover:border-pink-300 rounded-xl py-2 px-3 pl-9 focus:outline-none focus:border-pink-500 text-gray-900 transition"
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
                  className="w-full bg-[#FFF8FB] border border-pink-100 hover:border-pink-300 rounded-xl py-2 px-3 pl-9 focus:outline-none focus:border-pink-500 text-gray-900 transition"
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
                  className="w-3.5 h-3.5 rounded text-[#EC4899] focus:ring-pink-400"
                />
                Remember login context
              </label>
              
              <button 
                type="button"
                onClick={() => alert("Lupa password? Silakan hubungi akun OWNER utama (owner@alina.com) untuk mereset kredensial Anda.")}
                className="text-[#EC4899] hover:underline font-bold"
              >
                Lupa Password?
              </button>
            </div>

            {loginError && (
              <p className="text-red-500 font-bold text-[10px] text-center bg-red-50 py-2 rounded-xl">
                ⚠️ {loginError}
              </p>
            )}

            <button
              type="submit"
              id="login-submit-btn"
              className="w-full bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-3 px-4 rounded-xl cursor-pointer transition shadow-md border border-pink-400/20 tracking-wider text-xs uppercase"
            >
              Sign In to System
            </button>
          </form>



          <div className="text-center font-mono text-[9px] text-gray-400 flex items-center justify-center gap-1.5">
            ALINA MOSLEM FASHION SYSTEMS <Heart className="w-3 h-3 text-[#EC4899] fill-current" /> UTC-2026
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className={currentTheme.appBgGradient} data-theme={appTheme}>
      
      {/* Floating Minimalist Liquid Glass Header */}
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
                  <span className="text-[7px] font-black tracking-tighter bg-gradient-to-r from-[#EC4899] to-pink-400 bg-clip-text text-transparent leading-none">Alina</span>
                  <span className="text-[4px] font-bold text-[#EC4899] uppercase leading-none" style={{ fontSize: '4px' }}>Official</span>
                </div>
              </div>
            )}
            <div className="text-left">
              <h1 className="text-xs sm:text-sm font-extrabold text-gray-900 tracking-tight leading-none">{currentTheme.brandName}</h1>
              <p className={`text-[9px] ${currentTheme.text} font-black font-mono tracking-wider mt-0.5 uppercase`}>
                {currentUser?.Role} PORTAL {currentTheme.deco && <span className="inline-block animate-bounce">{currentTheme.deco}</span>}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right hidden md:block">
              <p className="text-xs font-bold text-gray-950">{currentUser?.Full_Name}</p>
              <p className="text-[9px] text-gray-400 font-mono select-none flex items-center gap-1 justify-end">
                <span className={`w-1.5 h-1.5 rounded-full inline-block bg-emerald-500`}></span>
                {currentTheme.petSpeech ? currentTheme.petSpeech : 'Koneksi Server Aktif'}
              </p>
            </div>
            
            <button
              onClick={handleLogoutAction}
              className={`${currentTheme.buttonSecondary} transition-all font-bold px-3 py-1.5 rounded-xl text-[10px] sm:text-xs flex items-center gap-1.5 cursor-pointer`}
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container body */}
      <div className="max-w-7xl mx-auto px-4 pt-6 sm:px-6 lg:px-8 space-y-6 min-h-[640px]">
        
        {/* Visual Glassmorphic Branding Banner - Only displayed under the Header when the active Tab is Dashboard */}
        {activeTab === 'dashboard' && (
          <div className={`${currentTheme.bannerGradient} text-white p-6 rounded-[32px] shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden text-left shadow-md`}>
            <div className="space-y-2 max-w-xl z-10">
              <span className={`text-[10px] ${currentTheme.bannerText} px-3 py-1 rounded-full font-bold uppercase tracking-wider`}>
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
        )}

        {/* Persistent Grid Menu Navigasi - Rendered only when activeTab is dashboard */}
        {activeTab === 'dashboard' ? (
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
        ) : (
          /* Sleek Minimalist Glass-infused back button when inside nested sub-menus */
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
        )}

        {/* Dynamic Islander Header Warning bar */}
        {restockAlertsCount > 0 && activeTab === 'dashboard' && (
          <div className="bg-gradient-to-r from-red-500/10 via-amber-500/5 to-transparent border-l-4 border-red-500 p-4 rounded-r-2xl flex items-center justify-between text-xs my-3 animate-pulse">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-500" />
              <div>
                <p className="font-bold text-gray-900">RESTOCK FORECAST ALERT REQUIRED</p>
                <p className="text-gray-500 font-mono text-[10px]">{restockAlertsCount} SKU diprediksi habis dalam 14 hari kedepan!</p>
              </div>
            </div>
            {hasPermission('reports') && (
              <button 
                onClick={() => setActiveTab('reports')} 
                className="bg-red-500 text-white font-bold px-3 py-1.5 rounded-xl hover:bg-red-600 cursor-pointer"
              >
                Lihat Forecast &rarr;
              </button>
            )}
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            
            {/* 1. DASHBOARD VIEW */}
            {activeTab === 'dashboard' && hasPermission('dashboard') && (
              <div className="space-y-6">
                
                {/* Operations KPIs Standard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white border border-pink-100/60 p-4 rounded-[24px] shadow-sm flex flex-col justify-between text-left">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">Total Stock Pcs</p>
                    <h3 className="text-lg font-extrabold text-gray-900 font-mono mt-1">{totalStockAmount.toLocaleString()} <span className="text-xs font-sans text-gray-400">Pcs</span></h3>
                    <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full mt-2 w-fit">Sehat</span>
                  </div>

                  <div className="bg-white border border-pink-100/60 p-4 rounded-[24px] shadow-sm flex flex-col justify-between text-left">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">Sku Terdaftar</p>
                    <h3 className="text-lg font-extrabold text-gray-900 font-mono mt-1">{totalSkuAmount} <span className="text-xs font-sans text-gray-400">SKU</span></h3>
                    <span className="text-[9px] bg-pink-100 text-[#EC4899] font-bold px-2 py-0.5 rounded-full mt-2 w-fit">Alina Mode</span>
                  </div>

                  <div className="bg-white border border-pink-100/60 p-4 rounded-[24px] shadow-sm flex flex-col justify-between text-left">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">Orders Today</p>
                    <h3 className="text-lg font-extrabold text-pink-600 font-mono mt-1">{ordersTodayCount} <span className="text-xs font-sans text-gray-400">Trx</span></h3>
                    <span className="text-[9px] bg-pink-50 text-[#EC4899] font-bold px-2 py-0.5 rounded-full mt-2 w-fit">Live</span>
                  </div>

                  <div className="bg-white border border-pink-100/60 p-4 rounded-[24px] shadow-sm flex flex-col justify-between text-left">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">Fulfillment Status</p>
                    <div className="flex gap-1.5 text-[10px] font-bold mt-1 text-gray-800">
                      <span className="bg-amber-100/60 px-1 rounded">Pnd: {pendingOrdersCount}</span>
                      <span className="bg-emerald-100/60 px-1 rounded">Pck: {packedOrdersCount}</span>
                      <span className="bg-indigo-100/60 px-1 rounded">Trs: {shippedOrdersCount}</span>
                    </div>
                    <span className="text-[9px] text-gray-400 mt-2 block font-mono">This month total: {ordersThisMonthCount}</span>
                  </div>
                </div>

                {/* Secure OWNER view triggers */}
                {currentUser.Role === 'OWNER' ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="bg-pink-100 text-[#EC4899] text-[9px] font-black px-3 py-1 rounded-full uppercase">Secure Owner Financial Panel</span>
                      <p className="text-xs text-gray-400">Privileged metrics shown only to roles designated OWNER.</p>
                    </div>
                    <OwnerFinancials 
                      productsList={products} 
                      ordersList={orders} 
                      customersList={customers} 
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 text-gray-500 p-5 rounded-3xl text-xs text-center">
                    🔒 Panel finansial harga modal, COGS, profit kotor, dan rasio margin disembunyikan untuk akun role Admin. Hubungi Owner untuk otorisasi akses finansial penuh.
                  </div>
                )}

                {/* Critical restock & recent activity lists split */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* Stock Alert list */}
                  <div className="bg-white border border-pink-100 p-5 rounded-[32px] text-left space-y-3">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4 text-[#EC4899]" /> ⚠️ ALINA STOCK ALERTS (Critical Levels)
                    </h4>
                    
                    <div className="divide-y divide-pink-50 max-h-56 overflow-y-auto">
                      {products.filter(p => p.Current_Stock <= p.Minimum_Stock).map((p, pIdx) => (
                        <div key={p.SKU || `warn-prod-${pIdx}`} className="py-2.5 flex justify-between items-center text-xs">
                          <div>
                            <p className="font-bold text-gray-900">{p.Product_Name}</p>
                            <p className="text-[10px] font-mono text-gray-400">SKU: {p.SKU} | Kategori: {p.Category}</p>
                          </div>
                          <div className="text-right">
                            <span className="bg-red-50 text-red-600 font-extrabold px-2.5 py-0.5 rounded-full block text-[10px]">
                              {p.Current_Stock} Pcs Left
                            </span>
                            <span className="text-[9px] text-gray-400">Threshold: {p.Minimum_Stock} Pcs</span>
                          </div>
                        </div>
                      ))}

                      {products.filter(p => p.Current_Stock <= p.Minimum_Stock).length === 0 && (
                        <p className="text-xs text-gray-400 text-center py-6">Kondisi stok healty. Tidak ada produk di bawah threshold minimum.</p>
                      )}
                    </div>
                  </div>

                  {/* Operational Guide list */}
                  <div className="bg-[#FFF8FB] border border-pink-100 p-5 rounded-[32px] text-left flex flex-col justify-between">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-pink-700 mb-2">💡 OPERATIONAL INTEGRATION CHECKLIST</h4>
                    <div className="space-y-3 text-xs leading-relaxed text-gray-600">
                      <p>WMS/OMS Alina siap digunakan untuk operasional terpadu:</p>
                      <ul className="list-disc pl-5 space-y-1 text-gray-500 font-medium">
                        <li>Fungsi <strong className="text-[#EC4899]">QR Code</strong> otomatis dibuat per produk. Unduh dan tempel d tag baju.</li>
                        <li>Gunakan modul <strong className="text-[#EC4899]">Picking & Packing</strong> saat memproses pesanan untuk memverifikasi akurasi isi barang menggunakan laser terminal HP.</li>
                        <li>Simpan <strong className="text-[#EC4899]">Stock Opname bulanan</strong> pada tanggal akhir untuk menjaga konsistensi selisih stok fisik & sistem.</li>
                        <li>Masukkan Spreadsheet ID Anda pada tab <strong className="text-[#EC4899]">Sheets Connector</strong> untuk menyinkronkan data.</li>
                      </ul>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 2. PRODUCT MASTER VIEW */}
            {activeTab === 'products' && hasPermission('products') && (
              <ProductForm
                productsList={products}
                currentUser={currentUser}
                onSaveProduct={handleSaveProduct}
                onDeleteProduct={handleDeleteProduct}
                onImportProducts={handleImportProducts}
                categoryList={categoryList}
              />
            )}

            {/* 3. CUSTOMER VIEW */}
            {activeTab === 'customers' && hasPermission('customers') && (
              <div className="space-y-6 text-left">
                
                {/* Search / Controls */}
                <div className="flex justify-between items-center bg-white p-4 rounded-[24px] border border-pink-100 shadow-sm">
                  <h3 className="font-bold text-sm tracking-tight text-gray-900 uppercase">Customer Master Database</h3>
                  <button
                    onClick={() => {
                      setEditingCustomer({
                        Customer_Name: '',
                        Customer_Type: 'Reseller',
                        Phone: '',
                        Email: '',
                        Address: '',
                        City: '',
                        Status: 'Active'
                      });
                      setIsCustomerModalOpen(true);
                    }}
                    className="bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Tambah Customer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customers.map((c, idx) => (
                    <div 
                      key={`${c.Customer_ID}-${idx}`}
                      className="bg-white border border-pink-100 p-5 rounded-[24px] shadow-sm hover:border-pink-300 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-extrabold text-sm text-gray-900 leading-tight">{c.Customer_Name}</h4>
                            <span className="text-[10px] uppercase font-bold text-pink-500 font-mono tracking-wider">{c.Customer_ID}</span>
                          </div>
                          
                          <span className={`inline-block text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full ${
                            c.Customer_Type === 'Shopee' || c.Customer_Type === 'TikTok & Tokopedia'
                              ? 'bg-orange-50 text-orange-600'
                              : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {c.Customer_Type}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-gray-500 font-medium">
                          <p>📱 PHONE: {c.Phone}</p>
                          <p>✉ EMAIL: {c.Email}</p>
                          <p>📍 ALAMAT: {c.Address}, {c.City}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-pink-50 pt-3 mt-4 justify-end">
                        <button
                          onClick={() => {
                            setEditingCustomer(c);
                            setIsCustomerModalOpen(true);
                          }}
                          className="text-xs font-semibold text-gray-700 hover:text-black hover:underline cursor-pointer"
                        >
                          Edit Details
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCustomer(c.Customer_ID)}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* 4. STOCK IN & OUT (WMS TRANSACTION) */}
            {activeTab === 'inventory' && hasPermission('inventory') && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left items-start">
                
                {/* Log list */}
                <div className="lg:col-span-12 bg-[#FFF8FB] p-5 rounded-[32px] border border-pink-100 mb-2">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-gray-900 tracking-tight">TRANSAKSI BARANG MASUK / KELUAR</h3>
                      <p className="text-xs text-gray-500">Scan Barcode / QR Label tag pakaian secara realtime untuk memperbarui jumlah persediaan gudang Alina.</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setSelectedTrxType('IN');
                          triggerCameraScanner("Penerimaan Stock In", (scanned) => {
                            setTrxSku(scanned);
                            setActiveTab('inventory');
                          });
                        }}
                        className="bg-emerald-500 font-bold py-2 px-4 rounded-xl text-xs text-white hover:bg-emerald-600 cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Barcode className="w-4 h-4" /> Scan Stock In
                      </button>

                      <button
                        onClick={() => {
                          setSelectedTrxType('OUT');
                          triggerCameraScanner("Pengeluaran Stock Out", (scanned) => {
                            setTrxSku(scanned);
                            setActiveTab('inventory');
                          });
                        }}
                        className="bg-red-500 font-bold py-2 px-4 rounded-xl text-xs text-white hover:bg-red-600 cursor-pointer flex items-center gap-1 shadow-sm"
                      >
                        <Barcode className="w-4 h-4" /> Scan Stock Out
                      </button>
                    </div>
                  </div>
                </div>

                {/* New Trx Panel */}
                <div className="lg:col-span-5 bg-white border border-pink-100 p-6 rounded-[32px] shadow-sm space-y-4">
                  <h3 className="font-bold text-xs uppercase tracking-wider text-pink-700 pb-2 border-b border-pink-50">Log Form Transaksi Gudang</h3>
                  
                  <div className="grid grid-cols-2 gap-2 p-1 bg-[#FFF3F8] rounded-xl border border-pink-100/60 font-semibold select-none text-xs">
                    <button
                      onClick={() => setSelectedTrxType('IN')}
                      className={`py-2 px-3 rounded-lg text-center cursor-pointer ${
                        selectedTrxType === 'IN' ? 'bg-[#EC4899] text-white' : 'text-gray-500 hover:text-pink-600'
                      }`}
                    >
                      STOCK IN (Barang Masuk)
                    </button>
                    <button
                      onClick={() => setSelectedTrxType('OUT')}
                      className={`py-2 px-3 rounded-lg text-center cursor-pointer ${
                        selectedTrxType === 'OUT' ? 'bg-red-500 text-white' : 'text-gray-500 hover:text-red-600'
                      }`}
                    >
                      STOCK OUT (Barang Keluar)
                    </button>
                  </div>

                  <form onSubmit={handleRecordStockTrxSubmit} className="space-y-4 text-xs font-medium text-gray-700">
                    <div className="bg-[#FFF8FB] p-3 rounded-2xl border border-pink-50 relative space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="font-bold uppercase text-[10px] text-gray-500">Pilih Kode SKU (Barang)</label>
                        <button
                          type="button"
                          onClick={() => triggerCameraScanner("Muted Sku Reader", (sku) => {
                            setTrxSku(sku);
                            setActiveTab('inventory');
                          })}
                          className="text-[#EC4899] font-bold text-[10px] hover:underline"
                        >
                          Scan Barcode HP
                        </button>
                      </div>
                      
                      {/* Custom dropdown selector with 3 rows per item */}
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setStockSkuDropdownOpen(!stockSkuDropdownOpen)}
                          className="w-full bg-white border border-pink-100 rounded-xl py-2.5 px-3 text-left focus:outline-none flex justify-between items-center hover:border-pink-300 transition shadow-sm"
                        >
                          {trxSku ? (
                            (() => {
                              const p = products.find(prod => prod.SKU === trxSku);
                              if (p) {
                                return (
                                  <div className="space-y-0.5 pointer-events-none">
                                    <div className="flex items-center gap-2">
                                      <span className="font-mono font-black text-gray-900 text-xs tracking-wide">{p.SKU}</span>
                                      <span className="bg-pink-100 text-[#EC4899] font-bold px-1.5 py-0.2 rounded text-[9px]">Sisa: {p.Current_Stock} Pcs</span>
                                    </div>
                                    <div className="font-bold text-gray-700 text-xs">{p.Product_Name}</div>
                                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Warna: {p.Color}</div>
                                  </div>
                                );
                              }
                              return <span className="text-gray-500 font-bold text-xs">{trxSku}</span>;
                            })()
                          ) : (
                            <span className="text-gray-400 font-bold text-xs">-- PILIH KELOMPOK BARANG --</span>
                          )}
                          <span className="text-[#EC4899] text-xs">▼</span>
                        </button>

                        {/* Hidden Input to trigger HTML validation if required and not selected */}
                        <input 
                          type="hidden" 
                          required 
                          value={trxSku} 
                          onChange={() => {}} 
                        />

                        {stockSkuDropdownOpen && (
                          <>
                            {/* Backdrop to close the dropdown */}
                            <div 
                              className="fixed inset-0 z-10" 
                              onClick={() => {
                                setStockSkuDropdownOpen(false);
                                setStockSkuSearch('');
                              }} 
                            />
                            
                            {/* Dropdown Container */}
                            <div className="absolute left-0 right-0 mt-1.5 bg-white border border-pink-100 rounded-2xl shadow-xl z-20 overflow-hidden max-h-80 flex flex-col">
                              {/* Search Input Box */}
                              <div className="p-2 bg-pink-50/50 border-b border-pink-100/50 z-20">
                                <input
                                  type="text"
                                  placeholder="Cari SKU, Nama atau Warna..."
                                  value={stockSkuSearch}
                                  onChange={(e) => setStockSkuSearch(e.target.value)}
                                  className="w-full bg-white border border-pink-100 rounded-lg py-1.5 px-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-pink-400 placeholder-gray-400 font-medium"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>

                              {/* Scrollable list content */}
                              <div className="overflow-y-auto flex-1 max-h-60 z-20">
                                {(() => {
                                  const filtered = products.filter(p => !stockSkuSearch || 
                                    p.SKU.toLowerCase().includes(stockSkuSearch.toLowerCase()) ||
                                    p.Product_Name.toLowerCase().includes(stockSkuSearch.toLowerCase()) ||
                                    p.Color.toLowerCase().includes(stockSkuSearch.toLowerCase()) ||
                                    p.Variant.toLowerCase().includes(stockSkuSearch.toLowerCase())
                                  );

                                  if (filtered.length === 0) {
                                    return (
                                      <div className="p-4 text-center text-gray-400 text-xs font-bold bg-[#FAF9FB]">
                                        Data SKU tidak ditemukan
                                      </div>
                                    );
                                  }

                                  return filtered.map((p, idx) => {
                                    const isSelected = trxSku === p.SKU;
                                    return (
                                      <button
                                        key={`${p.SKU}-${idx}`}
                                        type="button"
                                        onClick={() => {
                                          setTrxSku(p.SKU);
                                          setStockSkuDropdownOpen(false);
                                          setStockSkuSearch('');
                                        }}
                                        className={`w-full text-left p-3 border-b border-pink-50/50 hover:bg-pink-50/70 transition flex flex-col gap-1 ${
                                          isSelected ? 'bg-pink-50/40 border-l-4 border-pink-500' : ''
                                        }`}
                                      >
                                        {/* Baris Pertama: Kode SKU */}
                                        <div className="flex justify-between items-center">
                                          <span className="font-mono font-black text-gray-900 text-xs tracking-wide">
                                            {p.SKU}
                                          </span>
                                          <span className="bg-pink-100 text-[#EC4899] font-bold px-2 py-0.5 rounded text-[10px] font-sans">
                                            Sisa: {p.Current_Stock} Pcs
                                          </span>
                                        </div>

                                        {/* Baris Kedua: Nama Produk + Variant */}
                                        <div className="text-gray-800 text-xs font-bold leading-snug">
                                          {p.Product_Name}
                                        </div>

                                        {/* Baris Ketiga: Warna */}
                                        <div className="flex items-center gap-2 text-gray-500 text-[10px] font-medium tracking-wide">
                                          <span 
                                            className="w-2.5 h-2.5 rounded-full border border-gray-300 shadow-sm"
                                            style={{ backgroundColor: getColorsByCategory(p.Category).find(c => c.name === p.Color)?.hex || '#D1D5DB' }}
                                          />
                                          <span>Warna: <strong className="text-gray-700">{p.Color}</strong></span>
                                        </div>
                                      </button>
                                    );
                                  });
                                })()}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    {selectedTrxType === 'OUT' && (
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600">Alokasikan untuk Pelanggan</label>
                        <select
                          required
                          value={trxCustomer}
                          onChange={(e) => setTrxCustomer(e.target.value)}
                          className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
                        >
                          {customers.map((c, idx) => (
                            <option key={`${c.Customer_ID}-${idx}`} value={c.Customer_Name}>{c.Customer_Name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {selectedTrxType === 'OUT' && (
                      <div className="grid grid-cols-2 gap-3 p-3 bg-red-50/50 rounded-2xl border border-red-100/40">
                        <div className="space-y-1">
                          <label className="font-extrabold text-red-700 uppercase tracking-wider text-[10px] block mb-1">Tujuan Barang Keluar</label>
                          <select
                            value={trxDestination}
                            onChange={(e) => setTrxDestination(e.target.value as any)}
                            className="w-full bg-white border border-pink-100 rounded-xl py-1.5 px-2 focus:outline-none text-[10px] font-bold"
                          >
                            <option value="Sales">Sales (Kirim ke Customer)</option>
                            <option value="Return to Konveksi">Return to Konveksi (Retur Reject/Sisa)</option>
                            <option value="Reject Disposal">Reject Disposal (Afkir/Dibuang)</option>
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-extrabold text-red-700 uppercase tracking-wider text-[10px] block mb-1">Kondisi Barang</label>
                          <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-red-100/40">
                            <button
                              type="button"
                              onClick={() => setTrxOutQuality('Good')}
                              className={`py-1.5 text-center rounded-lg text-[10px] font-bold cursor-pointer transition ${
                                trxOutQuality === 'Good' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-500 hover:text-emerald-500'
                              }`}
                            >
                              Bagus
                            </button>
                            <button
                              type="button"
                              onClick={() => setTrxOutQuality('Reject')}
                              className={`py-1.5 text-center rounded-lg text-[10px] font-bold cursor-pointer transition ${
                                trxOutQuality === 'Reject' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-500 hover:text-amber-600'
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    {selectedTrxType === 'IN' && (
                      <div className="grid grid-cols-2 gap-3 p-3 bg-pink-50/50 rounded-2xl border border-pink-100/60">
                        <div className="space-y-1">
                          <label className="font-extrabold text-pink-700 uppercase tracking-wider text-[10px] block mb-1">Asal Barang</label>
                          <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-pink-100">
                            <button
                              type="button"
                              onClick={() => setTrxSource('Konveksi')}
                              className={`py-1.5 text-center rounded-lg text-[10px] font-bold cursor-pointer transition ${
                                trxSource === 'Konveksi' ? 'bg-[#EC4899] text-white shadow-sm' : 'text-gray-500 hover:text-pink-600'
                              }`}
                            >
                              Konveksi
                            </button>
                            <button
                              type="button"
                              onClick={() => setTrxSource('Return')}
                              className={`py-1.5 text-center rounded-lg text-[10px] font-bold cursor-pointer transition ${
                                trxSource === 'Return' ? 'bg-[#EC4899] text-white shadow-sm' : 'text-gray-500 hover:text-pink-600'
                              }`}
                            >
                              Return
                            </button>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="font-extrabold text-pink-700 uppercase tracking-wider text-[10px] block mb-1">Kondisi Barang</label>
                          <div className="grid grid-cols-2 gap-1 bg-white p-1 rounded-xl border border-pink-100">
                            <button
                              type="button"
                              onClick={() => setTrxQuality('Good')}
                              className={`py-1.5 text-center rounded-lg text-[10px] font-bold cursor-pointer transition ${
                                trxQuality === 'Good' ? 'bg-emerald-500 text-white shadow-sm' : 'text-gray-500 hover:text-emerald-500'
                              }`}
                            >
                              Bagus
                            </button>
                            <button
                              type="button"
                              onClick={() => setTrxQuality('Reject')}
                              className={`py-1.5 text-center rounded-lg text-[10px] font-bold cursor-pointer transition ${
                                trxQuality === 'Reject' ? 'bg-amber-600 text-white shadow-sm' : 'text-gray-500 hover:text-amber-600'
                              }`}
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-bold text-gray-600">Jumlah Qty (Pcs)</label>
                        <input
                          type="number"
                          required
                          placeholder="e.g. 50"
                          value={trxQty}
                          onChange={(e) => setTrxQty(e.target.value)}
                          className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-600">Tanggal Operasional</label>
                        <input
                          type="text"
                          disabled
                          value={new Date().toLocaleDateString('id-ID')}
                          className="w-full bg-gray-100 border border-transparent rounded-xl py-2 px-3 outline-none text-gray-400 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="font-bold text-gray-600">Catatan Audit (Notes)</label>
                      <input
                        type="text"
                        placeholder="e.g. Kiriman Konveksi Pekalongan, Order IG #2281"
                        value={trxNotes}
                        onChange={(e) => setTrxNotes(e.target.value)}
                        className="w-full bg-white border border-pink-100 rounded-xl py-2.5 px-3 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className={`w-full text-white font-bold py-3 px-4 rounded-xl cursor-pointer transition shadow-md ${
                        selectedTrxType === 'IN' ? 'bg-[#EC4899] hover:bg-[#D93B84]' : 'bg-red-500 hover:bg-red-650'
                      }`}
                    >
                      Kirim Laporan {selectedTrxType === 'IN' ? 'Barang Masuk' : 'Barang Keluar'}
                    </button>
                  </form>
                </div>

                {/* Trx History Log Tables */}
                <div className="lg:col-span-7 bg-white border border-pink-100 rounded-[32px] p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-pink-50">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">Audit Transaksi Masuk</h3>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{stockIn.length} entries</span>
                  </div>

                  <div className="overflow-x-auto max-h-56">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-pink-50 font-mono text-gray-400 uppercase tracking-widest text-[10px]">
                          <th className="py-2 px-1">ID / Waktu</th>
                          <th className="py-2 px-1">Produk SKU</th>
                          <th className="py-2 px-1 text-center">Qty</th>
                          <th className="py-2 px-1">Atribusi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-pink-50/50">
                        {stockIn.map((item, idxx) => (
                          <tr key={item.Transaction_ID || `stkin-${idxx}`} className="hover:bg-[#FFF8FB] text-gray-700">
                            <td className="py-2.5 px-1 font-mono text-[9px] text-[#EC4899]">
                              <strong>{item.Transaction_ID}</strong>
                              <div>{new Date(item.Date).toLocaleDateString()}</div>
                            </td>
                            <td className="py-2.5 px-1 font-medium">{item.Product_Name} <span className="font-mono text-gray-400">({item.SKU})</span></td>
                            <td className="py-2.5 px-1 text-center text-emerald-600 font-extrabold font-mono font-bold">+{item.Qty}</td>
                            <td className="py-2.5 px-1">
                              <div className="flex flex-wrap gap-1 items-center mb-1">
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-pink-100 text-pink-700 border border-pink-200">
                                  {item.Source_Type || 'Konveksi'}
                                </span>
                                {item.Quality_Type === 'Reject' ? (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200" title="Stok reject tidak dimasukkan ke dalam stok jual">
                                    🔴 Reject / Cacat (Stok Tidak Bertambah)
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    🟢 Bagus (Good Stock)
                                  </span>
                                )}
                              </div>
                              <span className="text-gray-500 italic text-[10px] block">{item.Notes || '-'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-between items-center pb-2 border-b border-pink-50 pt-3">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-gray-700">Audit Transaksi Keluar</h3>
                    <span className="text-[10px] font-mono text-gray-400 font-bold">{stockOut.length} entries</span>
                  </div>

                  <div className="overflow-x-auto max-h-56">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-pink-50 font-mono text-gray-400 uppercase tracking-widest text-[10px]">
                          <th className="py-2 px-1">ID / Waktu</th>
                          <th className="py-2 px-1">Atas SKU</th>
                          <th className="py-2 px-1 text-center">Qty</th>
                          <th className="py-2 px-1">Tujuan & Atribusi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-pink-50/50">
                        {stockOut.map((item, idxx) => (
                          <tr key={item.Transaction_ID || `stkout-${idxx}`} className="hover:bg-[#FFF8FB] text-gray-700">
                            <td className="py-2.5 px-1 font-mono text-[9px] text-red-500">
                              <strong>{item.Transaction_ID}</strong>
                              <div>{new Date(item.Date).toLocaleDateString()}</div>
                            </td>
                            <td className="py-2.5 px-1 font-medium">{item.Product_Name} <span className="font-mono text-gray-400">({item.SKU})</span></td>
                            <td className="py-2.5 px-1 text-center text-red-600 font-extrabold font-mono font-semibold">-{item.Qty}</td>
                            <td className="py-2.5 px-1">
                              <div className="font-bold text-gray-800 text-[11px] mb-0.5">{item.Customer}</div>
                              <div className="flex flex-wrap gap-1 items-center mb-1">
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-red-100 text-red-700 border border-red-200">
                                  {item.Destination_Type || 'Sales'}
                                </span>
                                {item.Quality_Type === 'Reject' ? (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                                    🔴 Reject / Cacat
                                  </span>
                                ) : (
                                  <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                                    🟢 Bagus (Good Stock)
                                  </span>
                                )}
                              </div>
                              <span className="text-gray-500 italic text-[10px] block">{item.Notes || '-'}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            )}

            {/* 5. MONTHLY STOCK OPNAME VIEW */}
            {activeTab === 'opname' && hasPermission('opname') && (
              <div className="space-y-6 text-left">
                
                {/* Headers configuration */}
                <div className="bg-[#FFF8FB] p-5 rounded-[32px] border border-pink-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="space-y-1">
                    <h3 className="font-black text-lg tracking-tight text-gray-900">STOCK OPNAME BULANAN ALINA GUDAK</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      Lakukan rekonsiliasi berkala untuk mencocokkan jumlah stok fisik di rak dibandingkan stok sistem, dilengkapi report selisih otomatis.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 bg-white p-2.5 rounded-2xl border border-pink-100 shadow-sm font-semibold select-none text-xs">
                    <span className="text-gray-500 block">Bulan Aktif Opname:</span>
                    <select
                      value={activeStockOpnameMonth}
                      onChange={(e) => setActiveStockOpnameMonth(e.target.value)}
                      className="bg-pink-50 text-[#EC4899] font-bold py-1 px-3.5 rounded-lg outline-none cursor-pointer text-xs"
                    >
                      <option value="Januari 2026">Januari 2026</option>
                      <option value="Februari 2026">Februari 2026</option>
                      <option value="Maret 2026">Maret 2026</option>
                      <option value="April 2026">April 2026</option>
                      <option value="Mei 2026">Mei 2026</option>
                      <option value="Juni 2026">Juni 2026</option>
                    </select>
                  </div>
                </div>

                {/* Main comparison matrix */}
                <div className="bg-white rounded-[32px] border border-pink-100 p-5 shadow-sm space-y-4">
                  <div className="flex justify-between items-center border-b border-pink-50 pb-2">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">Rekonsiliasi Bulan: {activeStockOpnameMonth}</h4>
                    <span className="text-[10px] text-gray-400 font-mono font-bold">Wajib verifikasi per SKU</span>
                  </div>

                  {/* Responsive Dual View for Stock Opname to prevent horizontal scrolling on mobile */}
                  <div>
                    {/* 1. DESKTOP VIEW: TABLE LAYOUT FOR md SCREEN OR HIGHER */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-pink-50 font-mono text-gray-400 uppercase tracking-widest text-[10px]">
                            <th className="py-2.5 px-2">Identitas Item / SKU</th>
                            <th className="py-2.5 px-2 text-center">Stok Sistem</th>
                            <th className="py-2.5 px-2 text-center">Jumlah Hitung Fisik (Physical)</th>
                            <th className="py-2.5 px-3 text-center">Selisih (Diff)</th>
                            <th className="py-2.5 px-2 text-right">Aksi Audit</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-pink-50/50">
                          {products.map((p, idxP) => {
                            const userVal = opnameQuantities[p.SKU] !== undefined ? opnameQuantities[p.SKU] : '';
                            
                            // Check if historically did opname for this Month
                            const historicalRecord = stockOpname.find(
                              o => o.SKU === p.SKU && o.Month === activeStockOpnameMonth
                            );

                            const hasRecorded = !!historicalRecord;
                            const currentSystemStock = p.Current_Stock || 0;
                            
                            // Display discrepancy status color
                            let displayDiff = "0";
                            let colorClass = "bg-emerald-50 text-emerald-600 font-bold border border-emerald-200";
                            let tagText = "MATCH";

                            if (hasRecorded) {
                              const diff = historicalRecord.Difference;
                              displayDiff = diff >= 0 ? `+${diff}` : `${diff}`;
                              if (diff > 0) {
                                colorClass = "bg-amber-100 text-amber-700 font-bold border border-amber-300";
                                tagText = "PLUS";
                              } else if (diff < 0) {
                                colorClass = "bg-red-50 text-red-600 font-extrabold border border-red-200 animate-pulse";
                                tagText = "MINUS";
                              }
                            }

                            return (
                              <tr key={p.SKU || `opn-${idxP}`} className="hover:bg-[#FFF8FB] text-gray-750 font-medium">
                                <td className="py-3 px-2">
                                  <div className="font-bold text-gray-900">{p.Product_Name}</div>
                                  <div className="text-[10px] font-mono text-[#EC4899]">{p.SKU}</div>
                                </td>
                                <td className="py-3 px-2 text-center font-mono font-bold text-gray-900">
                                  {currentSystemStock} Pcs
                                </td>
                                <td className="py-3 px-2 text-center">
                                  {hasRecorded ? (
                                    <span className="font-mono text-gray-800 font-bold bg-gray-50 border border-gray-200 py-1.5 px-3.5 rounded-lg inline-block">
                                      {historicalRecord.Physical_Stock} Pcs
                                    </span>
                                  ) : (
                                    <input
                                      type="number"
                                      placeholder="Enter count..."
                                      value={userVal}
                                      onChange={(e) => setOpnameQuantities(prev => ({ ...prev, [p.SKU]: e.target.value }))}
                                      className="w-24 bg-[#FFF8FB] border border-pink-100 rounded-lg py-1 px-2.5 outline-none font-mono text-center font-bold text-gray-900"
                                    />
                                  )}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  {hasRecorded ? (
                                    <span className={`inline-block py-1.5 px-4 rounded-xl text-[10px] font-bold ${colorClass}`}>
                                      {tagText}: {displayDiff} Pcs
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 italic">Unprocessed</span>
                                  )}
                                </td>
                                <td className="py-3 px-2 text-right">
                                  {hasRecorded ? (
                                    <span className="text-[10px] text-gray-400 font-mono">Recorded {new Date(historicalRecord.Date).toLocaleDateString()}</span>
                                  ) : (
                                    <button
                                      onClick={() => handleSaveOpnameSubmit(p.SKU, userVal)}
                                      className="bg-[#111827] hover:bg-black text-white font-semibold py-1 px-3 rounded-lg text-[10px] transition cursor-pointer"
                                    >
                                      Post Count &rarr;
                                    </button>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* 2. MOBILE VIEW: CARDS THAT DO NOT STRETCH OR NEED SCROLLING */}
                    <div className="block md:hidden space-y-4">
                      {products.map((p, idxP) => {
                        const userVal = opnameQuantities[p.SKU] !== undefined ? opnameQuantities[p.SKU] : '';
                        
                        // Check if historically did opname for this Month
                        const historicalRecord = stockOpname.find(
                          o => o.SKU === p.SKU && o.Month === activeStockOpnameMonth
                        );

                        const hasRecorded = !!historicalRecord;
                        const currentSystemStock = p.Current_Stock || 0;
                        
                        // Display discrepancy status color
                        let displayDiff = "0";
                        let colorClass = "bg-emerald-50 text-emerald-600 font-bold border border-emerald-200";
                        let tagText = "MATCH";

                        if (hasRecorded) {
                          const diff = historicalRecord.Difference;
                          displayDiff = diff >= 0 ? `+${diff}` : `${diff}`;
                          if (diff > 0) {
                            colorClass = "bg-amber-100 text-amber-700 font-bold border border-amber-300";
                            tagText = "PLUS";
                          } else if (diff < 0) {
                            colorClass = "bg-red-50 text-red-600 font-extrabold border border-red-200 animate-pulse";
                            tagText = "MINUS";
                          }
                        }

                        return (
                          <div key={`mobile-opname-${p.SKU || idxP}`} className="bg-white border border-pink-100 rounded-2xl p-4 space-y-3.5 shadow-sm hover:border-pink-300 transition duration-150 text-xs">
                            {/* Product Info */}
                            <div>
                              <div className="font-extrabold text-[#111827] text-sm leading-tight">{p.Product_Name}</div>
                              <div className="text-[10px] font-mono text-[#EC4899] font-bold mt-1">SKU: {p.SKU}</div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-pink-50/40">
                              <div className="p-2 bg-gray-50 rounded-xl space-y-0.5 border border-gray-100/60">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">Stok Sistem</span>
                                <div className="font-mono font-extrabold text-gray-900 text-xs">{currentSystemStock} Pcs</div>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-xl space-y-0.5 border border-gray-100/60">
                                <span className="text-[9px] font-bold text-gray-400 uppercase">Selisih (Diff)</span>
                                <div>
                                  {hasRecorded ? (
                                    <span className={`inline-block py-0.5 px-2 rounded-lg text-[9px] font-bold ${colorClass}`}>
                                      {tagText}: {displayDiff}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 italic text-[10px]">Belum diproses</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Count action bottom area */}
                            <div className="pt-2 border-t border-pink-50/30 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
                              <div>
                                <span className="text-[9px] font-bold text-gray-400 block mb-1 uppercase">Jumlah Hitung Fisik</span>
                                {hasRecorded ? (
                                  <span className="font-mono text-gray-800 font-black bg-gray-150 border border-gray-200 py-1.5 px-3 rounded-lg inline-block leading-none text-xs">
                                    {historicalRecord.Physical_Stock} Pcs
                                  </span>
                                ) : (
                                  <input
                                    type="number"
                                    placeholder="Isi stok fisik..."
                                    value={userVal}
                                    onChange={(e) => setOpnameQuantities(prev => ({ ...prev, [p.SKU]: e.target.value }))}
                                    className="w-full sm:w-32 bg-[#FFF8FB] border border-pink-200 rounded-lg py-1.5 px-3 outline-none font-mono font-bold text-gray-900 text-xs"
                                  />
                                )}
                              </div>

                              <div className="flex items-end justify-end">
                                {hasRecorded ? (
                                  <span className="text-[9px] text-gray-400 font-bold block text-right mt-1">
                                    ✓ Recorded {new Date(historicalRecord.Date).toLocaleDateString()}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleSaveOpnameSubmit(p.SKU, userVal)}
                                    className="w-full sm:w-auto bg-[#111827] hover:bg-black text-white font-black py-2 px-4 rounded-xl text-[10px] transition cursor-pointer uppercase tracking-wider text-center"
                                  >
                                    Post Count &rarr;
                                  </button>
                                )}
                              </div>
                            </div>

                          </div>
                        );
                      })}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 6. ORDER MANAGEMENT SYSTEM (OMS) */}
            {activeTab === 'orders' && hasPermission('orders') && (
              <div className="space-y-6 text-left">
                
                {/* Split operational screen: Create Order vs Listing */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Create Order Card */}
                  <div className="lg:col-span-4 bg-white border border-pink-100 p-6 rounded-[32px] shadow-sm space-y-4">
                    <h3 className="font-extrabold text-sm tracking-tight text-gray-900 uppercase">Input Penjualan Baru (Sales Order)</h3>
                    
                    <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs font-semibold text-gray-700">
                      <div className="space-y-1 block">
                        <label className="font-bold text-gray-600 block uppercase">Pilih Pelanggan Alina</label>
                        <select
                          required
                          value={ordCustomer}
                          onChange={(e) => setOrdCustomer(e.target.value)}
                          className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
                        >
                          {customers.map((c, idx) => (
                            <option key={`${c.Customer_ID}-${idx}`} value={c.Customer_Name}>
                              {c.Customer_Name} ({c.Customer_Type})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-600 block uppercase">Sales Channel Resmi</label>
                        <select
                          required
                          value={ordChannel}
                          onChange={(e) => setOrdChannel(e.target.value as any)}
                          className="w-full bg-white border border-pink-100 text-gray-700 rounded-xl py-2 px-3 focus:outline-none font-bold"
                        >
                          <option value="Reseller">Reseller</option>
                          <option value="Agen">Agen</option>
                          <option value="Marketer">Marketer</option>
                          <option value="Distributor">Distributor</option>
                          <option value="Ecer">Ecer</option>
                          <option value="Konsinyasi">Konsinyasi</option>
                          <option value="Retail IG">Retail IG</option>
                          <option value="Shopee">Shopee</option>
                          <option value="TikTok & Tokopedia">TikTok & Tokopedia</option>
                        </select>
                      </div>

                      {/* Brand Category, Size/Variant, and Color selectors */}
                      <div className="bg-[#FFF8FB] p-3 rounded-2xl border border-pink-50 space-y-3">
                        <div className="space-y-1">
                          <label className="font-bold text-gray-600 block uppercase">Pilihan Kategori (Stok Ready)</label>
                          <select
                            required
                            value={ordCategory}
                            onChange={(e) => setOrdCategory(e.target.value)}
                            className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none text-xs"
                          >
                            {availableCategories.map((cat, idx) => (
                              <option key={`${cat}-${idx}`} value={cat}>{cat}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-gray-600 block uppercase">Pilihan Size / Variant (Stok Ready)</label>
                          <select
                            required
                            value={ordVariant}
                            onChange={(e) => setOrdVariant(e.target.value)}
                            className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none text-xs"
                          >
                            {availableVariants.map((v, idx) => (
                              <option key={`${v}-${idx}`} value={v}>{v}</option>
                            ))}
                          </select>
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-gray-600 block uppercase">Pilihan Warna (Stok Ready)</label>
                          <div className="flex flex-wrap gap-1.5 py-1 max-h-24 overflow-y-auto">
                            {availableColorPresets.map((colorObj, idx) => {
                              const isSelected = ordColor === colorObj.name;
                              return (
                                <button
                                  key={`${colorObj.name}-${idx}`}
                                  type="button"
                                  onClick={() => setOrdColor(colorObj.name)}
                                  className={`flex items-center gap-1 px-2 py-1 rounded-full border text-[10px] font-bold transition ${
                                    isSelected 
                                      ? 'bg-pink-100 text-pink-700 border-pink-400 shadow-sm font-extrabold' 
                                      : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                                  }`}
                                >
                                  <span 
                                    className="w-2.5 h-2.5 rounded-full border border-gray-300"
                                    style={{ backgroundColor: colorObj.hex }}
                                  />
                                  <span>{colorObj.name}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* SKU Match Status Area */}
                        <div className="pt-2 border-t border-pink-100/60 mt-1 flex justify-between items-center text-[10px] font-bold">
                          <span className="text-gray-500 uppercase">Status SKU:</span>
                          {ordSku ? (
                            <span className="text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                              🟢 {ordSku}
                            </span>
                          ) : (
                            <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-200/50">
                              ⚠️ Belum Ada di Master
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="font-bold text-gray-600">Qty Pemesanan</label>
                          <input
                            type="number"
                            required
                            min="1"
                            value={ordQty}
                            onChange={(e) => setOrdQty(e.target.value)}
                            className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none font-bold text-xs"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="font-bold text-gray-600">Harga Jual Otomatis</label>
                          <input
                            type="number"
                            required
                            placeholder="Rp / Pcs"
                            value={ordPrice}
                            onChange={(e) => setOrdPrice(e.target.value)}
                            className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none font-mono text-xs text-pink-600 font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          type="button"
                          disabled={!ordSku}
                          onClick={handleAddProductToStaging}
                          className={`w-full font-bold py-2.5 px-3 rounded-xl cursor-pointer transition text-center text-xs flex items-center justify-center gap-1 border uppercase ${
                            ordSku
                              ? 'bg-pink-50 border-pink-200 text-[#EC4899] hover:bg-pink-100 font-extrabold'
                              : 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed text-[10px]'
                          }`}
                        >
                          <Plus className="w-3.5 h-3.5" /> + Tambah Barang
                        </button>
                      </div>

                      {/* Display Staged Items List inside the Order Creation Card */}
                      {tempOrderItems.length > 0 && (
                        <div className="mt-4 pt-3 border-t border-pink-100 space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-[10px] font-extrabold uppercase text-gray-400">Keranjang Transaksi:</span>
                            <button
                              type="button"
                              onClick={() => setTempOrderItems([])}
                              className="text-[10px] text-red-500 font-bold hover:underline cursor-pointer"
                            >
                              Reset Keranjang
                            </button>
                          </div>
                          
                          <div className="bg-[#FFF8FB] border border-pink-50/50 rounded-2xl p-2.5 max-h-48 overflow-y-auto space-y-1.5">
                            {tempOrderItems.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-start text-[10px] font-bold border-b border-pink-100/30 pb-1.5 last:border-0 last:pb-0">
                                <div className="space-y-0.5 pr-2">
                                  <p className="text-gray-805 leading-normal">{item.Product_Name}</p>
                                  <p className="text-[9px] font-mono text-gray-400 font-normal">{item.SKU} | {item.Qty} pcs x {formatIDR(item.Price)}</p>
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <span className="text-gray-900 font-mono text-right">{formatIDR(item.Total)}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveProductFromStaging(idx)}
                                    className="text-red-400 hover:text-red-650 transition cursor-pointer"
                                    title="Hapus"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          <div className="flex justify-between items-center px-2.5 py-1.5 bg-pink-50/50 rounded-xl border border-pink-100/30 text-[11px] font-bold font-mono">
                            <span className="text-gray-500 uppercase text-[9px]">Grand Total ({tempOrderItems.reduce((acc, i) => acc + i.Qty, 0)} pcs):</span>
                            <span className="text-[#EC4899] font-black">
                              {formatIDR(tempOrderItems.reduce((acc, item) => acc + item.Total, 0))}
                            </span>
                          </div>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={tempOrderItems.length === 0}
                        className={`w-full font-bold py-3 px-4 rounded-xl cursor-pointer transition shadow-md uppercase text-center text-xs block ${
                          tempOrderItems.length > 0
                            ? 'bg-[#EC4899] hover:bg-[#D93B84] text-white cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                        }`}
                      >
                        Simpan Transaksi Sales Order
                      </button>
                    </form>
                  </div>

                  {/* Listings & Fulfillment pipelines */}
                  <div className="lg:col-span-8 bg-white border border-pink-100 rounded-[32px] p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-pink-50">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">Orders Fulfillment Station</h4>
                      <span className="text-[10px] text-gray-400 font-mono font-bold">{orders.length} orders total</span>
                    </div>

                    {/* Responsive dual view container for Fulfillment pipeline to prevent scrolling sideways on phones */}
                    {(() => {
                      // Group orders by Order_Number
                      const groupedList: {
                        [ordNum: string]: {
                          Order_Number: string;
                          Order_Date: string;
                          Customer: string;
                          Channel: string;
                          Status: OrderStatus;
                          items: { SKU: string; Product: string; Qty: number; Price: number; Total: number }[];
                          TotalSum: number;
                          representativeOrder: Order;
                        }
                      } = {};

                      orders.forEach(o => {
                        if (!groupedList[o.Order_Number]) {
                          groupedList[o.Order_Number] = {
                            Order_Number: o.Order_Number,
                            Order_Date: o.Order_Date,
                            Customer: o.Customer,
                            Channel: o.Channel,
                            Status: o.Status,
                            items: [],
                            TotalSum: 0,
                            representativeOrder: o
                          };
                        }
                        groupedList[o.Order_Number].items.push({
                          SKU: o.SKU,
                          Product: o.Product,
                          Qty: o.Qty,
                          Price: o.Price,
                          Total: o.Total
                        });
                        groupedList[o.Order_Number].TotalSum += o.Total;
                      });

                      const sortedGrouped = Object.values(groupedList).sort((a, b) => b.Order_Number.localeCompare(a.Order_Number));

                      return (
                        <>
                          {/* 1. DESKTOP VIEW: TABLE LAYOUT FOR md SCREEN OR HIGHER */}
                          <div className="hidden md:block overflow-x-auto">
                            <table className="w-full text-left text-xs border-collapse">
                              <thead>
                                <tr className="border-b border-pink-50 font-mono text-gray-400 uppercase tracking-widest text-[10px]">
                                  <th className="py-2.5 px-3">Order & Pelanggan</th>
                                  <th className="py-2.5 px-3">Item Produk</th>
                                  <th className="py-2.5 px-3 text-right">Total Transaksi</th>
                                  <th className="py-2.5 px-3 text-right">Status & Kontrol</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-pink-50/50">
                                {sortedGrouped.map((o, idxO) => {
                                  // Visual status pill classes
                                  let statClass = "bg-gray-100 text-gray-700";
                                  if (o.Status === 'New Order') statClass = "bg-amber-100 text-amber-700 font-extrabold pb-0.5 px-2.5 rounded-full";
                                  if (o.Status === 'Processing') statClass = "bg-blue-50 text-blue-600 font-bold px-2.5 rounded-full";
                                  if (o.Status === 'Picking') statClass = "bg-purple-50 text-purple-600 px-2.5 rounded-full";
                                  if (o.Status === 'Packing') statClass = "bg-[#FFF3F8] text-[#EC4899] font-black px-2.5 rounded-full";
                                  if (o.Status === 'Ready To Ship') statClass = "bg-emerald-50 text-emerald-600 font-bold px-2.5 rounded-full";
                                  if (o.Status === 'Shipped') statClass = "bg-indigo-50 text-indigo-600 px-2.5 rounded-full";
                                  if (o.Status === 'Completed') statClass = "bg-green-100 text-green-800 font-extrabold px-2.5 rounded-full";
                                  if (o.Status === 'Cancelled') statClass = "bg-red-50 text-red-500 line-through px-2.5 rounded-full";

                                  // Channel decoration
                                  let channelClass = "bg-gray-100 text-gray-600 border-gray-200";
                                  if (o.Channel === 'Shopee') channelClass = "bg-orange-50 text-orange-600 border border-orange-100";
                                  else if (o.Channel === 'TikTok & Tokopedia') channelClass = "bg-indigo-50 text-indigo-605 border border-indigo-100";
                                  else if (['Retail IG', 'Ecer'].includes(o.Channel)) channelClass = "bg-pink-50 text-pink-600 border border-pink-100";
                                  else if (['Reseller', 'Agen', 'Marketer'].includes(o.Channel)) channelClass = "bg-cyan-50 text-cyan-600 border border-cyan-100";
                                  else if (o.Channel === 'Distributor') channelClass = "bg-amber-50 text-amber-600 border border-amber-100";

                                  return (
                                    <tr key={`${o.Order_Number}-${idxO}`} className="hover:bg-[#FFF8FB] text-gray-750 font-medium border-b border-pink-50/50 transition duration-150">
                                      <td className="py-3 px-3 align-top min-w-[150px]">
                                        <strong className="text-gray-900 text-xs tracking-tight block font-extrabold cursor-pointer hover:underline hover:text-[#EC4899] transition" onClick={() => setActiveDetailOrderNum(o.Order_Number)}>
                                          {o.Order_Number}
                                        </strong>
                                        <div className="font-extrabold text-[#EC4899] uppercase tracking-tight text-[11px] mt-0.5">{o.Customer}</div>
                                        <div className="flex flex-wrap items-center gap-1.5 mt-1">
                                          <span className={`inline-block text-[8px] font-black rounded px-1.5 py-0.5 border leading-none uppercase ${channelClass}`}>
                                            {o.Channel}
                                          </span>
                                          <span className="text-[9px] text-[#EC4899] font-mono leading-none font-bold">
                                            🗓 {new Date(o.Order_Date).toLocaleDateString()}
                                          </span>
                                        </div>
                                      </td>
                                      <td className="py-3 px-3 align-top">
                                        <div className="space-y-1.5 max-w-[220px]">
                                          {o.items.map((item, idx) => (
                                            <div key={idx} className="border-b border-pink-50/30 last:border-0 pb-1.5 last:pb-0">
                                              <div className="font-bold text-gray-805 leading-tight">{item.Product}</div>
                                              <div className="text-[10px] font-mono text-gray-400 mt-0.5">
                                                SKU: <span className="text-pink-600 font-bold">{item.SKU}</span> | {item.Qty} Pcs @ {formatIDR(item.Price)}
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                      <td className="py-3 px-3 text-right font-mono font-black text-gray-950 align-top text-xs shrink-0 min-w-[100px]">
                                        {formatIDR(o.TotalSum)}
                                        <div className="text-[9px] text-gray-400 font-sans font-extrabold mt-1">({o.items.reduce((acc, i) => acc + i.Qty, 0)} Pcs)</div>
                                      </td>
                                      <td className="py-3 px-3 align-top text-right min-w-[160px]">
                                        <div className="flex flex-col items-end gap-1.5">
                                          {/* Status display */}
                                          <span className={`inline-block py-0.5 px-2 rounded-full text-[9px] uppercase font-black tracking-wider leading-none select-none ${statClass}`}>
                                            ● {o.Status}
                                          </span>

                                          {/* Action buttons */}
                                          <div className="pt-0.5">
                                            {o.Status === 'New Order' && (
                                              <button
                                                onClick={() => handleUpdateOrderStatus(o.Order_Number, 'Processing')}
                                                className="bg-blue-500 hover:bg-blue-600 text-white text-[9px] font-bold py-1 px-2.5 rounded-lg cursor-pointer transition shadow-sm"
                                              >
                                                Process Order
                                              </button>
                                            )}

                                            {o.Status === 'Processing' && (
                                              <button
                                                onClick={() => handleUpdateOrderStatus(o.Order_Number, 'Picking')}
                                                className="bg-purple-500 hover:bg-purple-600 text-white text-[9px] font-bold py-1 px-2.5 rounded-lg cursor-pointer transition shadow-sm"
                                              >
                                                Start Picking 🛒
                                              </button>
                                            )}

                                            {o.Status === 'Picking' && (
                                              <button
                                                onClick={() => handleOpenPackStation(o.representativeOrder)}
                                                className="bg-[#EC4899] hover:bg-[#D93B84] text-white text-[9px] font-bold py-1 px-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-1 leading-tight transition shadow-sm animate-pulse"
                                              >
                                                <ClipboardCheck className="w-3 h-3" /> Pack Item 🎁
                                              </button>
                                            )}

                                            {o.Status === 'Ready To Ship' && hasPermission('shipping') && (
                                              <button
                                                onClick={() => {
                                                  setSelectedShipOrder(o.Order_Number);
                                                  setActiveTab('shipping');
                                                }}
                                                className="bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-bold py-1 px-2.5 rounded-lg cursor-pointer transition shadow-sm"
                                              >
                                                Assign Courier 🚚
                                              </button>
                                            )}

                                            {o.Status === 'Shipped' && (
                                              <span className="text-[10px] text-gray-400 font-bold block">🚚 In Transit</span>
                                            )}

                                            {o.Status === 'Completed' && (
                                              <span className="text-[10px] text-emerald-600 font-bold block">✓ Selesai</span>
                                            )}

                                            {o.Status === 'Cancelled' && (
                                              <span className="text-[10px] text-red-400 font-bold block">Voided</span>
                                            )}
                                          </div>

                                          {/* Auxiliary buttons */}
                                          <div className="flex gap-1.5 mt-1 justify-end">
                                            <button
                                              onClick={() => setActiveDetailOrderNum(o.Order_Number)}
                                              className="p-1 rounded bg-gray-50 border border-gray-100 hover:border-pink-300 hover:bg-pink-50 text-gray-500 hover:text-[#EC4899] font-bold text-[9px] transition cursor-pointer flex items-center gap-0.5"
                                              title="Detail Pesanan"
                                            >
                                              <Eye className="w-3 h-3" /> Detail
                                            </button>
                                            <button
                                              onClick={() => handlePrintInvoice(o.Order_Number)}
                                              className="p-1 rounded bg-pink-50 border border-pink-100 hover:border-pink-300 hover:bg-pink-100 text-[#EC4899] font-black text-[9px] transition cursor-pointer flex items-center gap-0.5"
                                              title="Cetak Struk"
                                            >
                                              <Printer className="w-3 h-3" /> Struk
                                            </button>
                                          </div>
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                })}
                              </tbody>
                            </table>
                          </div>

                          {/* 2. MOBILE VIEW: FULLY RESPONSIVE AND STACKED CARD ELEMENTS (NO SIDEWAYS SCROLL) */}
                          <div className="block md:hidden space-y-3">
                            {sortedGrouped.map((o, idxO) => {
                              // Visual status pill classes
                              let statClass = "bg-gray-100 text-gray-700";
                              if (o.Status === 'New Order') statClass = "bg-amber-100 text-amber-700 font-extrabold px-2.5 py-0.5 rounded-full text-[9px]";
                              if (o.Status === 'Processing') statClass = "bg-blue-50 text-blue-600 font-bold px-2.5 py-0.5 rounded-full text-[9px]";
                              if (o.Status === 'Picking') statClass = "bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full text-[9px]";
                              if (o.Status === 'Packing') statClass = "bg-[#FFF3F8] text-[#EC4899] font-black px-2.5 py-0.5 rounded-full text-[9px]";
                              if (o.Status === 'Ready To Ship') statClass = "bg-emerald-50 text-emerald-600 font-bold px-2.5 py-0.5 rounded-full text-[9px]";
                              if (o.Status === 'Shipped') statClass = "bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-[9px]";
                              if (o.Status === 'Completed') statClass = "bg-green-100 text-green-800 font-extrabold px-2.5 py-0.5 rounded-full text-[9px]";
                              if (o.Status === 'Cancelled') statClass = "bg-red-50 text-red-500 line-through px-2.5 py-0.5 rounded-full text-[9px]";

                              // Channel decoration
                              let channelClass = "bg-gray-100 text-gray-600 border-gray-200";
                              if (o.Channel === 'Shopee') channelClass = "bg-orange-50 text-orange-600 border border-orange-100";
                              else if (o.Channel === 'TikTok & Tokopedia') channelClass = "bg-indigo-50 text-indigo-605 border border-indigo-100";
                              else if (['Retail IG', 'Ecer'].includes(o.Channel)) channelClass = "bg-pink-50 text-pink-600 border border-pink-100";
                              else if (['Reseller', 'Agen', 'Marketer'].includes(o.Channel)) channelClass = "bg-cyan-50 text-cyan-600 border border-cyan-100";
                              else if (o.Channel === 'Distributor') channelClass = "bg-amber-50 text-amber-600 border border-amber-100";

                              return (
                                <div key={`mobile-${o.Order_Number}-${idxO}`} className="bg-white border border-pink-100 rounded-2xl p-4 space-y-3.5 shadow-sm hover:border-pink-300 transition duration-150">
                                  {/* Header: Order Number & Channel */}
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <strong 
                                        className="text-gray-900 text-xs md:text-sm tracking-tight block font-black cursor-pointer hover:underline hover:text-[#EC4899]"
                                        onClick={() => setActiveDetailOrderNum(o.Order_Number)}
                                      >
                                        {o.Order_Number}
                                      </strong>
                                      <span className="text-[10px] text-gray-400 font-medium block">
                                        🗓 {new Date(o.Order_Date).toLocaleDateString()} {new Date(o.Order_Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                      </span>
                                    </div>
                                    <span className={`inline-block text-[8px] font-black rounded px-1.5 py-0.5 border leading-none uppercase ${channelClass}`}>
                                      {o.Channel}
                                    </span>
                                  </div>

                                  {/* Customer Info */}
                                  <div className="border-t border-pink-50/40 pt-2 flex justify-between items-center bg-[#FFF8FB] p-2 rounded-xl border border-pink-100/40">
                                    <div>
                                      <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-bold">Pelanggan</span>
                                      <span className="font-extrabold text-gray-900 uppercase text-xs">{o.Customer}</span>
                                    </div>
                                    <div className="text-right">
                                      <span className="text-[8px] uppercase tracking-wider text-gray-400 block font-bold">Status</span>
                                      <span className={`inline-block uppercase font-black tracking-wider leading-none select-none ${statClass}`}>
                                        ● {o.Status}
                                      </span>
                                    </div>
                                  </div>

                                  {/* Product Items List Card */}
                                  <div className="bg-gray-50 rounded-xl p-2.5 space-y-2 text-xs">
                                    {o.items.map((item, idx) => (
                                      <div key={idx} className="border-b border-pink-50/20 last:border-0 pb-2 last:pb-0 flex justify-between items-start gap-4">
                                        <div className="space-y-0.5">
                                          <div className="font-bold text-gray-805 leading-tight">{item.Product}</div>
                                          <div className="text-[9px] font-mono text-gray-400">
                                            SKU: <span className="text-pink-600 font-bold">{item.SKU}</span>
                                          </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                          <span className="font-mono text-xs font-bold text-gray-900">{item.Qty} Pcs</span>
                                          <div className="text-[9px] text-[#EC4899] font-mono font-bold">{formatIDR(item.Total)}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>

                                  {/* Subtotal & Actions Group */}
                                  <div className="border-t border-pink-50/40 pt-3 flex flex-col gap-2.5">
                                    <div className="flex justify-between items-center">
                                      <span className="text-[9px] text-gray-400 font-bold uppercase">Total Pembayaran</span>
                                      <span className="font-mono font-black text-gray-950 text-xs">
                                        {formatIDR(o.TotalSum)} <span className="font-sans font-extrabold text-[9px] text-gray-400">({o.items.reduce((acc, i) => acc + i.Qty, 0)} Pcs)</span>
                                      </span>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                      {/* Primary Status action trigger button */}
                                      {o.Status === 'New Order' && (
                                        <button
                                          onClick={() => handleUpdateOrderStatus(o.Order_Number, 'Processing')}
                                          className="w-full bg-blue-500 hover:bg-blue-600 text-white text-[10px] font-black py-2 px-4 rounded-xl cursor-pointer transition shadow-sm uppercase tracking-wider text-center block"
                                        >
                                          Process Order
                                        </button>
                                      )}

                                      {o.Status === 'Processing' && (
                                        <button
                                          onClick={() => handleUpdateOrderStatus(o.Order_Number, 'Picking')}
                                          className="w-full bg-purple-500 hover:bg-purple-600 text-white text-[10px] font-black py-2 px-4 rounded-xl cursor-pointer transition shadow-sm uppercase tracking-wider text-center block"
                                        >
                                          Mulai Picking 🛒
                                        </button>
                                      )}

                                      {o.Status === 'Picking' && (
                                        <button
                                          onClick={() => handleOpenPackStation(o.representativeOrder)}
                                          className="w-full bg-[#EC4899] hover:bg-[#D93B84] text-white text-[10px] font-black py-2 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-1 leading-tight transition shadow-sm animate-pulse uppercase tracking-wider"
                                        >
                                          <ClipboardCheck className="w-4 h-4" /> Pack Order 🎁
                                        </button>
                                      )}

                                      {o.Status === 'Ready To Ship' && hasPermission('shipping') && (
                                        <button
                                          onClick={() => {
                                            setSelectedShipOrder(o.Order_Number);
                                            setActiveTab('shipping');
                                          }}
                                          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black py-2 px-4 rounded-xl cursor-pointer transition shadow-sm uppercase tracking-wider text-center block"
                                        >
                                          Kirim Kurir 🚚
                                        </button>
                                      )}

                                      {/* Auxiliary buttons */}
                                      <div className="grid grid-cols-2 gap-1.5">
                                        <button
                                          onClick={() => setActiveDetailOrderNum(o.Order_Number)}
                                          className="py-1.5 px-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-pink-300 hover:bg-pink-50 text-gray-600 hover:text-[#EC4899] font-bold text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
                                        >
                                          <Eye className="w-3.5 h-3.5" /> Detail
                                        </button>
                                        <button
                                          onClick={() => handlePrintInvoice(o.Order_Number)}
                                          className="py-1.5 px-3 rounded-xl bg-pink-50 border border-pink-100 hover:border-pink-300 hover:bg-pink-100 text-[#EC4899] font-black text-[10px] transition cursor-pointer flex items-center justify-center gap-1"
                                        >
                                          <Printer className="w-3.5 h-3.5" /> Struk
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    })()}

                  </div>

                </div>

              </div>
            )}

            {/* 7. SHIPPING MANAGEMENT VIEW */}
            {activeTab === 'shipping' && hasPermission('shipping') && (
              <div className="space-y-6 text-left">
                
                {/* List and form components */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Courier Assignment Form */}
                  <div className="lg:col-span-5 bg-white border border-pink-100 p-6 rounded-[32px] shadow-sm space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-pink-700 pb-2 border-b border-pink-50">Assign Tracking & Expedition</h3>
                    
                    <form onSubmit={handleAssignShippingSubmit} className="space-y-4 text-xs font-semibold text-gray-750">
                      <div className="space-y-1 block">
                        <label className="font-bold text-gray-600 block uppercase">PILIH PESANAN (Status: Ready to Ship)</label>
                        <select
                          required
                          value={selectedShipOrder || ''}
                          onChange={(e) => setSelectedShipOrder(e.target.value)}
                          className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none focus:border-pink-500"
                        >
                          <option value="">-- PILIH ORDER NOMOR --</option>
                          {(() => {
                            const seen = new Set();
                            const readyGrouped: { Order_Number: string; Customer: string; Qty: number }[] = [];
                            orders.filter(o => o.Status === 'Ready To Ship').forEach(o => {
                              if (!seen.has(o.Order_Number)) {
                                seen.add(o.Order_Number);
                                const totalQty = orders
                                  .filter(item => item.Order_Number === o.Order_Number)
                                  .reduce((sum, item) => sum + item.Qty, 0);
                                readyGrouped.push({
                                  Order_Number: o.Order_Number,
                                  Customer: o.Customer,
                                  Qty: totalQty
                                });
                              }
                            });
                            return readyGrouped.map((o, idxRg) => (
                              <option key={`${o.Order_Number}-${idxRg}`} value={o.Order_Number}>
                                [{o.Order_Number}] {o.Customer} ({o.Qty} Pcs)
                              </option>
                            ));
                          })()}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-600">Ekspedisi Kurir</label>
                        <select
                          value={shipCourier}
                          onChange={(e) => setShipCourier(e.target.value)}
                          className="w-full bg-white border border-pink-100 rounded-xl py-2.5 px-3 focus:outline-none"
                        >
                          <option value="JNE Express">JNE Express</option>
                          <option value="SPX Shopee Express">SPX Shopee Express</option>
                          <option value="J&T Express">J&T Express</option>
                          <option value="Sicepat Reg">Sicepat Reg</option>
                          <option value="Wahana">Wahana</option>
                          <option value="GoSend instant">GoSend instant</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-600">Nomor Resi / Waybill Code</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. JB991122883"
                          value={shipTracking}
                          onChange={(e) => setShipTracking(e.target.value.toUpperCase())}
                          className="w-full bg-white border border-pink-100 rounded-xl py-2.5 px-3 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-600">Status Awal</label>
                        <select
                          value={shipStatus}
                          onChange={(e) => setShipStatus(e.target.value as any)}
                          className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none text-gray-700"
                        >
                          <option value="In Transit">Dalam Perjalanan (In Transit)</option>
                          <option value="Waiting Pickup">Menunggu Kurir (Waiting Pickup)</option>
                          <option value="Delivered">Tiba di Lokasi (Delivered)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#111827] hover:bg-black text-white font-bold py-3 px-4 rounded-xl cursor-pointer transition uppercase"
                      >
                        Pasang Resi Kiriman
                      </button>
                    </form>
                  </div>

                  {/* Operational shipping log */}
                  <div className="lg:col-span-7 bg-white border border-pink-100 rounded-[32px] p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-pink-50">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">Active Expeditions Logistics</h4>
                      <span className="text-[10px] text-gray-400 font-mono font-bold">{shipping.length} shipments total</span>
                    </div>

                    <div className="space-y-3 min-h-[300px]">
                      {shipping.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-xs">Belum ada pengiriman aktif.</div>
                      ) : (
                        shipping.map((s, idx) => (
                          <div key={`${s.Tracking_Number || s.Order_Number}-${idx}`} className="bg-white border border-pink-50 rounded-2xl p-4 hover:shadow-sm transition space-y-2.5 text-xs text-[#111827]">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="font-mono text-xs font-bold text-[#EC4899] block">
                                  No. Order: {s.Order_Number}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  {new Date(s.Shipping_Date).toLocaleString('id-ID')}
                                </span>
                              </div>
                              <span className={`inline-block py-1 px-2.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                s.Status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                              }`}>
                                {s.Status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-dashed border-pink-50 text-xs">
                              <div>
                                <span className="text-gray-400 text-[10px] block uppercase font-mono tracking-wider mb-0.5">Ekspedisi / Resi</span>
                                <span className="font-bold text-gray-900 block">{s.Courier}</span>
                                <span className="text-[10px] font-mono text-gray-500 block">{s.Tracking_Number || '-'}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 text-[10px] block uppercase font-mono tracking-wider mb-0.5">Keterangan</span>
                                <span className="italic text-gray-500 text-[10px]">Ready to delivered confirm.</span>
                              </div>
                            </div>

                            <div className="pt-2.5 flex justify-end items-center border-t border-pink-50/50">
                              {s.Status !== 'Delivered' ? (
                                <button
                                  onClick={async () => {
                                    // Simulate delivery confirm
                                    await fetch('/api/shipping', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        action: 'UPSERT',
                                        shipping: { ...s, Status: 'Delivered' },
                                        user: { name: currentUser?.Full_Name, role: currentUser?.Role }
                                      })
                                    });
                                    alert(`Shipping deliver confirmation marked for order ${s.Order_Number}`);
                                    await fetchDatabaseState();
                                  }}
                                  className="w-full sm:w-auto bg-[#EC4899] hover:bg-pink-600 text-white font-bold py-1.5 px-4 rounded-xl text-[10px] cursor-pointer transition text-center"
                                >
                                  Mark Delivered ✓
                                </button>
                              ) : (
                                <span className="text-[10px] text-gray-400">Fulfillment Complete</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>

                </div>

              </div>
            )}

            {/* 8. REPORTS VIEW */}
            {activeTab === 'reports' && hasPermission('reports') && (
              <div className="space-y-6 text-left">
                
                {/* Reports visual filter */}
                <div className="bg-white p-5 rounded-[32px] border border-pink-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shadow-sm">
                  <div className="space-y-1 block">
                    <h3 className="font-extrabold text-[#EC4899] uppercase text-xs tracking-wider">RESTORASI REPORT & ANALYTICS SISTEM</h3>
                    <p className="text-gray-500 text-xs font-semibold">Tampilkan rangkuman performa barang fast moving, customer growth, dan prediksi restock forecasting otomatis.</p>
                  </div>

                  <div className="flex gap-2 text-xs font-bold">
                    {['daily', 'weekly', 'monthly', 'yearly'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setReportsFilter(period as any)}
                        className={`py-2 px-4 rounded-xl cursor-pointer text-xs transition capitalize ${
                          reportsFilter === period ? 'bg-[#EC4899] text-white font-bold' : 'bg-[#FFF8FB] text-gray-600 border border-pink-100'
                        }`}
                      >
                        {period}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Restock Prediction Engine Matrix */}
                <div className="bg-white border border-pink-100 rounded-[32px] p-6 shadow-sm space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-pink-50">
                    <div className="space-y-0.5">
                      <h4 className="font-black text-gray-900 text-sm uppercase">ALINA RESTOCK FORECASTING MATRIX (14 Hari Prediksi)</h4>
                      <p className="text-[10px] text-gray-400 font-sans leading-tight">Dihitung otomatis berdasarkan rata-rata volume penjualan 30 hari terakhir dibandingkan kapasitas sisa rak gudang.</p>
                    </div>

                    <span className="text-[10px] bg-red-100 text-red-600 font-black px-3 py-1 rounded-full animate-bounce">
                      {restockAlertsCount} RESTOCK REQUIRED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restockForecastList.map((itm, idx) => (
                      <div 
                        key={`${itm.sku}-${idx}`}
                        className="bg-gradient-to-tr from-[#FFF8FB] to-white border-l-4 border-[#EC4899] p-4 rounded-r-2xl shadow-sm space-y-3"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-extrabold text-xs text-gray-900 leading-tight truncate max-w-[150px]">{itm.name}</h5>
                            <span className="font-mono text-[9px] text-[#EC4899] font-bold block">{itm.sku}</span>
                          </div>
                          
                          <span className="bg-[#FFF3F8] text-[#EC4899] text-[9px] font-black px-2 py-0.5 rounded border border-pink-100">
                            RESTOCK REQUIRED
                          </span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500 border-t border-b border-pink-50/50 py-2">
                          <div>
                            <p className="text-gray-400 font-normal">STOK SEKARANG</p>
                            <p className="text-gray-900 font-mono text-xs">{itm.current} Pcs</p>
                          </div>
                          <div>
                            <p className="text-gray-400 font-normal">DAILY SALES RATE</p>
                            <p className="text-pink-650 font-mono text-xs">{itm.dsr} pcs / hari</p>
                          </div>
                        </div>

                        <div className="text-[10px] font-bold text-[#EC4899] flex justify-between items-center bg-[#FFF3F8] p-2 rounded-xl">
                          <span>Prediksi Habis:</span>
                          <span className="bg-white px-2 py-0.5 rounded border font-mono tracking-tight font-black">{itm.predictedDate}</span>
                        </div>
                      </div>
                    ))}

                    {restockForecastList.length === 0 && (
                      <p className="col-span-3 text-center text-xs text-gray-400 py-10">Kabar baik! Persediaan aman dan lancar di seluruh SKU.</p>
                    )}
                  </div>
                </div>

                {/* Sales growth & top channels summary metrics */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* General analytics */}
                  <div className="bg-white border border-pink-100 rounded-[32px] p-5 shadow-sm space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">Penjualan per Channel Distribusi</h4>
                    
                    <div className="space-y-3">
                      {categoryList.map((cat, idx) => {
                        const count = products.filter(p => p.Category === cat).length;
                        return (
                          <div key={`${cat}-${idx}`} className="space-y-1 text-xs">
                            <div className="flex justify-between items-center font-bold text-gray-700">
                              <span>{cat}</span>
                              <span className="font-mono text-gray-400">{count} SKU aktif</span>
                            </div>
                            <div className="w-full bg-pink-150 rounded-full h-1 bg-pink-50">
                              <div className="bg-[#EC4899] h-1 rounded-full" style={{ width: `${(count / products.length) * 100}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Operational Audit trail */}
                  <div className="bg-white border border-pink-100 rounded-[32px] p-5 shadow-sm space-y-4">
                    <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">SISTEM AUDIT ACTIVITY LOG</h4>
                    
                    <div className="divide-y divide-gray-50 max-h-60 overflow-y-auto font-mono text-[9px] text-gray-500 pr-1">
                      {activityLog.map((log, idx) => (
                        <div key={`${log.Log_ID || 'audit'}-${idx}`} className="py-2 space-y-0.5">
                          <div className="flex justify-between text-gray-900 font-bold">
                            <span>[{log.Module}] {log.User_Name} ({log.User_Role})</span>
                            <span className="text-gray-400">{new Date(log.Timestamp).toLocaleTimeString()}</span>
                          </div>
                          <p className="text-gray-600 block">{log.Activity}</p>
                          <span className="text-[8px] text-gray-400 italic block">{log.Device}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* 9. SECURE USER MANAGEMENT VIEW (OWNER ONLY) */}
            {activeTab === 'users' && currentUser?.Role === 'OWNER' && (
              <div className="space-y-6 text-left">
                
                {/* User settings summary */}
                <div className="bg-white p-5 rounded-[32px] border border-pink-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <h3 className="font-black text-[#EC4899] text-xs uppercase tracking-wider">MANAGEMEN ADMINISTRATIVE USER</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">Buat, ganti profil password, atau matikan ijin autentikasi staff operasional Alina WMS & OMS.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingUser({
                        Full_Name: '',
                        Email: '',
                        Role: 'ADMIN',
                        Status: 'Active',
                        Password: '',
                        Permissions: ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
                      });
                      setIsUserModalOpen(true);
                    }}
                    className="bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" /> Tambah Staff Baru
                  </button>
                </div>

                {/* User listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((u, idx) => (
                    <div key={`${u.User_ID}-${idx}`} className="bg-white border border-pink-100 p-5 rounded-[24px] shadow-sm flex flex-col justify-between gap-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{u.Full_Name}</h4>
                            <span className="text-[10px] font-mono text-pink-500 block">{u.User_ID}</span>
                          </div>

                          <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            u.Role === 'OWNER' ? 'bg-pink-100 text-[#EC4899]' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.Role}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-gray-500 font-medium">
                          <p>✉ EMAIL: {u.Email}</p>
                          <p>🗓 CREATED: {new Date(u.Created_Date).toLocaleDateString()}</p>
                          <p>⌛ LAST LOGIN: {u.Last_Login ? new Date(u.Last_Login).toLocaleString() : 'Never logged in'}</p>
                        </div>

                        {/* Allowed permissions listing */}
                        <div className="pt-2 border-t border-pink-50/50">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Akses Modul:</p>
                          <div className="flex flex-wrap gap-1">
                            {u.Role === 'OWNER' ? (
                              <span className="text-[9px] bg-pink-100 text-[#EC4899] font-bold px-2 py-0.5 rounded-full border border-pink-200">Semua Akses (OWNER)</span>
                            ) : !u.Permissions || u.Permissions.length === 0 ? (
                              <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full border border-gray-200">Semua Akses (Staff Default)</span>
                            ) : (
                              u.Permissions.map((p, idxP) => (
                                <span key={`${p}-${idxP}`} className="text-[9px] bg-pink-50 text-pink-600 font-bold px-1.5 py-0.5 rounded border border-pink-100">
                                  {p === 'dashboard' ? 'Dashboard' :
                                   p === 'products' ? 'Catalog' :
                                   p === 'inventory' ? 'Stock Trx' :
                                   p === 'opname' ? 'Opname' :
                                   p === 'orders' ? 'Orders' :
                                   p === 'shipping' ? 'Shipping' :
                                   p === 'reports' ? 'Reports' :
                                   p === 'customers' ? 'Customers' :
                                   p === 'settings' ? 'Sheets' : p}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-pink-50 pt-3 mt-1 justify-end">
                        <button
                          onClick={() => {
                            setEditingUser({
                              ...u,
                              Permissions: u.Permissions || ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
                            });
                            setIsUserModalOpen(true);
                          }}
                          className="text-xs font-bold text-gray-750 hover:underline cursor-pointer hover:text-black"
                        >
                          Modify State
                        </button>
                        
                        <button
                          onClick={() => handleDeleteUser(u.User_ID)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Dissolve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            )}

            {/* 10. SHEETS CONNECTOR & THEME SETTINGS */}
            {activeTab === 'settings' && hasPermission('settings') && (
              <div className="space-y-6 animate-[fadeIn_0.25s_ease-out]">
                
                {/* Visual Customizer & Appearance Settings Card */}
                <div className="bg-white border border-pink-100 p-6 rounded-[32px] shadow-sm text-left space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
                    <h3 className="font-extrabold text-xs uppercase tracking-widest text-[#EC4899]">
                      PILIHAN TEMA & TAMPILAN ALINA
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 font-sans">
                    Atur visual antarmuka sirkulasi data Alina Anda di sini. Seluruh tema didesain bernuansa merah muda (pink) khas Alina yang menawan dengan detail maskot hoki masing-masing, kecuali edisi iOS minimalis.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 font-sans pt-2">
                    {/* Theme Option 1: Default Alina */}
                    <button
                      type="button"
                      onClick={() => {
                        setAppTheme('default');
                        safeLocalStorage.setItem('alina_app_theme', 'default');
                      }}
                      className={`p-4 rounded-2xl border-2 text-left transition duration-200 cursor-pointer flex flex-col gap-2 relative overflow-hidden h-full ${
                        appTheme === 'default'
                          ? 'border-[#EC4899] bg-pink-50/20 shadow-sm'
                          : 'border-pink-100/70 hover:border-pink-300 bg-white'
                      }`}
                    >
                      <div className="absolute right-2 top-2 text-2xl opacity-10">🌸</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌸</span>
                        <h4 className="font-bold text-xs text-gray-900 uppercase tracking-tight">ALINA DEFAULT</h4>
                      </div>
                      <p className="text-[10px] text-gray-400">Desain standar Alina Enterprise. Bersih, premium, dan penuh estetika pink yang memikat mata.</p>
                      {appTheme === 'default' && (
                        <span className="text-[9px] bg-[#EC4899] text-white px-2 py-0.5 rounded-md font-bold uppercase w-fit font-mono mt-auto">Aktif</span>
                      )}
                    </button>

                    {/* Theme Option 2: Clean iOS 26 */}
                    <button
                      type="button"
                      onClick={() => {
                        setAppTheme('ios');
                        safeLocalStorage.setItem('alina_app_theme', 'ios');
                      }}
                      className={`p-4 rounded-2xl border-2 text-left transition duration-200 cursor-pointer flex flex-col gap-2 relative overflow-hidden h-full ${
                        appTheme === 'ios'
                          ? 'border-gray-900 bg-slate-50/50 shadow-sm'
                          : 'border-pink-100/70 hover:border-pink-300 bg-white'
                      }`}
                    >
                      <div className="absolute right-2 top-2 text-2xl opacity-10">💎</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💎</span>
                        <h4 className="font-bold text-xs text-slate-800 uppercase tracking-tight">iOS 26 CLEAN</h4>
                      </div>
                      <p className="text-[10px] text-gray-400">Liquid glass minimalis dengan sentuhan layout hitam-putih murni layaknya perangkat Apple modern.</p>
                      {appTheme === 'ios' && (
                        <span className="text-[9px] bg-slate-900 text-white px-2 py-0.5 rounded-md font-bold uppercase w-fit font-mono mt-auto">Aktif</span>
                      )}
                    </button>

                    {/* Theme Option 3: Ayam Emas */}
                    <button
                      type="button"
                      onClick={() => {
                        setAppTheme('ayam');
                        safeLocalStorage.setItem('alina_app_theme', 'ayam');
                      }}
                      className={`p-4 rounded-2xl border-2 text-left transition duration-200 cursor-pointer flex flex-col gap-2 relative overflow-hidden h-full ${
                        appTheme === 'ayam'
                          ? 'border-[#EC4899] bg-pink-50/20 shadow-sm'
                          : 'border-pink-100/70 hover:border-pink-300 bg-white'
                      }`}
                    >
                      <div className="absolute right-2 top-2 text-2xl opacity-10">🐔</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🐔</span>
                        <h4 className="font-bold text-xs text-pink-700 uppercase tracking-tight">TEMA AYAM</h4>
                      </div>
                      <p className="text-[10px] text-gray-400">Nuansa pink manis Alina dipadu dengan mandor ayam yang berkokok membawa rezeki, plus icon menu bernuansa ayam hoki.</p>
                      {appTheme === 'ayam' && (
                        <span className="text-[9px] bg-pink-500 text-white px-2 py-0.5 rounded-md font-bold uppercase w-fit font-mono mt-auto">Aktif 🐔</span>
                      )}
                    </button>

                    {/* Theme Option 4: Kucing Beruntung */}
                    <button
                      type="button"
                      onClick={() => {
                        setAppTheme('kucing');
                        safeLocalStorage.setItem('alina_app_theme', 'kucing');
                      }}
                      className={`p-4 rounded-2xl border-2 text-left transition duration-200 cursor-pointer flex flex-col gap-2 relative overflow-hidden h-full ${
                        appTheme === 'kucing'
                          ? 'border-[#EC4899] bg-pink-50/20 shadow-sm'
                          : 'border-pink-100/70 hover:border-pink-300 bg-white'
                      }`}
                    >
                      <div className="absolute right-2 top-2 text-2xl opacity-10">🐱</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🐱</span>
                        <h4 className="font-bold text-xs text-pink-700 uppercase tracking-tight">TEMA KUCING</h4>
                      </div>
                      <p className="text-[10px] text-gray-400">Sentuhan pink ceria dengan jejak cakar kaki kucing, ikan mas hias, meongan lucu, serta icon menu bercakar imut.</p>
                      {appTheme === 'kucing' && (
                        <span className="text-[9px] bg-pink-500 text-white px-2 py-0.5 rounded-md font-bold uppercase w-fit font-mono mt-auto">Aktif 🐱</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Custom Logo Customizer Block */}
                <div className="bg-white rounded-[32px] p-6 border border-pink-100 shadow-xl shadow-pink-500/[0.02] space-y-5 select-none font-sans mt-8" id="alina-logo-customizer-wrapper">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#EC4899] animate-pulse" />
                    <h3 className="font-extrabold text-xs uppercase tracking-widest text-[#EC4899]">
                      KUSTOMISASI LOGO APLIKASI
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Personalisasikan portal Alina Enterprise WMS & OMS Anda dengan menggunakan logo bisnis sendiri. Logo ini akan terintegrasi otomatis di halaman login utama serta header bar navigasi portal.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
                    {/* Visual Preview Card */}
                    <div className="bg-pink-50/20 rounded-2xl p-5 border border-pink-100/40 flex flex-col items-center justify-center space-y-4 text-center">
                      <span className="text-[10px] text-pink-600 font-bold uppercase tracking-wider">PREVIEW LOGO ANDA</span>
                      
                      <div className="relative">
                        {sheetsConfig.customLogoUrl ? (
                          <div className="relative group">
                            <img 
                              src={sheetsConfig.customLogoUrl} 
                              alt="Custom Logo Preview" 
                              className="w-24 h-24 rounded-full object-cover shadow-lg border-2 border-pink-100 bg-white"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold">Logo Aktif</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#EC4899] via-pink-400 to-white p-0.5 shadow-lg border border-pink-200 flex items-center justify-center select-none">
                            <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-1 font-sans">
                              <span className="text-[16px] font-black tracking-tight bg-gradient-to-r from-[#EC4899] to-pink-400 bg-clip-text text-transparent leading-none">Alina</span>
                              <span className="text-[9px] font-bold text-[#EC4899] tracking-wider uppercase mt-1">Official</span>
                            </div>
                          </div>
                        )}
                        <span className={`absolute -bottom-1 right-2 px-2.5 py-0.5 text-[9px] font-bold rounded-full text-white shadow-sm ${sheetsConfig.customLogoUrl ? 'bg-emerald-500' : 'bg-pink-500 animate-pulse'}`}>
                          {sheetsConfig.customLogoUrl ? 'Kustom' : 'Default'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <strong className="text-xs text-gray-800 font-black block">
                          {sheetsConfig.customLogoUrl ? 'Merek kustom Anda Aktif' : 'Menggunakan Visual Karakter Alina'}
                        </strong>
                        <p className="text-[10px] text-gray-400 max-w-[240px] leading-relaxed">
                          {sheetsConfig.customLogoUrl 
                            ? 'Dimensi logo telah disesuaikan secara dinamis agar presisi di seluruh elemen antarmuka.' 
                            : 'Unggah file gambar pilihan Anda langsung atau sematkan URL gambar pilihan Anda.'}
                        </p>
                      </div>

                      {sheetsConfig.customLogoUrl && (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = { ...sheetsConfig, customLogoUrl: '' };
                            handleSaveSheetsConfig(updated);
                          }}
                          className="text-[10px] text-red-500 hover:text-red-700 font-bold underline cursor-pointer hover:no-underline"
                        >
                          Reset ke Logo Bawaan
                        </button>
                      )}
                    </div>

                    {/* Inputs & Tutorials */}
                    <div className="space-y-4">
                      {/* File Upload Selector */}
                      <div className="space-y-1.5">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block">Metode 1: Unggah File Gambar Langsung</label>
                        <div className="border border-dashed border-pink-250 hover:border-pink-400 rounded-2xl p-4 transition-all duration-200 text-center relative group cursor-pointer bg-[#FFFBFD]">
                          <input 
                            type="file" 
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                if (file.size > 2 * 1024 * 1024) {
                                  alert("Ukuran gambar terlalu besar! Harap unggah logo maksimal 2MB agar loading sistem tetap super cepat.");
                                  return;
                                }
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    const updated = { ...sheetsConfig, customLogoUrl: reader.result };
                                    handleSaveSheetsConfig(updated).then((success) => {
                                      if (success) {
                                        alert("Logo default berhasil disimpan ke database utama!");
                                      }
                                    });
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                          />
                          <div className="space-y-1 select-none pointer-events-none">
                            <span className="text-xl">📁</span>
                            <p className="text-[11px] font-bold text-pink-600 group-hover:text-pink-700">Pilih / Seret File Logo Anda</p>
                            <p className="text-[9px] text-gray-400 leading-snug">Mendukung JPEG, PNG, SVG (Maks. 2MB). Disimpan aman otomatis.</p>
                          </div>
                        </div>
                      </div>

                      {/* URL Source Input */}
                      <div className="space-y-1.5" id="custom-logo-url-input-container">
                        <label className="text-[11px] font-bold text-gray-700 uppercase tracking-wide block">Metode 2: Menggunakan Link / Google Drive URL</label>
                        <div className="flex gap-2">
                          <input
                            id="custom-logo-url-input"
                            type="url"
                            placeholder="https://drive.google.com/uc?export=view&id=..."
                            defaultValue={sheetsConfig.customLogoUrl && !sheetsConfig.customLogoUrl.startsWith('data:') ? sheetsConfig.customLogoUrl : ''}
                            className="bg-[#FFF8FB] border border-pink-100 hover:border-pink-300 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:border-pink-500 transition-all flex-1"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                const target = e.currentTarget;
                                let val = target.value.trim();
                                if (val) {
                                  if (val.includes('drive.google.com') && !val.includes('export=view')) {
                                    const match = val.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                                    if (match && match[1]) {
                                      val = `https://drive.google.com/uc?export=view&id=${match[1]}`;
                                      target.value = val;
                                    }
                                  }
                                  const updated = { ...sheetsConfig, customLogoUrl: val };
                                  handleSaveSheetsConfig(updated).then((success) => {
                                    if (success) {
                                      alert("Logo default berhasil diperbarui menggunakan Link!");
                                    }
                                  });
                                }
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const inputEl = document.getElementById('custom-logo-url-input') as HTMLInputElement;
                              if (inputEl) {
                                let val = inputEl.value.trim();
                                if (!val) {
                                  alert("Harap masukkan URL logo yang valid terlebih dahulu!");
                                  return;
                                }
                                if (val.includes('drive.google.com') && !val.includes('export=view')) {
                                  const match = val.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
                                  if (match && match[1]) {
                                    val = `https://drive.google.com/uc?export=view&id=${match[1]}`;
                                    inputEl.value = val;
                                  }
                                }
                                const updated = { ...sheetsConfig, customLogoUrl: val };
                                handleSaveSheetsConfig(updated).then((success) => {
                                  if (success) {
                                    alert("Logo default berhasil diperbarui menggunakan Link!");
                                  }
                                });
                              }
                            }}
                            className="bg-[#111827] hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition cursor-pointer font-sans shrink-0"
                          >
                            Terapkan
                          </button>
                        </div>
                        <p className="text-[9px] text-gray-400">Tekan tombol <strong className="text-pink-600">Terapkan</strong> atau tekan <strong className="text-gray-600">Enter</strong> untuk menyimpan.</p>
                      </div>

                      {/* Accordion Tutorial Google Drive */}
                      <details className="group border border-pink-100/50 rounded-2xl bg-pink-50/10 overflow-hidden">
                        <summary className="flex items-center justify-between p-3 text-[11px] font-bold text-pink-700 cursor-pointer hover:bg-pink-50/30 transition select-none">
                          <span className="flex items-center gap-1.5 font-sans">💡 Tutorial Integrasi via Google Drive</span>
                          <span className="transition duration-200 group-open:-rotate-180 text-pink-400">▼</span>
                        </summary>
                        <div className="p-3 pt-0 text-[10px] text-gray-500 leading-relaxed space-y-2 border-t border-pink-50/50 font-sans">
                          <ol className="list-decimal pl-4 space-y-1">
                            <li>Unggah file logo ke <strong>Google Drive</strong> Anda.</li>
                            <li>Klik kanan pada file → Pilih <strong>Bagikan (Share)</strong>.</li>
                            <li>Ubah akses umum menjadi <strong>Siapa saja yang memiliki link (Anyone with the link)</strong> sebagai Viewer (Penglihat).</li>
                            <li>Salin link bagikan tersebut (Contoh: <code className="bg-white px-1 border border-pink-100 rounded text-pink-600 block my-0.5 truncate select-all">https://drive.google.com/file/d/ID_FILE/view?usp=sharing</code>).</li>
                            <li>Sematkan link tersebut ke kolom input Metode 2 di atas. Sistem Alina akan otomatis mengonversi ke link direct image untuk Anda!</li>
                          </ol>
                        </div>
                      </details>

                    </div>
                  </div>
                </div>



                <div className="mt-8 border-t border-pink-50 pt-8" id="alina-backup-center-wrapper">
                  <BackupCenter
                    isOfflineMode={false}
                    onRestore={async (importedDb) => {
                      try {
                        const res = await fetch('/api/settings/restore', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            importedDb, 
                            user: { name: currentUser?.Full_Name, role: currentUser?.Role } 
                          })
                        });
                        if (res.ok) {
                          safeLocalStorage.setItem('alina_local_full_db', JSON.stringify(importedDb));
                          setProducts(importedDb.products || []);
                          setOrders(importedDb.orders || []);
                          setCustomers(importedDb.customers || []);
                          setStockIn(importedDb.stockIn || []);
                          setStockOut(importedDb.stockOut || []);
                          setStockOpname(importedDb.stockOpname || []);
                          setUsers(importedDb.users || []);
                          setActivityLog(importedDb.activityLog || []);
                          if (importedDb.sheetsConfig) {
                            setSheetsConfig(importedDb.sheetsConfig);
                          }
                          return true;
                        } else {
                          const data = await res.json();
                          alert('Gagal memulihkan database: ' + (data.error || 'Server error'));
                          return false;
                        }
                      } catch (err) {
                        console.error("Gagal melakukan pemulihan backup database:", err);
                        alert('Gagal terhubung ke server untuk memulihkan database.');
                        return false;
                      }
                    }}
                  />
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>

      </div>

      {/* HARDWARE OVERLAY PICKING & PACKING CONFIRMATION MODAL STATION */}
      {activePackOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden text-left shadow-2xl border border-pink-500/20 p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-pink-50 pb-3">
              <div>
                <span className="text-[9px] bg-[#FFF3F8] text-[#EC4899] font-black px-2 py-0.5 rounded uppercase">WMS Packing Station</span>
                <h3 className="font-extrabold text-sm text-gray-905 block mt-1">VERIFIKASI PACKING ORDER: {activePackOrder.Order_Number}</h3>
              </div>
              <button onClick={() => setActivePackOrder(null)} className="text-gray-400 hover:text-black font-extrabold text-sm">&times;</button>
            </div>

            <div className="p-3 bg-pink-50 rounded-xl space-y-2 text-xs">
              <p className="font-bold text-pink-700">📦 DATA PRODUK (MULTI-ITEM):</p>
              <div className="divide-y divide-pink-100/40 space-y-1.5 max-h-32 overflow-y-auto">
                {orders.filter(item => item.Order_Number === activePackOrder.Order_Number).map((item, idx) => (
                  <div key={idx} className="pt-1.5 first:pt-0 text-[11px]">
                    <p className="text-gray-800 font-extrabold uppercase">{item.Product}</p>
                    <p className="font-mono text-[10px] text-gray-500">SKU: {item.SKU} | Kuantitas: {item.Qty} Pcs @ {formatIDR(item.Price)}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2 select-none text-xs">
              {Object.keys(packChecklist).map((key) => (
                <label 
                  key={key} 
                  className="flex items-center gap-2.5 p-2 bg-[#FFF8FB] rounded-xl border border-pink-100/40 cursor-pointer hover:bg-[#FFF3F8]"
                >
                  <input
                    type="checkbox"
                    checked={packChecklist[key]}
                    onChange={() => handleTogglePackItem(key)}
                    className="w-4 h-4 text-[#EC4899] border-gray-300 rounded focus:ring-pink-500"
                  />
                  <span className={`font-medium ${packChecklist[key] ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                    {key}
                  </span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleConfirmPackCompleted}
                className="flex-1 bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-2.5 px-4 rounded-xl cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" /> Seal & Seald Ready to Ship
              </button>
              
              <button
                onClick={() => setActivePackOrder(null)}
                className="bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-2.5 px-4 rounded-xl cursor-pointer text-xs"
              >
                Kembali
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DETAIL ORDER STATION & PRINTING MODAL LAYOUT */}
      {activeDetailOrderNum && (() => {
        const relatedItems = orders.filter(item => item.Order_Number === activeDetailOrderNum);
        if (relatedItems.length === 0) return null;
        
        const rep = relatedItems[0];
        const totalSum = relatedItems.reduce((acc, item) => acc + item.Total, 0);
        const totalQty = relatedItems.reduce((acc, item) => acc + item.Qty, 0);
        
        // Find activity logs mentioning this order number
        const logs = activityLog.filter(log => {
          const detailStr = activeDetailOrderNum.toLowerCase();
          const activityStr = (log.Activity || "").toLowerCase();
          return activityStr.includes(detailStr);
        });

        let statClass = "bg-gray-100 text-gray-700";
        if (rep.Status === 'New Order') statClass = "bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded";
        if (rep.Status === 'Processing') statClass = "bg-blue-50 text-blue-600 font-bold px-2 py-0.5 rounded";
        if (rep.Status === 'Picking') statClass = "bg-purple-50 text-purple-600 font-bold px-2 py-0.5 rounded";
        if (rep.Status === 'Packing') statClass = "bg-[#FFF3F8] text-[#EC4899] font-black px-2 py-0.5 rounded";
        if (rep.Status === 'Ready To Ship') statClass = "bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded";
        if (rep.Status === 'Shipped') statClass = "bg-indigo-50 text-indigo-600 font-bold px-2 py-0.5 rounded";
        if (rep.Status === 'Completed') statClass = "bg-green-100 text-green-800 font-bold px-2 py-0.5 rounded";
        if (rep.Status === 'Cancelled') statClass = "bg-red-50 text-red-500 line-through px-2 py-0.5 rounded";

        // Channel decoration
        let channelClass = "bg-gray-100 text-gray-600 border-gray-200";
        if (rep.Channel === 'Shopee') channelClass = "bg-orange-50 text-orange-600 border border-orange-100";
        else if (rep.Channel === 'TikTok & Tokopedia') channelClass = "bg-indigo-50 text-indigo-600 border border-indigo-100";
        else if (['Retail IG', 'Ecer'].includes(rep.Channel)) channelClass = "bg-pink-50 text-pink-600 border border-pink-100";
        else if (['Reseller', 'Agen', 'Marketer'].includes(rep.Channel)) channelClass = "bg-cyan-50 text-cyan-600 border border-cyan-100";
        else if (rep.Channel === 'Distributor') channelClass = "bg-amber-50 text-amber-600 border border-amber-100";

        return (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
            <div className="bg-white rounded-[32px] w-full max-w-lg overflow-hidden text-left shadow-2xl border border-pink-100 p-6 space-y-4 max-h-[92vh] overflow-y-auto">
              <div className="flex justify-between items-start border-b border-pink-50 pb-3">
                <div>
                  <span className="text-[10px] font-mono font-bold text-gray-400 block uppercase">Fulfillment Station Detail</span>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block text-[9px] font-black rounded px-1.5 py-0.5 border leading-none uppercase ${channelClass}`}>
                      {rep.Channel}
                    </span>
                    <h3 className="font-extrabold text-gray-900 font-mono text-sm md:text-base">
                      {activeDetailOrderNum}
                    </h3>
                  </div>
                </div>
                <button onClick={() => setActiveDetailOrderNum(null)} className="text-gray-400 hover:text-black font-extrabold text-sm p-1">&times;</button>
              </div>

              {/* Top Summary Cards */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                  <p className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Metode & Pelanggan</p>
                  <p className="font-extrabold text-gray-900 uppercase">{rep.Customer}</p>
                  <p className="text-[10px] text-gray-450 font-mono font-medium">Channel: {rep.Channel}</p>
                </div>
                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 space-y-1">
                  <p className="text-gray-400 font-bold uppercase text-[9px] tracking-wider">Informasi Transaksi</p>
                  <p className="font-mono text-xs font-extrabold text-pink-600">{formatIDR(totalSum)}</p>
                  <p className="text-[10px] text-gray-500 font-bold mt-1">🗓 {new Date(rep.Order_Date).toLocaleDateString()} {new Date(rep.Order_Date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                </div>
              </div>

              {/* Order Status Display */}
              <div className="flex items-center justify-between p-3 bg-pink-50/40 rounded-2xl border border-pink-100/40 text-xs">
                <span className="text-gray-500 font-bold uppercase text-[10px]">Status Saat Ini:</span>
                <span className={`px-2.5 py-1 rounded text-[10px] uppercase font-black tracking-wider ${statClass}`}>
                  {rep.Status}
                </span>
              </div>

              {/* Itemized Table */}
              <div className="space-y-2 text-xs">
                <p className="font-bold text-gray-700 uppercase text-[10px] tracking-wider border-b border-pink-50 pb-1 flex justify-between">
                  <span>Daftar Item Rincian ({totalQty} Pcs)</span>
                  <span className="font-mono font-normal">WMS SKU Registered</span>
                </p>
                <div className="divide-y divide-pink-50/40 space-y-2 max-h-48 overflow-y-auto pr-1">
                  {relatedItems.map((item, idx) => (
                    <div key={idx} className="pt-2 first:pt-0 flex justify-between items-start gap-4">
                      <div>
                        <p className="text-gray-805 font-bold uppercase text-xs">{item.Product}</p>
                        <p className="font-mono text-[10px] text-gray-400 mt-0.5">
                          SKU: {item.SKU}
                        </p>
                        <span className="text-[10px] text-gray-505 font-bold font-mono">
                          {item.Qty} Pcs x {formatIDR(item.Price)}
                        </span>
                      </div>
                      <span className="font-mono text-xs font-black text-gray-900 shrink-0 mt-1">
                        {formatIDR(item.Total)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Code128 SVG Barcode Display */}
              {(() => {
                const { path, width } = generateCode128SvgPath(activeDetailOrderNum);
                return (
                  <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100 text-center flex flex-col items-center">
                    <span className="text-[9px] font-mono font-bold text-gray-400 mb-2">IDENTIFIER DE FASHION CODE128 TAG</span>
                    <svg width="220" height="48" viewBox={`0 0 ${width} 65`} className="mx-auto block">
                      <path d={path} stroke="#111827" strokeWidth="2" />
                    </svg>
                    <span className="text-[10px] font-mono font-bold mt-1 tracking-widest text-[#EC4899]">{activeDetailOrderNum}</span>
                  </div>
                );
              })()}

              {/* Real WMS Audit Logs Timeline Section */}
              <div className="space-y-2 text-xs">
                <p className="font-bold text-gray-700 uppercase text-[10px] tracking-wider border-b border-pink-50 pb-1">
                  Riwayat Aktivitas & Workflow Logs
                </p>
                <div className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {logs.length === 0 ? (
                    <p className="text-gray-400 italic text-[10px]">Belum ada catatan aktivitas untuk pesanan ini.</p>
                  ) : (
                    <div className="border-l border-pink-100 pl-3.5 space-y-3 py-1 text-left">
                      {logs.map((log, idx) => (
                        <div key={`${log.Log_ID || 'detail-log'}-${idx}`} className="relative">
                          <div className="absolute -left-[19.5px] top-1 w-2 h-2 rounded-full bg-[#EC4899] ring-4 ring-pink-50" />
                          <span className="text-[9px] font-mono font-bold bg-[#FFF3F8] text-[#EC4899] px-1.5 py-0.5 rounded inline-block mb-1">
                            {log.Module || 'WMS'} | {new Date(log.Timestamp).toLocaleString('id-ID')}
                          </span>
                          <p className="text-gray-800 text-[11px] font-semibold">{log.Activity}</p>
                          <span className="text-[9px] text-gray-400 font-medium">Petugas: {log.User_Name} ({log.User_Role})</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2 border-t border-pink-50/60">
                <div className="flex gap-2">
                  <button
                    onClick={() => handlePrintInvoice(activeDetailOrderNum)}
                    className="flex-1 bg-[#EC4899] hover:bg-[#D93B84] text-white font-black py-2.5 px-4 rounded-xl cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-md uppercase tracking-wider transition"
                  >
                    <Printer className="w-4 h-4" /> Cetak Struk (Receipt)
                  </button>
                  <button
                    onClick={() => setActiveDetailOrderNum(null)}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-500 font-bold py-2.5 px-4 rounded-xl cursor-pointer text-xs transition"
                  >
                    Tutup Detil
                  </button>
                </div>

                {/* Status action trigger context panel inside modal */}
                {['New Order', 'Processing', 'Picking', 'Ready To Ship'].includes(rep.Status) && (
                  <div className="bg-[#FFF8FB] rounded-xl border border-pink-100/40 p-2.5 flex items-center justify-between text-[11px]">
                    <span className="font-bold text-gray-500">Tindakan Workflow:</span>
                    <div>
                      {rep.Status === 'New Order' && (
                        <button
                          onClick={() => {
                            handleUpdateOrderStatus(activeDetailOrderNum, 'Processing');
                            setActiveDetailOrderNum(null);
                          }}
                          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition cursor-pointer"
                        >
                          Proses Pesanan →
                        </button>
                      )}

                      {rep.Status === 'Processing' && (
                        <button
                          onClick={() => {
                            handleUpdateOrderStatus(activeDetailOrderNum, 'Picking');
                            setActiveDetailOrderNum(null);
                          }}
                          className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition cursor-pointer"
                        >
                          Mulai Picking 🛒
                        </button>
                      )}

                      {rep.Status === 'Picking' && (
                        <button
                          onClick={() => {
                            handleOpenPackStation(rep);
                            setActiveDetailOrderNum(null);
                          }}
                          className="bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-1 px-3 rounded-lg text-[10px] flex items-center gap-1 transition cursor-pointer"
                        >
                          <ClipboardCheck className="w-3.5 h-3.5" /> Pack Item 🎁
                        </button>
                      )}

                      {rep.Status === 'Ready To Ship' && hasPermission('shipping') && (
                        <button
                          onClick={() => {
                            setSelectedShipOrder(activeDetailOrderNum);
                            setActiveTab('shipping');
                            setActiveDetailOrderNum(null);
                          }}
                          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-1 px-3 rounded-lg text-[10px] transition cursor-pointer"
                        >
                          Atur Kurir & Resi 🚚
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* DYNAMIC SCANN MODAL TARGETS */}
      {isScanChoiceOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[110] flex items-center justify-center p-4">
          <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-pink-100 p-6 text-left space-y-6 relative animate-[fadeIn_0.15s_ease-out]">
            <button
               type="button"
               onClick={() => setIsScanChoiceOpen(false)}
               className="absolute top-4 right-4 p-2 rounded-full hover:bg-pink-50 text-gray-400 hover:text-pink-600 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[10px] bg-pink-50 text-[#EC4899] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider font-mono">
                Pilih Moda Scan Kamera
              </span>
              <h3 className="font-extrabold text-[#EC4899] text-base">ALINE LIVE SCAN SCANNER</h3>
              <p className="text-xs text-gray-500 font-sans font-medium">
                Pilih jenis transaksi pergudangan Alina sebelum memindai tag pakaian atau Kode.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-3 font-sans">
              {/* Option 1: Scan Stock In */}
              <button
                type="button"
                onClick={() => {
                  setIsScanChoiceOpen(false);
                  setSelectedTrxType('IN');
                  triggerCameraScanner("Penerimaan Stock In (Masuk)", (scanned) => {
                    setSelectedTrxType('IN');
                    setTrxSku(scanned);
                    setActiveTab('inventory');
                  });
                }}
                className="p-4 rounded-2xl border-2 border-emerald-100 hover:border-emerald-500 bg-emerald-50/10 hover:bg-emerald-50/40 text-left transition duration-250 cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center group-hover:scale-105 transition shadow-md shadow-emerald-250 flex-shrink-0">
                  <ArrowDownCircle className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 leading-tight">SCAN STOCK IN (Barang Masuk)</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Mendaftarkan stok pakaian baru masuk dari konveksi/retur ke gudang.</p>
                </div>
              </button>

              {/* Option 2: Scan Stock Out */}
              <button
                type="button"
                onClick={() => {
                  setIsScanChoiceOpen(false);
                  setSelectedTrxType('OUT');
                  triggerCameraScanner("Pengeluaran Stock Out (Keluar)", (scanned) => {
                    setSelectedTrxType('OUT');
                    setTrxSku(scanned);
                    setActiveTab('inventory');
                  });
                }}
                className="p-4 rounded-2xl border-2 border-red-100 hover:border-red-500 bg-red-50/10 hover:bg-red-50/40 text-left transition duration-250 cursor-pointer flex items-center gap-4 group"
              >
                <div className="w-12 h-12 rounded-xl bg-red-500 text-white flex items-center justify-center group-hover:scale-105 transition shadow-md shadow-red-250 flex-shrink-0">
                  <ArrowUpCircle className="w-6 h-6 stroke-[2]" />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm text-gray-900 leading-tight">SCAN STOCK OUT (Barang Keluar)</h4>
                  <p className="text-[11px] text-gray-500 mt-0.5">Mengurangi stok pakaian karena penjualan/pembagian pesanan.</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      <BarcodeScannerModal
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        productsList={products}
        onScanSuccess={(sku) => scanCallbackRef.current(sku)}
        title={scannerTitle}
      />

      {/* EDIT CUSTOMER MODAL VIEW (RBAC) */}
      {isCustomerModalOpen && editingCustomer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleSaveCustomerSubmit} className="bg-[#FFF8FB] rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-pink-500/20 p-6 text-left space-y-4">
            <h3 className="font-extrabold text-sm uppercase text-[#EC4899] border-b border-pink-50 pb-3">Profil Detil Pelanggan</h3>

            <div className="space-y-3 text-xs font-semibold text-gray-750">
              <div className="space-y-1">
                <label className="text-gray-500">Nama Lengkap Pelanggan</label>
                <input
                  type="text"
                  required
                  value={editingCustomer.Customer_Name || ''}
                  onChange={(e) => setEditingCustomer(prev => ({ ...prev!, Customer_Name: e.target.value }))}
                  className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500">Kategori Distribusi</label>
                  <select
                    value={editingCustomer.Customer_Type || 'Reseller'}
                    onChange={(e) => setEditingCustomer(prev => ({ ...prev!, Customer_Type: e.target.value as any }))}
                    className="w-full bg-white border border-pink-100 text-gray-700 rounded-xl py-2 px-3 focus:outline-none"
                  >
                    <option value="Reseller">Reseller</option>
                    <option value="Agen">Agen</option>
                    <option value="Marketer">Marketer</option>
                    <option value="Konsinyasi">Konsinyasi</option>
                    <option value="Retail IG">Retail IG</option>
                    <option value="Shopee">Shopee</option>
                    <option value="TikTok & Tokopedia">TikTok & Tokopedia</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500">No Telepon WA</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.Phone || ''}
                    onChange={(e) => setEditingCustomer(prev => ({ ...prev!, Phone: e.target.value }))}
                    className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-gray-500">Email Utama</label>
                <input
                  type="email"
                  required
                  value={editingCustomer.Email || ''}
                  onChange={(e) => setEditingCustomer(prev => ({ ...prev!, Email: e.target.value }))}
                  className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500">Alamat Rumah/Gudang</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.Address || ''}
                    onChange={(e) => setEditingCustomer(prev => ({ ...prev!, Address: e.target.value }))}
                    className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500">Kota Domisili</label>
                  <input
                    type="text"
                    required
                    value={editingCustomer.City || ''}
                    onChange={(e) => setEditingCustomer(prev => ({ ...prev!, City: e.target.value }))}
                    className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="submit"
                className="flex-1 bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-2.5 px-4 rounded-xl cursor-pointer text-xs"
              >
                Simpan Pelanggan
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsCustomerModalOpen(false);
                  setEditingCustomer(null);
                }}
                className="bg-white text-gray-500 border border-gray-200 font-bold py-2.5 px-4 rounded-xl cursor-pointer text-xs"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EDIT USER ACCOUNT MODAL (OWNER RBAC ONLY) */}
      {isUserModalOpen && editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleSaveUserSubmit} className="bg-[#FFF8FB] rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-pink-500/20 p-6 text-left space-y-4">
            <h3 className="font-extrabold text-sm uppercase text-[#EC4899] border-b border-pink-50 pb-3">Detil Kredensial Staff</h3>

            <div className="space-y-3 text-xs font-semibold text-gray-750">
              <div className="space-y-1">
                <label className="text-gray-500">Nama Lengkap Staff</label>
                <input
                  type="text"
                  required
                  value={editingUser.Full_Name || ''}
                  onChange={(e) => setEditingUser(prev => ({ ...prev!, Full_Name: e.target.value }))}
                  className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-500">Email Login</label>
                <input
                  type="email"
                  required
                  value={editingUser.Email || ''}
                  onChange={(e) => setEditingUser(prev => ({ ...prev!, Email: e.target.value }))}
                  className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-gray-500">Password Baru (Biarkan kosong jika tidak dirubah)</label>
                <input
                  type="password"
                  placeholder="Password..."
                  value={editingUser.Password || ''}
                  onChange={(e) => setEditingUser(prev => ({ ...prev!, Password: e.target.value }))}
                  className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-gray-500">Role Sistem</label>
                  <select
                    value={editingUser.Role || 'ADMIN'}
                    onChange={(e) => setEditingUser(prev => ({ ...prev!, Role: e.target.value as any }))}
                    className="w-full bg-white border border-pink-100 text-gray-700 rounded-xl py-2 px-3 focus:outline-none"
                  >
                    <option value="OWNER">OWNER (Full Privileges)</option>
                    <option value="ADMIN">ADMIN (Operasional Gudang)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-500">Kondisi Akun</label>
                  <select
                    value={editingUser.Status || 'Active'}
                    onChange={(e) => setEditingUser(prev => ({ ...prev!, Status: e.target.value as any }))}
                    className="w-full bg-white border border-pink-100 text-gray-700 rounded-xl py-2 px-3 focus:outline-none"
                  >
                    <option value="Active">Aktif</option>
                    <option value="Inactive">Non-Aktifkan</option>
                  </select>
                </div>
              </div>

              {/* Hak Akses Modul Checkboxes */}
              <div className="space-y-2 border-t border-pink-100 pt-3">
                <label className="text-gray-500 font-bold block text-xs uppercase tracking-wider">Akses Modul / Layar</label>
                {editingUser.Role === 'OWNER' ? (
                  <div className="bg-pink-50 text-[#EC4899] text-[11px] font-bold p-3 rounded-2xl border border-pink-100">
                    💡 Akun OWNER otomatis memiliki hak akses penuh ke seluruh modul sistem operasional Alina.
                  </div>
                ) : (
                  <>
                    <p className="text-[10px] text-gray-400 font-medium">Beri centang pada modul yang diperbolehkan untuk diakses staff:</p>
                    <div className="grid grid-cols-2 gap-2 bg-pink-50/40 p-3 rounded-2xl border border-pink-100/40">
                      {[
                        { id: 'dashboard', label: 'Dashboard / Ringkasan' },
                        { id: 'products', label: 'Catalog (Master Produk)' },
                        { id: 'inventory', label: 'Stock Trx (WMS Gudang)' },
                        { id: 'opname', label: 'Opname (Stock Opname)' },
                        { id: 'orders', label: 'Orders (OMS Sales)' },
                        { id: 'shipping', label: 'Shipping / Kurir' },
                        { id: 'reports', label: 'Reports (Finansial)' },
                        { id: 'customers', label: 'Customers (Pelanggan)' },
                        { id: 'settings', label: 'Sheets Connection' },
                      ].map((mod, idx) => {
                        const curPerms = editingUser.Permissions || ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"];
                        const isChecked = curPerms.includes(mod.id);
                        return (
                          <label key={`${mod.id}-${idx}`} className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-750 hover:text-black font-bold">
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={(e) => {
                                let nextPerms: string[];
                                if (e.target.checked) {
                                  nextPerms = [...curPerms, mod.id];
                                } else {
                                  nextPerms = curPerms.filter(p => p !== mod.id);
                                }
                                setEditingUser(prev => ({ ...prev!, Permissions: nextPerms }));
                              }}
                              className="w-3.5 h-3.5 rounded border-pink-300 text-[#EC4899] accent-[#EC4899]"
                            />
                            <span>{mod.label}</span>
                          </label>
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="flex gap-2 pt-3">
              <button
                type="submit"
                className="flex-1 bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-2.5 px-4 rounded-xl cursor-pointer text-xs"
              >
                Simpan Kredensial Staff
              </button>
              
              <button
                type="button"
                onClick={() => {
                  setIsUserModalOpen(false);
                  setEditingUser(null);
                }}
                className="bg-white text-gray-500 border border-gray-200 font-bold py-2.5 px-4 rounded-xl cursor-pointer text-xs"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export type AppTheme = 'default' | 'ios' | 'ayam' | 'kucing';

export const T = (theme: AppTheme) => {
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
    text: isIos ? 'text-slate-900' : isAyam ? 'text-orange-600' : isKucing ? 'text-amber-800' : 'text-pink-500',
    textMuted: isIos ? 'text-slate-500' : isAyam ? 'text-orange-500 font-bold' : isKucing ? 'text-amber-700 font-bold' : 'text-pink-600',
    textHover: isIos ? 'hover:text-black' : isAyam ? 'hover:text-orange-500' : isKucing ? 'hover:text-amber-700' : 'hover:text-pink-500',
    bg: isIos ? 'bg-black' : isAyam ? 'bg-orange-600' : isKucing ? 'bg-amber-800' : 'bg-pink-500',
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
    borderLeftAccent: isIos ? 'border-slate-900' : isAyam ? 'border-orange-600' : isKucing ? 'border-amber-800' : 'border-pink-500',
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
      ? 'text-sm bg-white/10 text-slate-100 font-bold tracking-wide' 
      : isAyam 
      ? 'text-sm bg-orange-700/40 text-orange-50 font-bold shadow-sm'
      : isKucing
      ? 'text-sm bg-white/15 text-amber-100 font-bold shadow-sm'
      : 'text-sm bg-white/20 text-white',

    // Buttons
    buttonSecondary: isIos
      ? 'bg-white hover:bg-slate-100/70 text-slate-950 border border-slate-200/80 shadow-sm'
      : isAyam
      ? 'bg-white hover:bg-orange-50 text-orange-600 border border-orange-200 shadow-sm'
      : isKucing
      ? 'bg-white hover:bg-amber-50 text-amber-900 border border-amber-200 shadow-sm'
      : 'bg-white hover:bg-pink-50 text-pink-500 border border-pink-100/60 shadow-sm',

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


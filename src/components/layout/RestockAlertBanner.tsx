import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface RestockAlertBannerProps {
  restockAlertsCount: number;
  hasPermission: (tabId: string) => boolean;
  setActiveTab: (tab: string) => void;
}

export default function RestockAlertBanner({
  restockAlertsCount,
  hasPermission,
  setActiveTab
}: RestockAlertBannerProps) {
  if (restockAlertsCount === 0) return null;

  return (
    <div className="bg-gradient-to-r from-red-500/10 via-amber-500/5 to-transparent border-l-4 border-red-500 p-4 rounded-r-2xl flex items-center justify-between text-xs my-3 animate-pulse">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-5 h-5 text-red-500" />
        <div>
          <p className="font-bold text-gray-900">RESTOCK FORECAST ALERT REQUIRED</p>
          <p className="text-gray-500 font-mono text-sm">{restockAlertsCount} SKU diprediksi habis dalam 14 hari kedepan!</p>
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
  );
}

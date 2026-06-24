
import React from 'react';
import { Filter, AlertTriangle } from 'lucide-react';
import { Product } from '../types.ts';

interface ReportsPageProps {
  products: Product[];
  hasPermission: (perm: string) => boolean;
  reportsFilter: string;
  setReportsFilter: (val: string) => void;
  restockAlertsCount: number;
  restockForecastList: any[];
  categoryList: string[];
  activityLog: any[];
}

export default function ReportsPage({
  products,
  hasPermission,
  reportsFilter,
  setReportsFilter,
  restockAlertsCount,
  restockForecastList,
  categoryList,
  activityLog
}: ReportsPageProps) {
  return (
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
  );
}

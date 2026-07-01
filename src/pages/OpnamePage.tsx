
import React from 'react';
import { Product, StockOpname } from '../types.ts';
import { Package, CheckCircle } from 'lucide-react';

interface OpnamePageProps {
  products: Product[];
  stockOpname: StockOpname[];
  activeStockOpnameMonth: string;
  setActiveStockOpnameMonth: (val: string) => void;
  opnameQuantities: Record<string, string>;
  setOpnameQuantities: (val: React.SetStateAction<Record<string, string>>) => void;
  handleSaveOpnameSubmit: (sku: string, userVal: string) => void;
  hasPermission: (perm: string) => boolean;
}

export default function OpnamePage({
  products,
  stockOpname,
  activeStockOpnameMonth,
  setActiveStockOpnameMonth,
  opnameQuantities,
  setOpnameQuantities,
  handleSaveOpnameSubmit,
  hasPermission
}: OpnamePageProps) {
  return (
              <div className="space-y-6 text-left">
                
                {/* Headers configuration */}
                <div className="bg-pink-50 p-5 rounded-[32px] border border-pink-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
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
                      className="bg-pink-50 text-pink-500 font-bold py-1 px-3.5 rounded-lg outline-none cursor-pointer text-xs"
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
                    <span className="text-sm text-gray-400 font-mono font-bold">Wajib verifikasi per SKU</span>
                  </div>

                  {/* Responsive Dual View for Stock Opname to prevent horizontal scrolling on mobile */}
                  <div>
                    {/* 1. DESKTOP VIEW: TABLE LAYOUT FOR md SCREEN OR HIGHER */}
                    <div className="hidden md:block overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-pink-50 font-mono text-gray-400 uppercase tracking-widest text-sm">
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
                              <tr key={p.SKU || `opn-${idxP}`} className="hover:bg-pink-50 text-gray-750 font-medium">
                                <td className="py-3 px-2">
                                  <div className="font-bold text-gray-900">{p.Product_Name}</div>
                                  <div className="text-sm font-mono text-pink-500">{p.SKU}</div>
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
                                      className="w-24 bg-pink-50 border border-pink-100 rounded-lg py-1 px-2.5 outline-none font-mono text-center font-bold text-gray-900"
                                    />
                                  )}
                                </td>
                                <td className="py-3 px-3 text-center">
                                  {hasRecorded ? (
                                    <span className={`inline-block py-1.5 px-4 rounded-xl text-sm font-bold ${colorClass}`}>
                                      {tagText}: {displayDiff} Pcs
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 italic">Unprocessed</span>
                                  )}
                                </td>
                                <td className="py-3 px-2 text-right">
                                  {hasRecorded ? (
                                    <span className="text-sm text-gray-400 font-mono">Recorded {new Date(historicalRecord.Date).toLocaleDateString()}</span>
                                  ) : (
                                    <button
                                      onClick={() => handleSaveOpnameSubmit(p.SKU, userVal)}
                                      className="bg-[#111827] hover:bg-black text-white font-semibold py-1 px-3 rounded-lg text-sm transition cursor-pointer"
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
                              <div className="text-sm font-mono text-pink-500 font-bold mt-1">SKU: {p.SKU}</div>
                            </div>

                            {/* Details Grid */}
                            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-pink-50/40">
                              <div className="p-2 bg-gray-50 rounded-xl space-y-0.5 border border-gray-100/60">
                                <span className="text-xs font-bold text-gray-400 uppercase">Stok Sistem</span>
                                <div className="font-mono font-extrabold text-gray-900 text-xs">{currentSystemStock} Pcs</div>
                              </div>
                              <div className="p-2 bg-gray-50 rounded-xl space-y-0.5 border border-gray-100/60">
                                <span className="text-xs font-bold text-gray-400 uppercase">Selisih (Diff)</span>
                                <div>
                                  {hasRecorded ? (
                                    <span className={`inline-block py-0.5 px-2 rounded-lg text-xs font-bold ${colorClass}`}>
                                      {tagText}: {displayDiff}
                                    </span>
                                  ) : (
                                    <span className="text-gray-400 italic text-sm">Belum diproses</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Count action bottom area */}
                            <div className="pt-2 border-t border-pink-50/30 flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-2">
                              <div>
                                <span className="text-xs font-bold text-gray-400 block mb-1 uppercase">Jumlah Hitung Fisik</span>
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
                                    className="w-full sm:w-32 bg-pink-50 border border-pink-200 rounded-lg py-1.5 px-3 outline-none font-mono font-bold text-gray-900 text-xs"
                                  />
                                )}
                              </div>

                              <div className="flex items-end justify-end">
                                {hasRecorded ? (
                                  <span className="text-xs text-gray-400 font-bold block text-right mt-1">
                                    ✓ Recorded {new Date(historicalRecord.Date).toLocaleDateString()}
                                  </span>
                                ) : (
                                  <button
                                    onClick={() => handleSaveOpnameSubmit(p.SKU, userVal)}
                                    className="w-full sm:w-auto bg-[#111827] hover:bg-black text-white font-black py-2 px-4 rounded-xl text-sm transition cursor-pointer uppercase tracking-wider text-center"
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
  );
}

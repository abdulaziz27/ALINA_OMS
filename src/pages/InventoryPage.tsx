
import React from 'react';
import { Package, Barcode, ChevronDown, CheckCircle, Search, X } from 'lucide-react';
import { Product, StockIn, StockOut, Customer } from '../types.ts';

interface InventoryPageProps {
  products: Product[];
  customers: Customer[];
  stockIn: StockIn[];
  stockOut: StockOut[];
  selectedTrxType: 'IN' | 'OUT';
  setSelectedTrxType: (val: 'IN' | 'OUT') => void;
  trxSku: string;
  setTrxSku: (val: string) => void;
  trxQty: string;
  setTrxQty: (val: string) => void;
  trxQuality: string;
  setTrxQuality: (val: string) => void;
  trxOutQuality: string;
  setTrxOutQuality: (val: string) => void;
  trxSource: string;
  setTrxSource: (val: string) => void;
  trxDestination: string;
  setTrxDestination: (val: string) => void;
  trxCustomer: string;
  setTrxCustomer: (val: string) => void;
  trxNotes: string;
  setTrxNotes: (val: string) => void;
  handleRecordStockTrxSubmit: (e: React.FormEvent) => void;
  triggerCameraScanner: (title: string, onScan: (result: string) => void) => void;
  setActiveTab: (tab: string) => void;
  stockSkuDropdownOpen: boolean;
  setStockSkuDropdownOpen: (val: boolean) => void;
  stockSkuSearch: string;
  setStockSkuSearch: (val: string) => void;
  getColorsByCategory: (cat: string) => any[];
}

export default function InventoryPage({
  products,
  customers,
  stockIn,
  stockOut,
  selectedTrxType,
  setSelectedTrxType,
  trxSku,
  setTrxSku,
  trxQty,
  setTrxQty,
  trxQuality,
  setTrxQuality,
  trxOutQuality,
  setTrxOutQuality,
  trxSource,
  setTrxSource,
  trxDestination,
  setTrxDestination,
  trxCustomer,
  setTrxCustomer,
  trxNotes,
  setTrxNotes,
  handleRecordStockTrxSubmit,
  triggerCameraScanner,
  setActiveTab,
  stockSkuDropdownOpen,
  setStockSkuDropdownOpen,
  stockSkuSearch,
  setStockSkuSearch,
  getColorsByCategory
}: InventoryPageProps) {
  return (
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
  );
}

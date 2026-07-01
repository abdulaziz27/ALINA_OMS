
import React from 'react';
import SheetsLinker from '../components/SheetsLinker.tsx';
import BackupCenter from '../components/BackupCenter.tsx';
import { Product, Order, Customer, StockIn, StockOut, StockOpname, User, ActivityLog, SheetsConfig } from '../types.ts';

// Helper
const safeLocalStorage = {
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn("localStorage not available");
    }
  }
};

function saveLocalDB(db: any) {
  localStorage.setItem('alina_local_full_db', JSON.stringify(db));
  window.dispatchEvent(new CustomEvent('alina_db_offline_update'));
}

interface SettingsPageProps {
  appTheme: string;
  setAppTheme: (theme: string) => void;
  sheetsConfig: SheetsConfig;
  handleSaveSheetsConfig: (config: SheetsConfig) => Promise<boolean>;
  handleSyncSheetsNow: () => Promise<{ success: boolean; message: string; }>;
  isOfflineMode: boolean;
  setProducts: (data: Product[]) => void;
  setOrders: (data: Order[]) => void;
  setCustomers: (data: Customer[]) => void;
  setStockIn: (data: StockIn[]) => void;
  setStockOut: (data: StockOut[]) => void;
  setStockOpname: (data: StockOpname[]) => void;
  setUsers: (data: User[]) => void;
  setActivityLog: (data: ActivityLog[]) => void;
  setSheetsConfig: (data: SheetsConfig) => void;
}

export default function SettingsPage({
  appTheme,
  setAppTheme,
  sheetsConfig,
  handleSaveSheetsConfig,
  handleSyncSheetsNow,
  isOfflineMode,
  setProducts,
  setOrders,
  setCustomers,
  setStockIn,
  setStockOut,
  setStockOpname,
  setUsers,
  setActivityLog,
  setSheetsConfig
}: SettingsPageProps) {
  return (
              <div className="space-y-6 animate-[fadeIn_0.25s_ease-out]">
                
                {/* Visual Customizer & Appearance Settings Card */}
                <div className="bg-white border border-pink-100 p-6 rounded-[32px] shadow-sm text-left space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    <h3 className="font-extrabold text-xs uppercase tracking-widest text-pink-500">
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
                          ? 'border-pink-500 bg-pink-50/20 shadow-sm'
                          : 'border-pink-100/70 hover:border-pink-300 bg-white'
                      }`}
                    >
                      <div className="absolute right-2 top-2 text-2xl opacity-10">🌸</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌸</span>
                        <h4 className="font-bold text-xs text-gray-900 uppercase tracking-tight">ALINA DEFAULT</h4>
                      </div>
                      <p className="text-sm text-gray-400">Desain standar Alina Enterprise. Bersih, premium, dan penuh estetika pink yang memikat mata.</p>
                      {appTheme === 'default' && (
                        <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-md font-bold uppercase w-fit font-mono mt-auto">Aktif</span>
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
                      <p className="text-sm text-gray-400">Liquid glass minimalis dengan sentuhan layout hitam-putih murni layaknya perangkat Apple modern.</p>
                      {appTheme === 'ios' && (
                        <span className="text-xs bg-slate-900 text-white px-2 py-0.5 rounded-md font-bold uppercase w-fit font-mono mt-auto">Aktif</span>
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
                          ? 'border-pink-500 bg-pink-50/20 shadow-sm'
                          : 'border-pink-100/70 hover:border-pink-300 bg-white'
                      }`}
                    >
                      <div className="absolute right-2 top-2 text-2xl opacity-10">🐔</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🐔</span>
                        <h4 className="font-bold text-xs text-pink-700 uppercase tracking-tight">TEMA AYAM</h4>
                      </div>
                      <p className="text-sm text-gray-400">Nuansa pink manis Alina dipadu dengan mandor ayam yang berkokok membawa rezeki, plus icon menu bernuansa ayam hoki.</p>
                      {appTheme === 'ayam' && (
                        <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-md font-bold uppercase w-fit font-mono mt-auto">Aktif 🐔</span>
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
                          ? 'border-pink-500 bg-pink-50/20 shadow-sm'
                          : 'border-pink-100/70 hover:border-pink-300 bg-white'
                      }`}
                    >
                      <div className="absolute right-2 top-2 text-2xl opacity-10">🐱</div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🐱</span>
                        <h4 className="font-bold text-xs text-pink-700 uppercase tracking-tight">TEMA KUCING</h4>
                      </div>
                      <p className="text-sm text-gray-400">Sentuhan pink ceria dengan jejak cakar kaki kucing, ikan mas hias, meongan lucu, serta icon menu bercakar imut.</p>
                      {appTheme === 'kucing' && (
                        <span className="text-xs bg-pink-500 text-white px-2 py-0.5 rounded-md font-bold uppercase w-fit font-mono mt-auto">Aktif 🐱</span>
                      )}
                    </button>
                  </div>
                </div>

                {/* Custom Logo Customizer Block */}
                <div className="bg-white rounded-[32px] p-6 border border-pink-100 shadow-xl shadow-pink-500/[0.02] space-y-5 select-none font-sans mt-8" id="alina-logo-customizer-wrapper">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-pink-500 animate-pulse" />
                    <h3 className="font-extrabold text-xs uppercase tracking-widest text-pink-500">
                      KUSTOMISASI LOGO APLIKASI
                    </h3>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Personalisasikan portal Alina Enterprise WMS & OMS Anda dengan menggunakan logo bisnis sendiri. Logo ini akan terintegrasi otomatis di halaman login utama serta header bar navigasi portal.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start pt-2">
                    {/* Visual Preview Card */}
                    <div className="bg-pink-50/20 rounded-2xl p-5 border border-pink-100/40 flex flex-col items-center justify-center space-y-4 text-center">
                      <span className="text-sm text-pink-600 font-bold uppercase tracking-wider">PREVIEW LOGO ANDA</span>
                      
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
                              <span className="text-white text-sm font-bold">Logo Aktif</span>
                            </div>
                          </div>
                        ) : (
                          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-[#EC4899] via-pink-400 to-white p-0.5 shadow-lg border border-pink-200 flex items-center justify-center select-none">
                            <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center p-1 font-sans">
                              <span className="text-[16px] font-black tracking-tight bg-gradient-to-r from-[#EC4899] to-pink-400 bg-clip-text text-transparent leading-none">Alina</span>
                              <span className="text-xs font-bold text-pink-500 tracking-wider uppercase mt-1">Official</span>
                            </div>
                          </div>
                        )}
                        <span className={`absolute -bottom-1 right-2 px-2.5 py-0.5 text-xs font-bold rounded-full text-white shadow-sm ${sheetsConfig.customLogoUrl ? 'bg-emerald-500' : 'bg-pink-500 animate-pulse'}`}>
                          {sheetsConfig.customLogoUrl ? 'Kustom' : 'Default'}
                        </span>
                      </div>

                      <div className="space-y-1">
                        <strong className="text-xs text-gray-800 font-black block">
                          {sheetsConfig.customLogoUrl ? 'Merek kustom Anda Aktif' : 'Menggunakan Visual Karakter Alina'}
                        </strong>
                        <p className="text-sm text-gray-400 max-w-[240px] leading-relaxed">
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
                          className="text-sm text-red-500 hover:text-red-700 font-bold underline cursor-pointer hover:no-underline"
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
                            <p className="text-xs text-gray-400 leading-snug">Mendukung JPEG, PNG, SVG (Maks. 2MB). Disimpan aman otomatis.</p>
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
                            className="bg-pink-50 border border-pink-100 hover:border-pink-300 rounded-xl py-2 px-3 text-xs text-gray-900 focus:outline-none focus:border-pink-500 transition-all flex-1"
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
                        <p className="text-xs text-gray-400">Tekan tombol <strong className="text-pink-600">Terapkan</strong> atau tekan <strong className="text-gray-600">Enter</strong> untuk menyimpan.</p>
                      </div>

                      {/* Accordion Tutorial Google Drive */}
                      <details className="group border border-pink-100/50 rounded-2xl bg-pink-50/10 overflow-hidden">
                        <summary className="flex items-center justify-between p-3 text-[11px] font-bold text-pink-700 cursor-pointer hover:bg-pink-50/30 transition select-none">
                          <span className="flex items-center gap-1.5 font-sans">💡 Tutorial Integrasi via Google Drive</span>
                          <span className="transition duration-200 group-open:-rotate-180 text-pink-400">▼</span>
                        </summary>
                        <div className="p-3 pt-0 text-sm text-gray-500 leading-relaxed space-y-2 border-t border-pink-50/50 font-sans">
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

                <SheetsLinker
                  config={sheetsConfig}
                  onSaveConfig={handleSaveSheetsConfig}
                  onTriggerSync={handleSyncSheetsNow}
                />

                <div className="mt-8 border-t border-pink-50 pt-8" id="alina-backup-center-wrapper">
                  <BackupCenter
                    isOfflineMode={isOfflineMode}
                    onRestore={async (importedDb) => {
                      try {
                        saveLocalDB(importedDb);
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
                      } catch (err) {
                        console.error("Gagal melakukan pemulihan backup database:", err);
                        return false;
                      }
                    }}
                  />
                </div>
              </div>
  );
}

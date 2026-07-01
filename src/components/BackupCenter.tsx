/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import { 
  Database, Download, Upload, Trash2, 
  RefreshCw, CheckCircle2, AlertTriangle, HelpCircle, HardDrive
} from 'lucide-react';

interface BackupCenterProps {
  onRestore: (importedDb: any) => Promise<boolean>;
  isOfflineMode: boolean;
}

export default function BackupCenter({
  onRestore,
  isOfflineMode
}: BackupCenterProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  // Export current local database to JSON file
  const handleExportDatabase = () => {
    setLoading(true);
    setStatusMsg(null);
    try {
      const dbStr = localStorage.getItem('alina_local_full_db');
      if (!dbStr) {
        setStatusMsg({ type: 'error', text: 'Tidak ada data database lokal untuk diekspor.' });
        setLoading(false);
        return;
      }

      const blob = new Blob([dbStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ALINA_WMS_OMS_Backup_${new Date().toISOString().slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setStatusMsg({ type: 'success', text: 'Database sukses diekspor! Simpan file .json ini sebagai backup aman.' });
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Gagal mengekspor database lokal.' });
    } finally {
      setLoading(false);
    }
  };

  // Trigger file upload selection
  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  // Handle uploaded JSON backup file
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setStatusMsg(null);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const rawText = event.target?.result as string;
        const parsed = JSON.parse(rawText);

        // Simple validation checks on schema
        if (!parsed.products || !parsed.users || !parsed.orders) {
          setStatusMsg({ 
            type: 'error', 
            text: 'File JSON tidak valid. Pastikan file tersebut adalah produk eksport resmi ALINA (harus mengandung tabel prasyarat: products, users, orders).' 
          });
          setLoading(false);
          return;
        }

        const success = await onRestore(parsed);
        if (success) {
          setStatusMsg({ 
            type: 'success', 
            text: `Sukses Mengimpor Database! Memulihkan ${parsed.products?.length || 0} Produk, ${parsed.orders?.length || 0} Pesanan, dan ${parsed.customers?.length || 0} Pelanggan.` 
          });
        } else {
          setStatusMsg({ type: 'error', text: 'Gagal memulihkan database ke sistem.' });
        }
      } catch (err) {
        console.error(err);
        setStatusMsg({ type: 'error', text: 'Terjadi kesalahan saat parsing JSON backup. Pastikan file tidak rusak.' });
      } finally {
        setLoading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  // Reset database back to default seed state
  const handleResetDatabase = async () => {
    if (!window.confirm('APAKAH ANDA YAKIN? Seluruh transaksi, data produk, sejarah pengiriman, dan log aktivitas akan dihapus permanen dan diganti kembali dengan database bawaan (seed data). Tindakan ini tidak bisa dibatalkan!')) {
      return;
    }

    setLoading(true);
    setStatusMsg(null);

    try {
      localStorage.removeItem('alina_local_full_db');
      // Trigger a clean hot reload to let global interceptor re-init DEFAULT_OFFLINE_DB
      window.location.reload();
    } catch (err) {
      console.error(err);
      setStatusMsg({ type: 'error', text: 'Gagal mereset database ke kondisi awal.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="alina-backup-center" className="bg-white rounded-[32px] border border-pink-100 p-6 shadow-sm space-y-5 text-left">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-pink-50">
        <div className="space-y-1">
          <span className="text-xs bg-indigo-50 text-indigo-600 font-extrabold tracking-widest uppercase px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
            <HardDrive className="w-3 h-3" /> offline-first backplane
          </span>
          <h3 className="font-bold text-sm text-gray-800 uppercase tracking-tight flex items-center gap-2">
             pusat backup & pemulihan database
          </h3>
          <p className="text-[11px] text-gray-400">
            Alternatif aman & cepat pengganti Google Sheets. Kontrol dan cadangkan seluruh data operasional Alina Anda secara lokal ke file eksternal dengan satu klik.
          </p>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          <span className={`px-2.5 py-1 rounded-full font-bold flex items-center gap-1.5 ${
            isOfflineMode ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isOfflineMode ? 'bg-amber-400 animate-pulse' : 'bg-emerald-500'}`} />
            {isOfflineMode ? 'Mode Lokal Terproteksi (Offline-First)' : 'Sistem Sinkron Online Aktif'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Export Card */}
        <div className="p-4 rounded-2xl bg-indigo-50/10 border border-indigo-100/50 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Download className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-gray-700">Ekspor Database Alina</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Unduh seluruh snapshot data produk, pelanggan, riwayat stok, orders, dan log audit saat ini ke format .json standar yang aman.
            </p>
          </div>
          <button
            onClick={handleExportDatabase}
            disabled={loading}
            className="w-full bg-[#111827] hover:bg-indigo-950 text-white font-bold py-2 px-3 rounded-xl cursor-pointer transition text-[11px] text-center flex items-center justify-center gap-1.5 shadow-sm mt-3"
          >
            <Download className="w-3.5 h-3.5" />
            Ekspor File Backup (.json)
          </button>
        </div>

        {/* Import Card */}
        <div className="p-4 rounded-2xl bg-emerald-50/10 border border-emerald-100/50 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Upload className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-gray-700">Impor Database Alina</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Unggah file backup .json Alina yang sudah diekspor sebelumnya untuk memulihkan seluruh data Anda secara instan di browser/divais mana pun.
            </p>
          </div>
          <div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              accept=".json" 
              className="hidden" 
              id="db-file-picker-hidden"
            />
            <button
              onClick={handleImportClick}
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl cursor-pointer transition text-[11px] text-center flex items-center justify-center gap-1.5 shadow-sm mt-3"
            >
              <Upload className="w-3.5 h-3.5" />
              Unggah & Pulihkan Data
            </button>
          </div>
        </div>

        {/* Danger Reset Card */}
        <div className="p-4 rounded-2xl bg-pink-50/10 border border-pink-100/50 flex flex-col justify-between space-y-3">
          <div className="space-y-1">
            <div className="w-8 h-8 rounded-full bg-pink-50 flex items-center justify-center text-pink-500">
              <Trash2 className="w-4 h-4" />
            </div>
            <h4 className="font-bold text-xs text-pink-700">Penghapusan & Seed Data</h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              Ingin melakukan uji coba ulang dari nol? Hapus seluruh data modifikasi dan reset database lokal kembali ke setelan sampel awal.
            </p>
          </div>
          <button
            onClick={handleResetDatabase}
            disabled={loading}
            className="w-full bg-pink-100 hover:bg-pink-200 text-pink-500 border border-pink-200 font-bold py-2 px-3 rounded-xl cursor-pointer transition text-[11px] text-center flex items-center justify-center gap-1.5 mt-3"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset ke Data Awal
          </button>
        </div>
      </div>

      {statusMsg && (
        <div className={`p-4 rounded-2xl border flex items-start gap-2.5 text-xs ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-50 border-emerald-100 text-emerald-800' 
            : statusMsg.type === 'error'
            ? 'bg-pink-50 border-pink-100 text-pink-500'
            : 'bg-indigo-50 border-indigo-100 text-indigo-800'
        }`}>
          {statusMsg.type === 'success' ? (
            <CheckCircle2 className="w-4.5 h-4.5 mt-0.5 text-emerald-500 flex-shrink-0" />
          ) : (
            <AlertTriangle className="w-4.5 h-4.5 mt-0.5 text-pink-500 flex-shrink-0" />
          )}
          <div className="space-y-1">
            <span className="font-extrabold block uppercase tracking-tight text-sm">
              {statusMsg.type === 'success' ? 'Berhasil' : 'Pemberitahuan Sistem'}
            </span>
            <p className="leading-relaxed text-[11px]">{statusMsg.text}</p>
          </div>
        </div>
      )}

      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 flex items-start gap-2 text-sm text-gray-400 leading-relaxed">
        <HelpCircle className="w-4 h-4 mt-0.5 text-gray-400 flex-shrink-0" />
        <p>
          <strong>💡 Tips:</strong> Backup lah data Alina Anda secara berkala (misalnya seminggu sekali/setelah tutup buku harian) dengan menu Ekspor d atas, lalu simpan file .json tersebut di laptop/Google Drive Anda. Jika browser di-clear/history dihapus, Anda tinggal mengimpornya kembali untuk memulihkan seluruh laporan & riwayat pesanan WMS/OMS Anda dalam sekejap!
        </p>
      </div>

    </div>
  );
}

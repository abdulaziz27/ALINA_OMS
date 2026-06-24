import React from 'react';
import { X, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

interface ScanChoiceModalProps {
  isOpen: boolean;
  setIsScanChoiceOpen: (open: boolean) => void;
  setSelectedTrxType: (type: 'IN' | 'OUT') => void;
  setTrxSku: (sku: string) => void;
  setActiveTab: (tab: string) => void;
  triggerCameraScanner: (title: string, callback: (sku: string) => void) => void;
}

export default function ScanChoiceModal({
  isOpen,
  setIsScanChoiceOpen,
  setSelectedTrxType,
  setTrxSku,
  setActiveTab,
  triggerCameraScanner
}: ScanChoiceModalProps) {
  if (!isOpen) return null;

  return (
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
  );
}

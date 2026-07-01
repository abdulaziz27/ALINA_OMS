import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Order } from '../../types.ts';

interface PackingStationModalProps {
  activePackOrder: Order | null;
  setActivePackOrder: (order: Order | null) => void;
  orders: Order[];
  packChecklist: Record<string, boolean>;
  handleTogglePackItem: (key: string) => void;
  handleConfirmPackCompleted: () => void;
  formatIDR: (val: number | string) => string;
}

export default function PackingStationModal({
  activePackOrder,
  setActivePackOrder,
  orders,
  packChecklist,
  handleTogglePackItem,
  handleConfirmPackCompleted,
  formatIDR
}: PackingStationModalProps) {
  if (!activePackOrder) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-[110] flex items-center justify-center p-4">
      <div className="bg-white rounded-[32px] w-full max-w-md overflow-hidden text-left shadow-2xl border border-pink-500/20 p-6 space-y-4">
        <div className="flex justify-between items-center border-b border-pink-50 pb-3">
          <div>
            <span className="text-xs bg-pink-50 text-pink-500 font-black px-2 py-0.5 rounded uppercase">WMS Packing Station</span>
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
                <p className="font-mono text-sm text-gray-500">SKU: {item.SKU} | Kuantitas: {item.Qty} Pcs @ {formatIDR(item.Price as number)}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2 select-none text-xs">
          {Object.keys(packChecklist).map((key) => (
            <label 
              key={key} 
              className="flex items-center gap-2.5 p-2 bg-pink-50 rounded-xl border border-pink-100/40 cursor-pointer hover:bg-pink-50"
            >
              <input
                type="checkbox"
                checked={packChecklist[key]}
                onChange={() => handleTogglePackItem(key)}
                className="w-4 h-4 text-pink-500 border-gray-300 rounded focus:ring-pink-500"
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
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2.5 px-4 rounded-xl cursor-pointer text-xs flex items-center justify-center gap-1.5 shadow-md"
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
  );
}

import React from 'react';
import { Printer, ClipboardCheck } from 'lucide-react';
import { Order, ActivityLog } from '../../types.ts';

interface OrderDetailModalProps {
  activeDetailOrderNum: string | null;
  setActiveDetailOrderNum: (num: string | null) => void;
  orders: Order[];
  activityLog: ActivityLog[];
  formatIDR: (val: number | string) => string;
  generateCode128SvgPath: (text: string) => { path: string; width: number };
  handlePrintInvoice: (orderNum: string) => void;
  handleUpdateOrderStatus: (orderNum: string, newStatus: Order['Status']) => void;
  handleOpenPackStation: (order: Order) => void;
}

export default function OrderDetailModal({
  activeDetailOrderNum,
  setActiveDetailOrderNum,
  orders,
  activityLog,
  formatIDR,
  generateCode128SvgPath,
  handlePrintInvoice,
  handleUpdateOrderStatus,
  handleOpenPackStation
}: OrderDetailModalProps) {
  if (!activeDetailOrderNum) return null;

  const rep = orders.find(o => o.Order_Number === activeDetailOrderNum);
  if (!rep) return null;

  const relatedItems = orders.filter(o => o.Order_Number === activeDetailOrderNum);
  const totalSum = relatedItems.reduce((acc, curr) => acc + (Number(curr.Total) || 0), 0);
  const totalQty = relatedItems.reduce((acc, curr) => acc + (Number(curr.Qty) || 0), 0);
  const logs = activityLog.filter(l => (l.Activity || '').toLowerCase().includes(activeDetailOrderNum.toLowerCase())).sort((a,b) => new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime());

  let statClass = "bg-gray-100 text-gray-500 border border-gray-200";
  if (rep.Status === 'New Order') statClass = "bg-blue-50 text-blue-500 border border-blue-100 animate-pulse";
  else if (rep.Status === 'Processing') statClass = "bg-purple-50 text-purple-500 border border-purple-100 animate-pulse";
  else if (rep.Status === 'Picking') statClass = "bg-orange-50 text-orange-500 border border-orange-100 animate-pulse";
  else if (rep.Status === 'Ready To Ship') statClass = "bg-[#FFF3F8] text-[#EC4899] border border-pink-100 animate-pulse";
  else if (rep.Status === 'Shipped') statClass = "bg-emerald-50 text-emerald-500 border border-emerald-100";
  else if (rep.Status === 'Completed') statClass = "bg-green-50 text-green-600 border border-green-200";
  else if (rep.Status === 'Cancelled') statClass = "bg-red-50 text-red-500 border border-red-100";

  let channelClass = "bg-gray-50 text-gray-600 border border-gray-200";
  if (rep.Channel === 'Shopee') channelClass = "bg-orange-50 text-orange-600 border border-orange-200";
  else if (rep.Channel === 'TikTok & Tokopedia') channelClass = "bg-black text-white border border-gray-800";
  else if (rep.Channel === 'Retail IG') channelClass = "bg-pink-50 text-pink-600 border border-pink-200";
  else if (rep.Channel === 'Reseller') channelClass = "bg-emerald-50 text-emerald-600 border border-emerald-100";
  else if (rep.Channel === 'Agen') channelClass = "bg-blue-50 text-blue-600 border border-blue-100";
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
          <button onClick={() => setActiveDetailOrderNum(null)} className="text-gray-400 hover:text-black font-extrabold text-sm">&times;</button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-pink-50/50 rounded-2xl border border-pink-100/40 space-y-1">
            <p className="text-pink-400 font-bold uppercase text-[9px] tracking-wider">Identitas Pelanggan</p>
            <p className="text-xs font-extrabold text-gray-800">{rep.Customer}</p>
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
                    {item.Qty} Pcs x {formatIDR(item.Price as number)}
                  </span>
                </div>
                <span className="font-mono text-xs font-black text-gray-900 shrink-0 mt-1">
                  {formatIDR(item.Total as number)}
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
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

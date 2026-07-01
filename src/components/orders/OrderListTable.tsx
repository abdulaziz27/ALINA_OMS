/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ClipboardCheck, Eye, Printer } from 'lucide-react';
import { Order, OrderStatus } from '../../types.ts';

interface OrderListTableProps {
  orders: Order[];
  formatIDR: (val: number) => string;
  hasPermission: (perm: string) => boolean;
  setActiveDetailOrderNum: (val: string | null) => void;
  handleUpdateOrderStatus: (num: string, newStatus: string) => void;
  handleOpenPackStation: (val: any) => void;
  setSelectedShipOrder: (val: string | null) => void;
  setActiveTab: (val: string) => void;
  handlePrintInvoice: (val: string) => void;
}

export default function OrderListTable({
  orders,
  formatIDR,
  hasPermission,
  setActiveDetailOrderNum,
  handleUpdateOrderStatus,
  handleOpenPackStation,
  setSelectedShipOrder,
  setActiveTab,
  handlePrintInvoice
}: OrderListTableProps) {

  // Group orders by Order_Number
  const groupedList: {
    [ordNum: string]: {
      Order_Number: string;
      Order_Date: string;
      Customer: string;
      Channel: string;
      Status: OrderStatus;
      items: { SKU: string; Product: string; Qty: number; Price: number; Total: number }[];
      TotalSum: number;
      representativeOrder: Order;
    }
  } = {};

  orders.forEach(o => {
    if (!groupedList[o.Order_Number]) {
      groupedList[o.Order_Number] = {
        Order_Number: o.Order_Number,
        Order_Date: o.Order_Date,
        Customer: o.Customer,
        Channel: o.Channel,
        Status: o.Status,
        items: [],
        TotalSum: 0,
        representativeOrder: o
      };
    }
    groupedList[o.Order_Number].items.push({
      SKU: o.SKU,
      Product: o.Product,
      Qty: o.Qty,
      Price: o.Price,
      Total: o.Total
    });
    groupedList[o.Order_Number].TotalSum += o.Total;
  });

  const sortedGrouped = Object.values(groupedList).sort((a, b) => b.Order_Number.localeCompare(a.Order_Number));

  return (
    <div className="bg-white border border-pink-100 rounded-[32px] p-5 shadow-sm space-y-4">
      <div className="flex justify-between items-center pb-2 border-b border-pink-50">
        <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">Orders Fulfillment Station</h4>
        <span className="text-sm text-gray-400 font-mono font-bold">{orders.length} orders total</span>
      </div>

      {/* 1. DESKTOP VIEW: TABLE LAYOUT FOR md SCREEN OR HIGHER */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-pink-50 font-mono text-gray-400 uppercase tracking-widest text-sm">
              <th className="py-2.5 px-3">Order & Pelanggan</th>
              <th className="py-2.5 px-3">Item Produk</th>
              <th className="py-2.5 px-3 text-right">Total Transaksi</th>
              <th className="py-2.5 px-3 text-right">Status & Kontrol</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-pink-50/50">
            {sortedGrouped.map((o, idxO) => {
              // Visual status pill classes
              let statClass = "bg-gray-100 text-gray-700";
              if (o.Status === 'New Order') statClass = "bg-amber-100 text-amber-700 font-extrabold pb-0.5 px-2.5 rounded-full";
              if (o.Status === 'Processing') statClass = "bg-blue-50 text-blue-600 font-bold px-2.5 rounded-full";
              if (o.Status === 'Picking') statClass = "bg-purple-50 text-purple-600 px-2.5 rounded-full";
              if (o.Status === 'Packing') statClass = "bg-pink-50 text-pink-500 font-black px-2.5 rounded-full";
              if (o.Status === 'Ready To Ship') statClass = "bg-emerald-50 text-emerald-600 font-bold px-2.5 rounded-full";
              if (o.Status === 'Shipped') statClass = "bg-indigo-50 text-indigo-600 px-2.5 rounded-full";
              if (o.Status === 'Completed') statClass = "bg-green-100 text-green-800 font-extrabold px-2.5 rounded-full";
              if (o.Status === 'Cancelled') statClass = "bg-red-50 text-red-500 line-through px-2.5 rounded-full";

              // Channel decoration
              let channelClass = "bg-gray-100 text-gray-600 border-gray-200";
              if (o.Channel === 'Shopee') channelClass = "bg-orange-50 text-orange-600 border border-orange-100";
              else if (o.Channel === 'TikTok & Tokopedia') channelClass = "bg-indigo-50 text-indigo-605 border border-indigo-100";
              else if (['Retail IG', 'Ecer'].includes(o.Channel)) channelClass = "bg-pink-50 text-pink-600 border border-pink-100";
              else if (['Reseller', 'Agen', 'Marketer'].includes(o.Channel)) channelClass = "bg-cyan-50 text-cyan-600 border border-cyan-100";
              else if (o.Channel === 'Distributor') channelClass = "bg-amber-50 text-amber-600 border border-amber-100";

              return (
                <tr key={`${o.Order_Number}-${idxO}`} className="hover:bg-pink-50 text-gray-750 font-medium border-b border-pink-50/50 transition duration-150">
                  <td className="py-3 px-3 align-top min-w-[150px]">
                    <strong className="text-gray-900 text-xs tracking-tight block font-extrabold cursor-pointer hover:underline hover:text-pink-500 transition" onClick={() => setActiveDetailOrderNum(o.Order_Number)}>
                      {o.Order_Number}
                    </strong>
                    <div className="font-extrabold text-pink-500 uppercase tracking-tight text-[11px] mt-0.5">{o.Customer}</div>
                    <div className="flex flex-wrap items-center gap-1.5 mt-1">
                      <span className={`inline-block text-xs font-black rounded px-1.5 py-0.5 border leading-none uppercase ${channelClass}`}>
                        {o.Channel}
                      </span>
                      <span className="text-xs text-pink-500 font-mono leading-none font-bold">
                        🗓 {new Date(o.Order_Date).toLocaleDateString()}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-3 align-top">
                    <div className="space-y-1.5 max-w-[220px]">
                      {o.items.map((item, idx) => (
                        <div key={idx} className="border-b border-pink-50/30 last:border-0 pb-1.5 last:pb-0">
                          <div className="font-bold text-gray-805 leading-tight">{item.Product}</div>
                          <div className="text-sm font-mono text-gray-400 mt-0.5">
                            SKU: <span className="text-pink-600 font-bold">{item.SKU}</span> | {item.Qty} Pcs @ {formatIDR(item.Price)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-3 text-right font-mono font-black text-gray-950 align-top text-xs shrink-0 min-w-[100px]">
                    {formatIDR(o.TotalSum)}
                    <div className="text-xs text-gray-400 font-sans font-extrabold mt-1">({o.items.reduce((acc, i) => acc + i.Qty, 0)} Pcs)</div>
                  </td>
                  <td className="py-3 px-3 align-top text-right min-w-[160px]">
                    <div className="flex flex-col items-end gap-1.5">
                      {/* Status display */}
                      <span className={`inline-block py-0.5 px-2 rounded-full text-xs uppercase font-black tracking-wider leading-none select-none ${statClass}`}>
                        ● {o.Status}
                      </span>

                      {/* Action buttons */}
                      <div className="pt-0.5">
                        {o.Status === 'New Order' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o.Order_Number, 'Processing')}
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs font-bold py-1 px-2.5 rounded-lg cursor-pointer transition shadow-sm"
                          >
                            Process Order
                          </button>
                        )}

                        {o.Status === 'Processing' && (
                          <button
                            onClick={() => handleUpdateOrderStatus(o.Order_Number, 'Picking')}
                            className="bg-purple-500 hover:bg-purple-600 text-white text-xs font-bold py-1 px-2.5 rounded-lg cursor-pointer transition shadow-sm"
                          >
                            Start Picking 🛒
                          </button>
                        )}

                        {o.Status === 'Picking' && (
                          <button
                            onClick={() => handleOpenPackStation(o.representativeOrder)}
                            className="bg-pink-500 hover:bg-pink-600 text-white text-xs font-bold py-1 px-2.5 rounded-lg cursor-pointer flex items-center justify-center gap-1 leading-tight transition shadow-sm animate-pulse"
                          >
                            <ClipboardCheck className="w-3 h-3" /> Pack Item 🎁
                          </button>
                        )}

                        {o.Status === 'Ready To Ship' && hasPermission('shipping') && (
                          <button
                            onClick={() => {
                              setSelectedShipOrder(o.Order_Number);
                              setActiveTab('shipping');
                            }}
                            className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold py-1 px-2.5 rounded-lg cursor-pointer transition shadow-sm"
                          >
                            Assign Courier 🚚
                          </button>
                        )}

                        {o.Status === 'Shipped' && (
                          <span className="text-sm text-gray-400 font-bold block">🚚 In Transit</span>
                        )}

                        {o.Status === 'Completed' && (
                          <span className="text-sm text-emerald-600 font-bold block">✓ Selesai</span>
                        )}

                        {o.Status === 'Cancelled' && (
                          <span className="text-sm text-red-400 font-bold block">Voided</span>
                        )}
                      </div>

                      {/* Auxiliary buttons */}
                      <div className="flex gap-1.5 mt-1 justify-end">
                        <button
                          onClick={() => setActiveDetailOrderNum(o.Order_Number)}
                          className="p-1 rounded bg-gray-50 border border-gray-100 hover:border-pink-300 hover:bg-pink-50 text-gray-500 hover:text-pink-500 font-bold text-xs transition cursor-pointer flex items-center gap-0.5"
                          title="Detail Pesanan"
                        >
                          <Eye className="w-3 h-3" /> Detail
                        </button>
                        <button
                          onClick={() => handlePrintInvoice(o.Order_Number)}
                          className="p-1 rounded bg-pink-50 border border-pink-100 hover:border-pink-300 hover:bg-pink-100 text-pink-500 font-black text-xs transition cursor-pointer flex items-center gap-0.5"
                          title="Cetak Struk"
                        >
                          <Printer className="w-3 h-3" /> Struk
                        </button>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* 2. MOBILE VIEW: FULLY RESPONSIVE AND STACKED CARD ELEMENTS (NO SIDEWAYS SCROLL) */}
      <div className="block md:hidden space-y-3">
        {sortedGrouped.map((o, idxO) => {
          // Visual status pill classes
          let statClass = "bg-gray-100 text-gray-700";
          if (o.Status === 'New Order') statClass = "bg-amber-100 text-amber-700 font-extrabold px-2.5 py-0.5 rounded-full text-xs";
          if (o.Status === 'Processing') statClass = "bg-blue-50 text-blue-600 font-bold px-2.5 py-0.5 rounded-full text-xs";
          if (o.Status === 'Picking') statClass = "bg-purple-50 text-purple-600 px-2.5 py-0.5 rounded-full text-xs";
          if (o.Status === 'Packing') statClass = "bg-pink-50 text-pink-500 font-black px-2.5 py-0.5 rounded-full text-xs";
          if (o.Status === 'Ready To Ship') statClass = "bg-emerald-50 text-emerald-600 font-bold px-2.5 py-0.5 rounded-full text-xs";
          if (o.Status === 'Shipped') statClass = "bg-indigo-50 text-indigo-600 px-2.5 py-0.5 rounded-full text-xs";
          if (o.Status === 'Completed') statClass = "bg-green-100 text-green-800 font-extrabold px-2.5 py-0.5 rounded-full text-xs";
          if (o.Status === 'Cancelled') statClass = "bg-red-50 text-red-500 line-through px-2.5 py-0.5 rounded-full text-xs";

          // Channel decoration
          let channelClass = "bg-gray-100 text-gray-600 border-gray-200";
          if (o.Channel === 'Shopee') channelClass = "bg-orange-50 text-orange-600 border border-orange-100";
          else if (o.Channel === 'TikTok & Tokopedia') channelClass = "bg-indigo-50 text-indigo-605 border border-indigo-100";
          else if (['Retail IG', 'Ecer'].includes(o.Channel)) channelClass = "bg-pink-50 text-pink-600 border border-pink-100";
          else if (['Reseller', 'Agen', 'Marketer'].includes(o.Channel)) channelClass = "bg-cyan-50 text-cyan-600 border border-cyan-100";
          else if (o.Channel === 'Distributor') channelClass = "bg-amber-50 text-amber-600 border border-amber-100";

          return (
            <div key={`mobile-${o.Order_Number}-${idxO}`} className="bg-white border border-pink-100 rounded-2xl p-4 space-y-3.5 shadow-sm hover:border-pink-300 transition duration-150">
              {/* Header: Order Number & Channel */}
              <div className="flex justify-between items-start">
                <div>
                  <strong 
                    className="text-gray-900 text-xs md:text-sm tracking-tight block font-black cursor-pointer hover:underline hover:text-pink-500"
                    onClick={() => setActiveDetailOrderNum(o.Order_Number)}
                  >
                    {o.Order_Number}
                  </strong>
                  <span className="text-sm text-gray-400 font-medium block">
                    🗓 {new Date(o.Order_Date).toLocaleDateString()} {new Date(o.Order_Date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <span className={`inline-block text-xs font-black rounded px-1.5 py-0.5 border leading-none uppercase ${channelClass}`}>
                  {o.Channel}
                </span>
              </div>

              {/* Customer Info */}
              <div className="border-t border-pink-50/40 pt-2 flex justify-between items-center bg-pink-50 p-2 rounded-xl border border-pink-100/40">
                <div>
                  <span className="text-xs uppercase tracking-wider text-gray-400 block font-bold">Pelanggan</span>
                  <span className="font-extrabold text-gray-900 uppercase text-xs">{o.Customer}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase tracking-wider text-gray-400 block font-bold">Status</span>
                  <span className={`inline-block uppercase font-black tracking-wider leading-none select-none ${statClass}`}>
                    ● {o.Status}
                  </span>
                </div>
              </div>

              {/* Product Items List Card */}
              <div className="bg-gray-50 rounded-xl p-2.5 space-y-2 text-xs">
                {o.items.map((item, idx) => (
                  <div key={idx} className="border-b border-pink-50/20 last:border-0 pb-2 last:pb-0 flex justify-between items-start gap-4">
                    <div className="space-y-0.5">
                      <div className="font-bold text-gray-805 leading-tight">{item.Product}</div>
                      <div className="text-xs font-mono text-gray-400">
                        SKU: <span className="text-pink-600 font-bold">{item.SKU}</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono text-xs font-bold text-gray-900">{item.Qty} Pcs</span>
                      <div className="text-xs text-pink-500 font-mono font-bold">{formatIDR(item.Total)}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Subtotal & Actions Group */}
              <div className="border-t border-pink-50/40 pt-3 flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-400 font-bold uppercase">Total Pembayaran</span>
                  <span className="font-mono font-black text-gray-950 text-xs">
                    {formatIDR(o.TotalSum)} <span className="font-sans font-extrabold text-xs text-gray-400">({o.items.reduce((acc, i) => acc + i.Qty, 0)} Pcs)</span>
                  </span>
                </div>

                <div className="flex flex-col gap-1.5">
                  {/* Primary Status action trigger button */}
                  {o.Status === 'New Order' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(o.Order_Number, 'Processing')}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-black py-2 px-4 rounded-xl cursor-pointer transition shadow-sm uppercase tracking-wider text-center block"
                    >
                      Process Order
                    </button>
                  )}

                  {o.Status === 'Processing' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(o.Order_Number, 'Picking')}
                      className="w-full bg-purple-500 hover:bg-purple-600 text-white text-sm font-black py-2 px-4 rounded-xl cursor-pointer transition shadow-sm uppercase tracking-wider text-center block"
                    >
                      Mulai Picking 🛒
                    </button>
                  )}

                  {o.Status === 'Picking' && (
                    <button
                      onClick={() => handleOpenPackStation(o.representativeOrder)}
                      className="w-full bg-pink-500 hover:bg-pink-600 text-white text-sm font-black py-2 px-4 rounded-xl cursor-pointer flex items-center justify-center gap-1 leading-tight transition shadow-sm animate-pulse uppercase tracking-wider"
                    >
                      <ClipboardCheck className="w-4 h-4" /> Pack Order 🎁
                    </button>
                  )}

                  {o.Status === 'Ready To Ship' && hasPermission('shipping') && (
                    <button
                      onClick={() => {
                        setSelectedShipOrder(o.Order_Number);
                        setActiveTab('shipping');
                      }}
                      className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-black py-2 px-4 rounded-xl cursor-pointer transition shadow-sm uppercase tracking-wider text-center block"
                    >
                      Kirim Kurir 🚚
                    </button>
                  )}

                  {/* Auxiliary buttons */}
                  <div className="grid grid-cols-2 gap-1.5">
                    <button
                      onClick={() => setActiveDetailOrderNum(o.Order_Number)}
                      className="py-1.5 px-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-pink-300 hover:bg-pink-50 text-gray-600 hover:text-pink-500 font-bold text-sm transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" /> Detail
                    </button>
                    <button
                      onClick={() => handlePrintInvoice(o.Order_Number)}
                      className="py-1.5 px-3 rounded-xl bg-pink-50 border border-pink-100 hover:border-pink-300 hover:bg-pink-100 text-pink-500 font-black text-sm transition cursor-pointer flex items-center justify-center gap-1"
                    >
                      <Printer className="w-3.5 h-3.5" /> Struk
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

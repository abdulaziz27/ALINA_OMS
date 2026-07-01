/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Customer } from '../../types.ts';

interface CreateOrderFormProps {
  lookups?: any[];
  customers: Customer[];
  ordCustomer: string;
  setOrdCustomer: (val: string) => void;
  ordChannel: string;
  setOrdChannel: (val: string) => void;
  availableCategories: any[];
  ordCategory: string;
  setOrdCategory: (val: string) => void;
  availableVariants: any[];
  ordVariant: string;
  setOrdVariant: (val: string) => void;
  availableColorPresets: any[];
  ordColor: string;
  setOrdColor: (val: string) => void;
  ordSku: string;
  ordQty: string;
  setOrdQty: (val: string) => void;
  ordPrice: string;
  setOrdPrice: (val: string) => void;
  handleAddProductToStaging: () => void;
  tempOrderItems: any[];
  setTempOrderItems: (val: any) => void;
  handleRemoveProductFromStaging: (idx: number) => void;
  handleCreateOrderSubmit: (e: React.FormEvent) => void;
  formatIDR: (val: number) => string;
}

export default function CreateOrderForm({
  lookups = [],
  customers,
  ordCustomer,
  setOrdCustomer,
  ordChannel,
  setOrdChannel,
  availableCategories,
  ordCategory,
  setOrdCategory,
  availableVariants,
  ordVariant,
  setOrdVariant,
  availableColorPresets,
  ordColor,
  setOrdColor,
  ordSku,
  ordQty,
  setOrdQty,
  ordPrice,
  setOrdPrice,
  handleAddProductToStaging,
  tempOrderItems,
  setTempOrderItems,
  handleRemoveProductFromStaging,
  handleCreateOrderSubmit,
  formatIDR
}: CreateOrderFormProps) {
  return (
    <div className="bg-white border border-pink-100 p-6 rounded-[32px] shadow-sm space-y-4">
      <h3 className="font-extrabold text-sm tracking-tight text-gray-900 uppercase">Input Penjualan Baru (Sales Order)</h3>
      
      <form onSubmit={handleCreateOrderSubmit} className="space-y-4 text-xs font-semibold text-gray-700">
        <div className="space-y-1 block">
          <label className="font-bold text-gray-600 block uppercase">Pilih Pelanggan Alina</label>
          <select
            required
            value={ordCustomer}
            onChange={(e) => setOrdCustomer(e.target.value)}
            className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
          >
            {customers.map((c, idx) => (
              <option key={`${c.Customer_ID}-${idx}`} value={c.Customer_Name}>
                {c.Customer_Name} ({c.Customer_Type})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-1">
          <label className="font-bold text-gray-600 block uppercase">Sales Channel Resmi</label>
          <select
            required
            value={ordChannel}
            onChange={(e) => setOrdChannel(e.target.value as any)}
            className="w-full bg-white border border-pink-100 text-gray-700 rounded-xl py-2 px-3 focus:outline-none font-bold"
          >
            {lookups.filter(l => l.Category === 'ORDER_CHANNEL').map(l => (
                  <option key={l.id} value={l.Value}>{l.Value}</option>
                ))}
          </select>
        </div>

        {/* Brand Category, Size/Variant, and Color selectors */}
        <div className="bg-pink-50 p-3 rounded-2xl border border-pink-50 space-y-3">
          <div className="space-y-1">
            <label className="font-bold text-gray-600 block uppercase">Pilihan Kategori (Stok Ready)</label>
            <select
              required
              value={ordCategory}
              onChange={(e) => setOrdCategory(e.target.value)}
              className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none text-xs"
            >
              {availableCategories.map((cat, idx) => (
                <option key={`${cat}-${idx}`} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-600 block uppercase">Pilihan Size / Variant (Stok Ready)</label>
            <select
              required
              value={ordVariant}
              onChange={(e) => setOrdVariant(e.target.value)}
              className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none text-xs"
            >
              {availableVariants.map((v, idx) => (
                <option key={`${v}-${idx}`} value={v}>{v}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-600 block uppercase">Pilihan Warna (Stok Ready)</label>
            <div className="flex flex-wrap gap-1.5 py-1 max-h-24 overflow-y-auto">
              {availableColorPresets.map((colorObj, idx) => {
                const isSelected = ordColor === colorObj.name;
                return (
                  <button
                    key={`${colorObj.name}-${idx}`}
                    type="button"
                    onClick={() => setOrdColor(colorObj.name)}
                    className={`flex items-center gap-1 px-2 py-1 rounded-full border text-sm font-bold transition ${
                      isSelected 
                        ? 'bg-pink-100 text-pink-700 border-pink-400 shadow-sm font-extrabold' 
                        : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    <span 
                      className="w-2.5 h-2.5 rounded-full border border-gray-300"
                      style={{ backgroundColor: colorObj.hex }}
                    />
                    <span>{colorObj.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* SKU Match Status Area */}
          <div className="pt-2 border-t border-pink-100/60 mt-1 flex justify-between items-center text-sm font-bold">
            <span className="text-gray-500 uppercase">Status SKU:</span>
            {ordSku ? (
              <span className="text-emerald-700 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200/50">
                🟢 {ordSku}
              </span>
            ) : (
              <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded border border-red-200/50">
                ⚠️ Belum Ada di Master
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <label className="font-bold text-gray-600">Qty Pemesanan</label>
            <input
              type="number"
              required
              min="1"
              value={ordQty}
              onChange={(e) => setOrdQty(e.target.value)}
              className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none font-bold text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="font-bold text-gray-600">Harga Jual Otomatis</label>
            <input
              type="number"
              required
              placeholder="Rp / Pcs"
              value={ordPrice}
              onChange={(e) => setOrdPrice(e.target.value)}
              className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none font-mono text-xs text-pink-600 font-bold"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            disabled={!ordSku}
            onClick={handleAddProductToStaging}
            className={`w-full font-bold py-2.5 px-3 rounded-xl cursor-pointer transition text-center text-xs flex items-center justify-center gap-1 border uppercase ${
              ordSku
                ? 'bg-pink-50 border-pink-200 text-pink-500 hover:bg-pink-100 font-extrabold'
                : 'bg-gray-50 border-gray-100 text-gray-400 cursor-not-allowed text-sm'
            }`}
          >
            <Plus className="w-3.5 h-3.5" /> + Tambah Barang
          </button>
        </div>

        {/* Display Staged Items List inside the Order Creation Card */}
        {tempOrderItems.length > 0 && (
          <div className="mt-4 pt-3 border-t border-pink-100 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm font-extrabold uppercase text-gray-400">Keranjang Transaksi:</span>
              <button
                type="button"
                onClick={() => setTempOrderItems([])}
                className="text-sm text-red-500 font-bold hover:underline cursor-pointer"
              >
                Reset Keranjang
              </button>
            </div>
            
            <div className="bg-pink-50 border border-pink-50/50 rounded-2xl p-2.5 max-h-48 overflow-y-auto space-y-1.5">
              {tempOrderItems.map((item, idx) => (
                <div key={idx} className="flex justify-between items-start text-sm font-bold border-b border-pink-100/30 pb-1.5 last:border-0 last:pb-0">
                  <div className="space-y-0.5 pr-2">
                    <p className="text-gray-805 leading-normal">{item.Product_Name}</p>
                    <p className="text-xs font-mono text-gray-400 font-normal">{item.SKU} | {item.Qty} pcs x {formatIDR(item.Price)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-gray-900 font-mono text-right">{formatIDR(item.Total)}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProductFromStaging(idx)}
                      className="text-red-400 hover:text-red-650 transition cursor-pointer"
                      title="Hapus"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center px-2.5 py-1.5 bg-pink-50/50 rounded-xl border border-pink-100/30 text-[11px] font-bold font-mono">
              <span className="text-gray-500 uppercase text-xs">Grand Total ({tempOrderItems.reduce((acc, i) => acc + i.Qty, 0)} pcs):</span>
              <span className="text-pink-500 font-black">
                {formatIDR(tempOrderItems.reduce((acc, item) => acc + item.Total, 0))}
              </span>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={tempOrderItems.length === 0}
          className={`w-full font-bold py-3 px-4 rounded-xl cursor-pointer transition shadow-md uppercase text-center text-xs block ${
            tempOrderItems.length > 0
              ? 'bg-pink-500 hover:bg-pink-600 text-white cursor-pointer'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
          }`}
        >
          Simpan Transaksi Sales Order
        </button>
      </form>
    </div>
  );
}

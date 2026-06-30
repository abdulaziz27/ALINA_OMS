import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Product, Order, Customer, User } from '../types';
import OwnerFinancials from '../components/OwnerFinancials';

interface DashboardPageProps {
  totalStockAmount: number;
  totalSkuAmount: number;
  ordersTodayCount: number;
  pendingOrdersCount: number;
  packedOrdersCount: number;
  shippedOrdersCount: number;
  ordersThisMonthCount: number;
  currentUser: User;
  products: Product[];
  orders: Order[];
  customers: Customer[];
}

export default function DashboardPage({
  totalStockAmount,
  totalSkuAmount,
  ordersTodayCount,
  pendingOrdersCount,
  packedOrdersCount,
  shippedOrdersCount,
  ordersThisMonthCount,
  currentUser,
  products,
  orders,
  customers
}: DashboardPageProps) {
  return (
    <div className="space-y-6">
      {/* Operations KPIs Standard */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-pink-100/60 p-4 rounded-[24px] shadow-sm flex flex-col justify-between text-left">
          <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">Total Stock Pcs</p>
          <h3 className="text-lg font-extrabold text-gray-900 font-mono mt-1">{totalStockAmount.toLocaleString()} <span className="text-xs font-sans text-gray-400">Pcs</span></h3>
          <span className="text-[9px] bg-emerald-50 text-emerald-600 font-bold px-2 py-0.5 rounded-full mt-2 w-fit">Sehat</span>
        </div>

        <div className="bg-white border border-pink-100/60 p-4 rounded-[24px] shadow-sm flex flex-col justify-between text-left">
          <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">Sku Terdaftar</p>
          <h3 className="text-lg font-extrabold text-gray-900 font-mono mt-1">{totalSkuAmount} <span className="text-xs font-sans text-gray-400">SKU</span></h3>
          <span className="text-[9px] bg-pink-100 text-[#EC4899] font-bold px-2 py-0.5 rounded-full mt-2 w-fit">Alina Mode</span>
        </div>

        <div className="bg-white border border-pink-100/60 p-4 rounded-[24px] shadow-sm flex flex-col justify-between text-left">
          <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">Orders Today</p>
          <h3 className="text-lg font-extrabold text-pink-600 font-mono mt-1">{ordersTodayCount} <span className="text-xs font-sans text-gray-400">Trx</span></h3>
          <span className="text-[9px] bg-pink-50 text-[#EC4899] font-bold px-2 py-0.5 rounded-full mt-2 w-fit">Live</span>
        </div>

        <div className="bg-white border border-pink-100/60 p-4 rounded-[24px] shadow-sm flex flex-col justify-between text-left">
          <p className="text-[10px] font-mono uppercase tracking-wider text-gray-400 font-bold">Fulfillment Status</p>
          <div className="flex gap-1.5 text-[10px] font-bold mt-1 text-gray-800">
            <span className="bg-amber-100/60 px-1 rounded">Pnd: {pendingOrdersCount}</span>
            <span className="bg-emerald-100/60 px-1 rounded">Pck: {packedOrdersCount}</span>
            <span className="bg-indigo-100/60 px-1 rounded">Trs: {shippedOrdersCount}</span>
          </div>
          <span className="text-[9px] text-gray-400 mt-2 block font-mono">This month total: {ordersThisMonthCount}</span>
        </div>
      </div>

      {/* Secure OWNER view triggers */}
      {currentUser.Role === 'Owner Alina' ? (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="bg-pink-100 text-[#EC4899] text-[9px] font-black px-3 py-1 rounded-full uppercase">Secure Owner Financial Panel</span>
            <p className="text-xs text-gray-400">Privileged metrics shown only to roles designated OWNER.</p>
          </div>
          <OwnerFinancials 
            productsList={products} 
            ordersList={orders} 
            customersList={customers} 
          />
        </div>
      ) : (
        <div className="bg-gray-100 text-gray-500 p-5 rounded-3xl text-xs text-center">
          🔒 Panel finansial harga modal, COGS, profit kotor, dan rasio margin disembunyikan untuk akun role Admin. Hubungi Owner untuk otorisasi akses finansial penuh.
        </div>
      )}

      {/* Critical restock & recent activity lists split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Stock Alert list */}
        <div className="bg-white border border-pink-100 p-5 rounded-[32px] text-left space-y-3">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4 text-[#EC4899]" /> ⚠️ ALINA STOCK ALERTS (Critical Levels)
          </h4>
          
          <div className="divide-y divide-pink-50 max-h-56 overflow-y-auto">
            {products.filter(p => p.Current_Stock <= p.Minimum_Stock).map((p, pIdx) => (
              <div key={p.SKU || `warn-prod-${pIdx}`} className="py-2.5 flex justify-between items-center text-xs">
                <div>
                  <p className="font-bold text-gray-900">{p.Product_Name}</p>
                  <p className="text-[10px] font-mono text-gray-400">SKU: {p.SKU} | Kategori: {p.Category}</p>
                </div>
                <div className="text-right">
                  <span className="bg-red-50 text-red-600 font-extrabold px-2.5 py-0.5 rounded-full block text-[10px]">
                    {p.Current_Stock} Pcs Left
                  </span>
                  <span className="text-[9px] text-gray-400">Threshold: {p.Minimum_Stock} Pcs</span>
                </div>
              </div>
            ))}

            {products.filter(p => p.Current_Stock <= p.Minimum_Stock).length === 0 && (
              <p className="text-xs text-gray-400 text-center py-6">Kondisi stok healty. Tidak ada produk di bawah threshold minimum.</p>
            )}
          </div>
        </div>

        {/* Operational Guide list */}
        <div className="bg-[#FFF8FB] border border-pink-100 p-5 rounded-[32px] text-left flex flex-col justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-pink-700 mb-2">💡 OPERATIONAL INTEGRATION CHECKLIST</h4>
          <div className="space-y-3 text-xs leading-relaxed text-gray-600">
            <p>WMS/OMS Alina siap digunakan untuk operasional terpadu:</p>
            <ul className="list-disc pl-5 space-y-1 text-gray-500 font-medium">
              <li>Fungsi <strong className="text-[#EC4899]">QR Code</strong> otomatis dibuat per produk. Unduh dan tempel d tag baju.</li>
              <li>Gunakan modul <strong className="text-[#EC4899]">Picking & Packing</strong> saat memproses pesanan untuk memverifikasi akurasi isi barang menggunakan laser terminal HP.</li>
              <li>Simpan <strong className="text-[#EC4899]">Stock Opname bulanan</strong> pada tanggal akhir untuk menjaga konsistensi selisih stok fisik & sistem.</li>
              <li>Masukkan Spreadsheet ID Anda pada tab <strong className="text-[#EC4899]">Sheets Connector</strong> untuk menyinkronkan data.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}

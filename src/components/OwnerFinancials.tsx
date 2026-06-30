/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { 
  TrendingUp, Award, DollarSign, PieChart, ShoppingBag, 
  AlertOctagon, CheckCircle2, TrendingDown, Layers
} from 'lucide-react';
import { Product, Order, Customer } from '../types.ts';

interface OwnerFinancialsProps {
  productsList: Product[];
  ordersList: Order[];
  customersList: Customer[];
}

export default function OwnerFinancials({
  productsList,
  ordersList,
  customersList
}: OwnerFinancialsProps) {
  
  // 1. CALCULATE FINANCIALS
  const completedOrders = ordersList.filter(o => !['Draft', 'Cancelled'].includes(o.Status));
  
  let totalRevenue = 0;
  let totalCost = 0;
  let totalUnitsSold = 0;
  
  completedOrders.forEach(o => {
    totalRevenue += o.Total;
    totalUnitsSold += o.Qty;
    
    // Find matching cost price from products list
    const prod = productsList.find(p => p.SKU === o.SKU);
    const cost = prod ? prod.Cost_Price : (o.Price * 0.55); // fallback estimate
    totalCost += (cost * o.Qty);
  });

  // Keuntungan Kotor (Gross Profit)
  const grossProfit = totalRevenue - totalCost;
  const grossMargin = totalRevenue > 0 ? (grossProfit / totalRevenue) * 100 : 0;

  // Keuntungan Bersih (Net Profit)
  // Deducting administrative & packaging fees/workforce estimated at Rp 2.500 per unit sold (e.g., polymailers, shipping labels, gift cards)
  const estimatedOpCosts = totalUnitsSold * 2500;
  const netProfit = Math.max(0, grossProfit - estimatedOpCosts);
  const netMargin = totalRevenue > 0 ? (netProfit / totalRevenue) * 100 : 0;

  // Inventory value (Total cost of active inventory)
  const totalInventoryValue = productsList.reduce((acc, current) => {
    return acc + (current.Current_Stock * current.Cost_Price);
  }, 0);

  const totalInventorySalesValue = productsList.reduce((acc, current) => {
    return acc + (current.Current_Stock * current.Retail_Price);
  }, 0);

  // 2. DYNAMIC CHANNEL PERFORMANCE
  const channelTotals: { [key: string]: number } = {};
  completedOrders.forEach(o => {
    channelTotals[o.Channel] = (channelTotals[o.Channel] || 0) + o.Total;
  });

  // 3. BEST SELLING PRODUCT
  const productSalesMap: { [key: string]: { qty: number; revenue: number; name: string; category: string; color: string } } = {};
  completedOrders.forEach(o => {
    if (!productSalesMap[o.SKU]) {
      const pDetail = productsList.find(p => p.SKU === o.SKU);
      productSalesMap[o.SKU] = { 
        qty: 0, 
        revenue: 0, 
        name: o.Product,
        category: pDetail?.Category || 'Celamis Regular',
        color: pDetail?.Color || 'Default'
      };
    }
    productSalesMap[o.SKU].qty += o.Qty;
    productSalesMap[o.SKU].revenue += o.Total;
  });

  const productSalesArr = Object.entries(productSalesMap).map(([sku, data]) => ({
    sku,
    ...data
  })).sort((a, b) => b.qty - a.qty);

  const bestSellingProduct = productSalesArr[0] || { name: "No Sales Yet", qty: 0 };

  // 4. TOP CUSTOMERS DATA
  const customerSalesMap: { [key: string]: { totalSpend: number; totalQty: number } } = {};
  completedOrders.forEach(o => {
    if (!customerSalesMap[o.Customer]) {
      customerSalesMap[o.Customer] = { totalSpend: 0, totalQty: 0 };
    }
    customerSalesMap[o.Customer].totalSpend += o.Total;
    customerSalesMap[o.Customer].totalQty += o.Qty;
  });

  const customerSalesArr = Object.entries(customerSalesMap).map(([name, data]) => {
    const custObj = customersList.find(c => c.Customer_Name === name);
    return {
      name,
      type: custObj ? custObj.Customer_Type : 'Umum',
      ...data
    };
  }).sort((a, b) => b.totalSpend - a.totalSpend);

  const topCustomerName = customerSalesArr[0]?.name || 'Umum';

  // 5. DEAD STOCK, FAST & SLOW MOVING
  // Dead Stock: Stock > 0 but sold quantity in past 30 days is 0
  const deadStockProducts = productsList.filter(p => {
    const soldQty = productSalesMap[p.SKU]?.qty || 0;
    return p.Current_Stock > 0 && soldQty === 0;
  });

  // Fast Moving: sales quantity >= 10 units
  const fastMovingProducts = productsList
    .filter(p => (productSalesMap[p.SKU]?.qty || 0) >= 10)
    .map(p => ({
      sku: p.SKU,
      name: p.Product_Name,
      qtySold: productSalesMap[p.SKU].qty,
      stock: p.Current_Stock
    })).sort((a, b) => b.qtySold - a.qtySold);

  // Slow Moving: stock > 0, but sales quantity < 5 units in past 30 days
  const slowMovingProducts = productsList
    .filter(p => p.Current_Stock > 0 && (productSalesMap[p.SKU]?.qty || 0) < 5)
    .map(p => ({
      sku: p.SKU,
      name: p.Product_Name,
      qtySold: productSalesMap[p.SKU]?.qty || 0,
      stock: p.Current_Stock
    })).sort((a, b) => a.qtySold - b.qtySold);

  // Format currency
  const formatIDR = (num: number) => {
    return 'Rp ' + Math.round(num).toLocaleString('id-ID');
  };

  return (
    <div className="space-y-6">
      
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Revenue */}
        <div className="bg-gradient-to-br from-[#FFF8FB] to-[#fff3f7] border border-pink-100 p-5 rounded-[24px] shadow-sm flex items-start justify-between relative overflow-hidden">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Pendapatan Kotor (Omset)</p>
            <h4 className="text-xl font-bold text-gray-900 tracking-tight">{formatIDR(totalRevenue)}</h4>
            <span className="text-[10px] bg-pink-50 text-[#EC4899] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 border border-pink-150">
              <ShoppingBag className="w-2.5 h-2.5" /> {totalUnitsSold} Pcs Terjual
            </span>
          </div>
          <div className="p-2.5 bg-pink-100 rounded-2xl text-[#EC4899]">
            <DollarSign className="w-5 h-5" />
          </div>
        </div>

        {/* Keuntungan Kotor */}
        <div className="bg-gradient-to-br from-[#F0FDF4] to-[#DCFCE7] border border-emerald-100 p-5 rounded-[24px] shadow-sm flex items-start justify-between relative overflow-hidden">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-emerald-800 uppercase tracking-widest">Keuntungan Kotor</p>
            <h4 className="text-xl font-bold text-emerald-950 tracking-tight">{formatIDR(grossProfit)}</h4>
            <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-semibold inline-flex items-center gap-1">
              Margin Kotor: {grossMargin.toFixed(1)}%
            </span>
          </div>
          <div className="p-2.5 bg-emerald-200 rounded-2xl text-emerald-800">
            <TrendingUp className="w-5 h-5" />
          </div>
        </div>

        {/* Keuntungan Bersih */}
        <div className="bg-gradient-to-br from-indigo-50/70 to-blue-50/50 border border-indigo-150 p-5 rounded-[24px] shadow-sm flex items-start justify-between relative overflow-hidden">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-indigo-800 uppercase tracking-widest">Keuntungan Bersih</p>
            <h4 className="text-xl font-bold text-indigo-950 tracking-tight">{formatIDR(netProfit)}</h4>
            <span className="text-[10px] bg-indigo-600 text-white px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1">
              Margin Bersih: {netMargin.toFixed(1)}%
            </span>
          </div>
          <div className="p-2.5 bg-indigo-100 rounded-2xl text-indigo-600">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Inventory Value (Assets) */}
        <div className="bg-gradient-to-br from-[#FFF8FB] to-[#fff3f7] border border-pink-100 p-5 rounded-[24px] shadow-sm flex items-start justify-between relative overflow-hidden">
          <div className="space-y-1.5">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Aset Inventori (HPP)</p>
            <h4 className="text-xl font-bold text-gray-950 tracking-tight">{formatIDR(totalInventoryValue)}</h4>
            <span className="text-[10px] text-gray-500 block font-bold">
              Potensi Jual: {formatIDR(totalInventorySalesValue)}
            </span>
          </div>
          <div className="p-2.5 bg-[#FCE7F3] rounded-2xl text-[#EC4899]">
            <Layers className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* DIAGRAMS BI & ANALISIS MARKETING */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* DIAGRAM BARANG YANG PALING LAKU */}
        <div className="bg-white border border-pink-100 p-5 rounded-[28px] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-pink-100/50 pb-2.5">
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-[#EC4899] text-xs uppercase tracking-wider">DIAGRAM BARANG PALING LAKU</h4>
              <p className="text-[10px] font-medium text-gray-400">Peringkat 5 produk dengan akumulasi kuantiti terlaris</p>
            </div>
            <span className="text-[10px] bg-pink-100 text-[#EC4899] font-black px-2.5 py-1 rounded-full uppercase">
              TOP 5 SKU
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {productSalesArr.slice(0, 5).map((item, idx) => {
              const maxQty = productSalesArr[0]?.qty || 1;
              const percentage = (item.qty / maxQty) * 100;
              const medals = ['🥇', '🥈', '🥉', '4th', '5th'];

              return (
                <div key={item.sku} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 max-w-[70%]">
                      <span className="text-xs font-bold shrink-0 w-6 h-6 rounded-full bg-pink-50 text-center flex items-center justify-center font-mono text-gray-700">
                        {medals[idx] || `${idx + 1}`}
                      </span>
                      <div className="truncate">
                        <span className="font-mono font-black text-xs text-gray-900 tracking-tight block">
                          {item.sku}
                        </span>
                        <span className="text-gray-500 text-[10px] font-bold block truncate">
                          {item.name} ({item.color})
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-extrabold text-[#EC4899] block">{item.qty} Pcs Sold</span>
                      <span className="text-[9px] text-gray-400 font-mono font-bold">{formatIDR(item.revenue)}</span>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-pink-50 rounded-full h-3 overflow-hidden border border-pink-100/40">
                      <div 
                        className="bg-gradient-to-r from-pink-400 to-[#EC4899] h-full rounded-full transition-all duration-500 relative"
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute right-1 top-0 h-full flex items-center">
                          <span className="text-[7px] text-white font-black">{Math.round(percentage)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {productSalesArr.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-xs font-bold">
                ⚠️ Belum ada transaksi penjualan yang selesai untuk digambar ke diagram.
              </div>
            )}
          </div>
        </div>

        {/* DIAGRAM DAN ANALISIS PELANGGAN TERLOAYAL */}
        <div className="bg-white border border-pink-100 p-5 rounded-[28px] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-pink-100/50 pb-2.5">
            <div className="space-y-0.5">
              <h4 className="font-extrabold text-indigo-700 text-xs uppercase tracking-wider">DIAGRAM PELANGGAN TERBAYAR TERBANYAK</h4>
              <p className="text-[10px] font-medium text-gray-400">Peringkat 5 mitra pelanggan berdasarkan akumulasi rupiah</p>
            </div>
            <span className="text-[10px] bg-indigo-100 text-indigo-700 font-black px-2.5 py-1 rounded-full uppercase">
              TOP 5 MITRA
            </span>
          </div>

          <div className="space-y-4 pt-1">
            {customerSalesArr.slice(0, 5).map((item, idx) => {
              const maxSpend = customerSalesArr[0]?.totalSpend || 1;
              const percentage = (item.totalSpend / maxSpend) * 100;
              const crowns = ['👑', '💎', '⭐', '4th', '5th'];

              return (
                <div key={item.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 max-w-[65%]">
                      <span className="text-xs font-bold shrink-0 w-6 h-6 rounded-full bg-indigo-50 text-center flex items-center justify-center font-mono text-gray-700">
                        {crowns[idx] || `${idx + 1}`}
                      </span>
                      <div className="truncate">
                        <span className="font-bold text-gray-900 tracking-tight block truncate">
                          {item.name}
                        </span>
                        <span className="inline-block bg-indigo-100 text-indigo-600 font-black px-1.5 py-0.2 rounded text-[8px] uppercase font-mono mt-0.5">
                          {item.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-mono font-extrabold text-indigo-700 block">{formatIDR(item.totalSpend)}</span>
                      <span className="text-[9px] text-[#EC4899] font-bold">{item.totalQty} Pcs Purchased</span>
                    </div>
                  </div>

                  {/* Horizontal Bar Chart for Customer Volume */}
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-indigo-50 rounded-full h-3 overflow-hidden border border-indigo-100/40">
                      <div 
                        className="bg-gradient-to-r from-indigo-400 to-indigo-600 h-full rounded-full transition-all duration-500 relative"
                        style={{ width: `${percentage}%` }}
                      >
                        <div className="absolute right-1 top-0 h-full flex items-center">
                          <span className="text-[7px] text-white font-black">{Math.round(percentage)}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            {customerSalesArr.length === 0 && (
              <div className="py-12 text-center text-gray-400 text-xs font-bold">
                ⚠️ Belum ada aktivitas transaksi pelanggan untuk digambar ke diagram.
              </div>
            )}
          </div>
        </div>

      </div>

      {/* Analysis Grid (Dead Stock, Fast Moving, Slow Moving) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Fast Moving */}
        <div className="bg-white border border-pink-100/60 p-5 rounded-[24px] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-pink-50 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">FAST MOVING (SKU)</h4>
            </div>
            <span className="text-[10px] bg-emerald-50 text-emerald-600 font-bold px-2.5 py-0.5 rounded-full">
              Harian Terbanyak
            </span>
          </div>

          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto pr-1">
            {fastMovingProducts.length > 0 ? (
              fastMovingProducts.map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5 max-w-[140px]">
                    <p className="font-bold text-gray-800 truncate">{p.name}</p>
                    <p className="text-[10px] font-mono text-gray-400">{p.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[#EC4899]">{p.qtySold} Sold</p>
                    <p className="text-[10px] text-gray-400">Stok: {p.stock}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-6">Belum ada produk penjualan &gt; 10 unit.</p>
            )}
          </div>
        </div>

        {/* Slow Moving */}
        <div className="bg-white border border-pink-100/60 p-5 rounded-[24px] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-pink-50 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-100 text-amber-600 rounded-lg">
                <TrendingDown className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">SLOW MOVING (SKU)</h4>
            </div>
            <span className="text-[10px] bg-amber-50 text-amber-600 font-bold px-2.5 py-0.5 rounded-full">
              Kurang Diminati
            </span>
          </div>

          <div className="divide-y divide-gray-50 max-h-64 overflow-y-auto pr-1">
            {slowMovingProducts.length > 0 ? (
              slowMovingProducts.slice(0, 10).map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5 max-w-[140px]">
                    <p className="font-bold text-gray-800 truncate">{p.name}</p>
                    <p className="text-[10px] font-mono text-gray-400">{p.sku}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-amber-600">{p.qtySold} Sold</p>
                    <p className="text-[10px] text-gray-400">Sisa Stok: {p.stock}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-6">Semua produk terjual di atas threshold.</p>
            )}
          </div>
        </div>

        {/* Dead Stock */}
        <div className="bg-white border border-pink-100/60 p-5 rounded-[24px] shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-pink-50 pb-3">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-red-100 text-red-600 rounded-lg">
                <AlertOctagon className="w-4 h-4" />
              </span>
              <h4 className="font-bold text-gray-900 text-xs uppercase tracking-wider">DEAD STOCK WARNING</h4>
            </div>
            <span className="text-[10px] bg-red-100 text-red-600 font-black px-2.5 py-0.5 rounded-full animate-pulse">
              ALERTI!
            </span>
          </div>

          <div className="divide-y divide-rose-50 max-h-64 overflow-y-auto pr-1">
            {deadStockProducts.length > 0 ? (
              deadStockProducts.map((p, idx) => (
                <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="space-y-0.5 max-w-[140px]">
                    <p className="font-bold text-gray-800 truncate">{p.Product_Name}</p>
                    <p className="text-[10px] font-mono text-gray-400">{p.SKU}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-red-600">{p.Current_Stock} Pcs di Rak</p>
                    <p className="text-[9px] text-gray-400">Value: {formatIDR(p.Current_Stock * p.Cost_Price)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-gray-400 text-center py-6">Kabar baik! Tidak ada dead stock terdeteksi.</p>
            )}
          </div>
        </div>

      </div>

      {/* Sales By Channel & Top Performers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Sales by Channel */}
        <div className="bg-white border border-pink-100 p-5 rounded-[32px] shadow-sm space-y-4">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">SALES REVENUE BY CHANNEL</h4>
          <div className="space-y-3">
            {Object.entries(channelTotals).map(([channel, total]) => {
              const percentage = (total / totalRevenue) * 100;
              return (
                <div key={channel} className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-700 font-semibold">
                    <span>{channel}</span>
                    <span>{formatIDR(total)} ({percentage.toFixed(0)}%)</span>
                  </div>
                  <div className="w-full bg-pink-100 rounded-full h-2">
                    <div 
                      className="bg-[#EC4899] h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {Object.keys(channelTotals).length === 0 && (
              <p className="text-xs text-gray-400 py-4 text-center">Belum ada transaksi penjualan selesai.</p>
            )}
          </div>
        </div>

        {/* Top Performer Summaries */}
        <div className="bg-[#FFF8FB] border border-pink-100/60 p-5 rounded-[32px] shadow-sm flex flex-col justify-between">
          <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700 mb-4">PERFORMANCE TROPHY</h4>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-pink-100/40 text-center space-y-2">
              <Award className="w-8 h-8 text-[#EC4899] mx-auto" />
              <p className="text-[10px] font-bold text-gray-400 uppercase">BEST SKU</p>
              <p className="text-xs font-bold text-indigo-950 truncate">{bestSellingProduct.name}</p>
              <span className="inline-block text-[10px] bg-pink-100 text-[#EC4899] font-bold px-3 py-0.5 rounded-full">
                {bestSellingProduct.qty} Units Sold
              </span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-pink-100/40 text-center space-y-2">
              <Award className="w-8 h-8 text-amber-500 mx-auto" />
              <p className="text-[10px] font-bold text-gray-400 uppercase">TOP CUSTOMER</p>
              <p className="text-xs font-bold text-gray-800 truncate">{topCustomerName}</p>
              {customerSalesMap[topCustomerName] && (
                <span className="inline-block text-[10px] bg-amber-150 text-amber-700 font-bold px-3 py-0.5 rounded-full bg-amber-50">
                  {formatIDR(customerSalesMap[topCustomerName].totalSpend)} ({customerSalesMap[topCustomerName].totalQty} Pcs)
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 bg-white/70 backdrop-blur border border-pink-150 p-3 rounded-2xl text-[11px] text-pink-700 font-medium">
            🎯 <strong>Saran Finansial:</strong> Margin kotor rata-rata berada pada {grossMargin.toFixed(1)}%. Sangat disarankan untuk memperbanyak restock segment <strong>CELAMIS JUMBO</strong> karena memiliki turnaround paling dinamis bulan ini.
          </div>
        </div>

      </div>

    </div>
  );
}

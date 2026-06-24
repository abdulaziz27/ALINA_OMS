/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Layers, PieChart } from 'lucide-react';
import { Product } from '../../types.ts';

interface ProductStatsProps {
  productsList: Product[];
}

export default function ProductStats({ productsList }: ProductStatsProps) {
  const categoryStats = useMemo(() => {
    const stats: Record<string, { skusCount: number; totalStock: number }> = {};
    productsList.forEach(p => {
      const cat = p.Category || 'Lainnya';
      if (!stats[cat]) {
        stats[cat] = { skusCount: 0, totalStock: 0 };
      }
      stats[cat].skusCount += 1;
      stats[cat].totalStock += (p.Current_Stock || 0);
    });
    return Object.entries(stats).map(([catName, data]) => ({
      category: catName,
      skusCount: data.skusCount,
      totalStock: data.totalStock
    })).sort((a, b) => b.totalStock - a.totalStock);
  }, [productsList]);

  const variantStats = useMemo(() => {
    const stats: Record<string, { skusCount: number; totalStock: number }> = {};
    productsList.forEach(p => {
      const vr = p.Variant || 'Lainnya';
      if (!stats[vr]) {
        stats[vr] = { skusCount: 0, totalStock: 0 };
      }
      stats[vr].skusCount += 1;
      stats[vr].totalStock += (p.Current_Stock || 0);
    });
    return Object.entries(stats).map(([vName, data]) => ({
      variant: vName,
      skusCount: data.skusCount,
      totalStock: data.totalStock
    })).sort((a, b) => b.totalStock - a.totalStock);
  }, [productsList]);

  const combinationStats = useMemo(() => {
    const stats: Record<string, { category: string; variant: string; skusCount: number; totalStock: number }> = {};
    productsList.forEach(p => {
      const cat = p.Category || 'Lainnya';
      const vr = p.Variant || 'All Size';
      const key = `${cat} - ${vr}`;
      if (!stats[key]) {
        stats[key] = { category: cat, variant: vr, skusCount: 0, totalStock: 0 };
      }
      stats[key].skusCount += 1;
      stats[key].totalStock += (p.Current_Stock || 0);
    });
    return Object.entries(stats).map(([key, data]) => ({
      key,
      category: data.category,
      variant: data.variant,
      skusCount: data.skusCount,
      totalStock: data.totalStock
    })).sort((a, b) => b.totalStock - a.totalStock);
  }, [productsList]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 text-left font-sans">
      {/* Combination Summation Card (2/3 width on large screens) */}
      <div className="bg-white rounded-[32px] border border-pink-100/75 p-5 shadow-sm space-y-4 lg:col-span-2">
        <div className="flex items-center gap-2.5 pb-2 border-b border-pink-50">
          <div className="p-2 bg-pink-50 rounded-xl">
            <Layers className="w-4 h-4 text-[#EC4899]" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-700">Ringkasan Kategori & Varian (Total)</h4>
            <span className="text-[10px] text-gray-400 block font-medium">Pengelompokan total fisik stok untuk setiap kombinasi Kategori dan Varian</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1">
          {combinationStats.map((stat) => (
            <div key={stat.key} className="bg-pink-50/15 rounded-2xl p-3.5 border border-pink-100/20 flex items-center justify-between gap-4 hover:border-pink-200/60 hover:bg-pink-50/30 transition shadow-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-gray-800 text-[11px] block leading-tight">
                  {stat.category} - {stat.variant} (total)
                </span>
                <span className="text-[9px] text-[#EC4899] font-black uppercase tracking-wider bg-pink-100/30 px-2 py-0.5 rounded-md">
                  {stat.skusCount} SKU
                </span>
              </div>
              <div className="text-right shrink-0">
                <span className="text-xs font-black text-[#EC4899] bg-pink-50/90 border border-pink-100/30 px-3 py-1.5 rounded-xl font-mono shadow-inner">
                  {stat.totalStock.toLocaleString()} Pcs
                </span>
              </div>
            </div>
          ))}
          {combinationStats.length === 0 && (
            <p className="text-center py-6 col-span-2 text-gray-400 text-xs font-semibold">Belum ada data kombinasi produk.</p>
          )}
        </div>
      </div>

      {/* Separated Individual Summaries (1/3 width on large screens) */}
      <div className="space-y-6 lg:col-span-1">
        {/* Category Summation Card */}
        <div className="bg-white rounded-[32px] border border-pink-100/75 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-pink-50">
            <div className="p-1.5 bg-pink-50 rounded-xl">
              <Layers className="w-3.5 h-3.5 text-[#EC4899]" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">Total Per Kategori</h4>
            </div>
          </div>
          
          <div className="space-y-2 max-h-[145px] overflow-y-auto pr-1">
            {categoryStats.map((stat) => (
              <div key={stat.category} className="flex items-center justify-between gap-2 py-1 text-xs border-b border-pink-50/30 last:border-0">
                <span className="font-semibold text-gray-600 text-[11px] truncate">{stat.category}</span>
                <span className="font-bold text-[#EC4899] shrink-0 font-mono text-[11px]">{stat.totalStock.toLocaleString()} Pcs</span>
              </div>
            ))}
          </div>
        </div>

        {/* Variant Summation Card */}
        <div className="bg-white rounded-[32px] border border-pink-100/75 p-5 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-pink-50">
            <div className="p-1.5 bg-pink-50 rounded-xl">
              <PieChart className="w-3.5 h-3.5 text-[#EC4899]" />
            </div>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">Total Per Varian</h4>
            </div>
          </div>
          
          <div className="space-y-2 max-h-[145px] overflow-y-auto pr-1">
            {variantStats.map((stat) => (
              <div key={stat.variant} className="flex items-center justify-between gap-2 py-1 text-xs border-b border-pink-50/30 last:border-0">
                <span className="font-semibold text-gray-600 text-[11px] truncate">Varian {stat.variant}</span>
                <span className="font-bold text-[#EC4899] shrink-0 font-mono text-[11px]">{stat.totalStock.toLocaleString()} Pcs</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

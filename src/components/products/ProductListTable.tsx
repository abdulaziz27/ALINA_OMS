/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Plus, Trash2, FileDown, Upload, Search, AlertTriangle } from 'lucide-react';
import { Product, UserRole } from '../../types.ts';

interface ProductListTableProps {
  productsList: Product[];
  currentUser: { Full_Name: string; Email: string; Role: UserRole } | null;
  handleSelectProduct: (p: Product) => void;
  setProductToDelete: (p: Product | null) => void;
  handleCreateNewClick: () => void;
  handleExportCSV: () => void;
  handleImportCSVLocalInput: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ProductListTable({
  productsList,
  currentUser,
  handleSelectProduct,
  setProductToDelete,
  handleCreateNewClick,
  handleExportCSV,
  handleImportCSVLocalInput
}: ProductListTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedClassification, setSelectedClassification] = useState<string>('All');
  const [selectedVariantFilter, setSelectedVariantFilter] = useState<string>('All');

  const getProductClassification = (catName: string): 'Celamis' | 'Jilbab' | 'Lainnya' => {
    const cat = catName.toLowerCase();
    if (cat.includes('celamis')) return 'Celamis';
    if (cat.includes('jilbab')) return 'Jilbab';
    return 'Lainnya';
  };

  const filteredProducts = productsList.filter(p => {
    const matchesSearch = 
      p.Product_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.SKU.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.Category.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesClassification = true;
    if (selectedClassification !== 'All') {
      matchesClassification = getProductClassification(p.Category) === selectedClassification;
    }

    let matchesVariant = true;
    if (selectedVariantFilter !== 'All') {
      matchesVariant = p.Variant === selectedVariantFilter;
    }

    return matchesSearch && matchesClassification && matchesVariant;
  });

  return (
    <>
      {/* Control Bar */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-4 rounded-[24px] border border-pink-100/60 shadow-sm">
        <div className="relative w-full md:w-80">
          <input
            type="text"
            id="product-search-input"
            placeholder="Cari produk name, SKU, kategori..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-pink-50/50 text-gray-900 placeholder-gray-400 border border-pink-100 rounded-xl py-2 px-3 pl-9 text-xs focus:outline-none focus:border-pink-500"
          />
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            id="add-product-btn"
            onClick={handleCreateNewClick}
            className="bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-2 px-4 rounded-xl cursor-pointer transition text-xs flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Tambah Produk Baru
          </button>

          <button
            onClick={handleExportCSV}
            className="bg-pink-50/50 hover:bg-pink-50 text-[#EC4899] border border-pink-100 font-semibold py-2 px-3 rounded-xl cursor-pointer transition text-xs flex items-center gap-1.5"
          >
            <FileDown className="w-4 h-4" />
            Export CSV
          </button>

          <label className="bg-pink-50/50 hover:bg-pink-50 text-gray-700 border border-gray-200 font-semibold py-2 px-3 rounded-xl cursor-pointer transition text-xs flex items-center gap-1.5">
            <Upload className="w-4 h-4" />
            Import CSV
            <input
              type="file"
              accept=".csv"
              onChange={handleImportCSVLocalInput}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Filters: Klasifikasi dan Varian Detail */}
      <div className="bg-white p-4 rounded-[24px] border border-pink-100/60 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs font-sans">
        <div className="flex flex-col gap-1.5 text-left">
          <span className="font-extrabold text-gray-400 uppercase tracking-widest text-[9px]">Klasifikasi Produk</span>
          <div className="flex items-center gap-1 p-1 bg-pink-50/40 border border-pink-100/30 rounded-xl w-fit">
            {[
              { id: 'All', label: 'Semua Klasifikasi' },
              { id: 'Celamis', label: 'Celamis' },
              { id: 'Jilbab', label: 'Jilbab' }
            ].map(tab => {
              const active = selectedClassification === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => {
                    setSelectedClassification(tab.id);
                    setSelectedVariantFilter('All');
                  }}
                  className={`px-3.5 py-1.5 rounded-lg font-bold transition-all text-[11px] cursor-pointer ${
                    active 
                      ? 'bg-[#EC4899] text-white shadow-sm font-black scale-102' 
                      : 'text-gray-500 hover:text-gray-800 hover:bg-pink-100/35'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-col gap-1.5 text-left w-full md:w-64">
          <span className="font-extrabold text-gray-400 uppercase tracking-widest text-[9px]">Varian Spesifik ({selectedClassification === 'All' ? 'Semua' : selectedClassification})</span>
          <select
            value={selectedVariantFilter}
            onChange={(e) => setSelectedVariantFilter(e.target.value)}
            className="w-full bg-pink-50/20 text-gray-700 font-bold border border-pink-100 rounded-xl py-2 px-3 focus:outline-none focus:border-pink-500 text-xs shadow-inner"
          >
            <option value="All">Semua Varian</option>
            {Array.from(
              new Set(
                productsList
                  .filter(p => {
                    if (selectedClassification === 'All') return true;
                    return getProductClassification(p.Category) === selectedClassification;
                  })
                  .map(p => p.Variant)
              )
            )
              .filter(Boolean)
              .sort()
              .map(v => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Master Layout - Full Width Table / List */}
      <div className="bg-white rounded-[32px] border border-pink-100/70 p-5 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-pink-50">
          <div className="text-left">
            <h4 className="font-extrabold text-sm uppercase tracking-wider text-gray-700">Database Product Master</h4>
            <span className="text-[10px] text-gray-400 block font-medium">Ketuk produk untuk mengubah detail atau mencetak label Code128.</span>
          </div>
          <span className="text-[10px] bg-pink-50 text-[#EC4899] px-3 py-0.5 rounded-full font-mono font-bold">
            {filteredProducts.length} entries
          </span>
        </div>

        {/* Desktop View: Wide Beautiful Layout */}
        <div className="hidden md:block overflow-x-auto max-h-[500px]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-pink-50 text-gray-400 uppercase font-mono tracking-wider">
                <th className="py-3 px-3">SKU / Produk</th>
                <th className="py-3 px-3">Kategori</th>
                <th className="py-3 px-3 text-right">Harga Modal</th>
                <th className="py-3 px-3 text-right">Harga Ritel</th>
                <th className="py-3 px-3 text-center">Stok</th>
                <th className="py-3 px-3 text-center">Status</th>
                {currentUser?.Role === 'Owner Alina' && <th className="py-3 px-3 text-center">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-pink-50/50">
              {filteredProducts.map((p, idx) => {
                const urgent = p.Current_Stock <= p.Minimum_Stock;
                return (
                  <tr 
                    key={p.Product_ID || p.SKU || `prod-${idx}`}
                    onClick={() => handleSelectProduct(p)}
                    className="hover:bg-[#FFF8FB] transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 px-3">
                      <div className="font-extrabold text-gray-900 text-sm">{p.Product_Name}</div>
                      <div className="text-[10px] font-mono text-[#EC4899] font-bold tracking-wider">{p.SKU}</div>
                    </td>
                    <td className="py-3.5 px-3 text-gray-500 font-medium">
                      {p.Category}
                      <div className="text-[10px] text-gray-400">{p.Variant}</div>
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-gray-600">
                      {currentUser?.Role === 'Owner Alina' ? `Rp ${p.Cost_Price.toLocaleString()}` : '***'}
                    </td>
                    <td className="py-3.5 px-3 text-right font-mono text-gray-900 font-bold">
                      Rp {p.Retail_Price.toLocaleString()}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full font-black ${
                        urgent ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'
                      }`}>
                        {p.Current_Stock} Pcs
                      </span>
                      {urgent && <div className="text-[9px] text-red-500 font-bold mt-0.5 animate-pulse">LOW STOCK</div>}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        p.Status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                      }`}>
                        {p.Status === 'Active' ? 'Aktif' : 'Non-Aktif'}
                      </span>
                    </td>
                    {currentUser?.Role === 'Owner Alina' && (
                      <td className="py-3.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => setProductToDelete(p)}
                          className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition cursor-pointer border border-transparent hover:border-red-100 flex items-center justify-center mx-auto"
                          title="Hapus Produk"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}

              {filteredProducts.length === 0 && (
                <tr>
                  <td colSpan={currentUser?.Role === 'Owner Alina' ? 7 : 6} className="text-center py-10 text-gray-400">Tidak ada produk ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile View: High Quality Cards (eliminates horizontal overflow) */}
        <div className="grid grid-cols-1 gap-3.5 md:hidden max-h-[550px] overflow-y-auto pr-1">
          {filteredProducts.map((p, idx) => {
            const urgent = p.Current_Stock <= p.Minimum_Stock;
            return (
              <div 
                key={p.Product_ID || p.SKU || `prod-mobile-${idx}`}
                onClick={() => handleSelectProduct(p)}
                className="bg-white border rounded-2xl p-4.5 transition-all text-left flex flex-col gap-3.5 relative shadow-sm cursor-pointer border-pink-100/50 hover:border-pink-200"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="space-y-1">
                    <span className="text-[9px] font-black font-mono text-[#EC4899] bg-[#FFF3F8] py-0.5 px-2.5 rounded-md uppercase tracking-wider">
                      {p.SKU}
                    </span>
                    <h5 className="font-extrabold text-sm text-gray-900 leading-tight">
                      {p.Product_Name}
                    </h5>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded-full text-center ${
                      p.Status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                    }`}>
                      {p.Status === 'Active' ? 'Aktif' : 'Non-Aktif'}
                    </span>
                    {currentUser?.Role === 'Owner Alina' && (
                      <button
                        type="button"
                        onClick={() => setProductToDelete(p)}
                        className="p-1.5 text-red-500 hover:bg-red-100/50 rounded-xl transition cursor-pointer border border-transparent hover:border-red-100 flex items-center justify-center"
                        title="Hapus Produk"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-end border-t border-dashed border-pink-100/60 pt-3">
                  <div className="text-xs">
                    <span className="text-[9px] text-gray-400 font-extrabold uppercase tracking-wider block mb-0.5">Brand Kategori</span>
                    <span className="font-extrabold text-gray-800">{p.Category}</span>
                    <span className="text-gray-400 text-[10px] block font-medium">{p.Variant}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] text-[#EC4899] font-extrabold uppercase tracking-wider block mb-0.5">Jumlah Stok</span>
                    <span className={`inline-block px-2.5 py-0.5 rounded-full font-black ${
                      urgent ? 'bg-red-50 text-red-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'
                    }`}>
                      {p.Current_Stock} Pcs
                    </span>
                  </div>
                </div>

                <div className="flex justify-between items-center bg-pink-50/30 p-2.5 rounded-xl border border-pink-100/20 text-xs gap-3">
                  <div>
                    <span className="text-gray-400 text-[9px] block uppercase font-mono tracking-wider">Harga Jual</span>
                    <span className="font-extrabold text-gray-900">Rp {p.Retail_Price.toLocaleString()}</span>
                  </div>
                  {currentUser?.Role === 'Owner Alina' && (
                    <div className="text-right">
                      <span className="text-gray-400 text-[9px] block uppercase font-mono tracking-wider">Harga Modal</span>
                      <span className="font-mono font-bold text-pink-600">Rp {p.Cost_Price.toLocaleString()}</span>
                    </div>
                  )}
                </div>

                {urgent && (
                  <div className="bg-red-50 border border-red-100 text-red-600 text-[10px] font-bold p-2.5 rounded-xl flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 animate-bounce" />
                    <span>Perlu Restock! Threshold minimal {p.Minimum_Stock} pcs</span>
                  </div>
                )}
              </div>
            );
          })}

          {filteredProducts.length === 0 && (
            <p className="text-center py-10 text-gray-400 text-xs font-semibold">Tidak ada produk ditemukan.</p>
          )}
        </div>
      </div>
    </>
  );
}

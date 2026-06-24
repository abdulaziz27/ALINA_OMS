/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Save, Trash2, X, Tag, Download, Printer, AlertTriangle, CheckCircle } from 'lucide-react';
import { Product, UserRole } from '../../types.ts';
import { generateAutoSKU } from '../../barcodeUtils.ts';
import { QRCodeSVG } from 'qrcode.react';

interface ColorPreset {
  name: string;
  hex: string;
  border?: boolean;
}

const celamisRegularColors: ColorPreset[] = [
  { name: 'Hitam', hex: '#111827' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Abu²', hex: '#9CA3AF' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Coksu', hex: '#D2B48C' },
  { name: 'Coktu', hex: '#5C4033' },
  { name: 'Ungu Tua', hex: '#581C87' },
  { name: 'Toska', hex: '#0F766E' },
  { name: 'Plum Truffle', hex: '#4E2F4F' },
  { name: 'Magenta', hex: '#D946EF' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Hijau Army', hex: '#3F6212' },
  { name: 'Mint', hex: '#A7F3D0' }
];

const celamisRibColors: ColorPreset[] = [
  { name: 'Hitam', hex: '#111827' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Abu²', hex: '#9CA3AF' },
  { name: 'Coktu', hex: '#5C4033' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Maroon', hex: '#991B1B' }
];

const celamisShortPantsColors: ColorPreset[] = [
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Pink', hex: '#FBCFE8' },
  { name: 'Ungu Muda', hex: '#E9D5FF' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'Hijau Mint', hex: '#A7F3D0' },
  { name: 'Magenta', hex: '#D946EF' },
  { name: 'Hitam', hex: '#111827' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Coktu', hex: '#5C4033' }
];

const celamisKidsColors: ColorPreset[] = [
  { name: 'Hitam', hex: '#111827' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Coktu', hex: '#5C4033' },
  { name: 'Pink', hex: '#FBCFE8' },
  { name: 'Ungu Muda', hex: '#E9D5FF' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'Hijau Mint', hex: '#A7F3D0' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Abu²', hex: '#9CA3AF' },
  { name: 'Coksu', hex: '#D2B48C' }
];

const celamisKidsRibColors: ColorPreset[] = [
  { name: 'Hitam', hex: '#111827' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Coktu', hex: '#5C4033' },
  { name: 'Pink', hex: '#FBCFE8' },
  { name: 'Ungu Muda', hex: '#E9D5FF' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'Hijau Mint', hex: '#A7F3D0' },
  { name: 'Peach', hex: '#FDBA74' },
  { name: 'Abu²', hex: '#9CA3AF' },
  { name: 'Coksu', hex: '#D2B48C' }
];

const jilbabWoolpeachColors: ColorPreset[] = [
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Milo', hex: '#A58B74' },
  { name: 'Hijau Army', hex: '#3F6212' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Abu abu', hex: '#9CA3AF' },
  { name: 'Tosca', hex: '#0F766E' },
  { name: 'Hitam', hex: '#111827' },
  { name: 'Dark Lavender', hex: '#5E3A8C' },
  { name: 'Coklat tua', hex: '#3E2723' }
];

const jilbabWollycrapeColors: ColorPreset[] = [
  { name: 'Hijau Army', hex: '#3F6212' },
  { name: 'Hijau Botol', hex: '#064E3B' },
  { name: 'OffWhite', hex: '#FAF9F6', border: true },
  { name: 'Hitam', hex: '#111827' },
  { name: 'Abu abu', hex: '#9CA3AF' },
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Milo', hex: '#A58B74' },
  { name: 'Coklat susu', hex: '#D2B48C' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Pink', hex: '#FBCFE8' },
  { name: 'Lavender', hex: '#E9D5FF' },
  { name: 'Coklat tua', hex: '#3E2723' }
];

const jilbabAnakColors: ColorPreset[] = [
  { name: 'Navy', hex: '#1E3A8A' },
  { name: 'Light Cream', hex: '#FFFDD0', border: true },
  { name: 'Baby Pink', hex: '#FFD1DC' },
  { name: 'Hitam', hex: '#111827' },
  { name: 'Maroon', hex: '#991B1B' },
  { name: 'Putih', hex: '#FFFFFF', border: true },
  { name: 'Abu abu', hex: '#9CA3AF' },
  { name: 'Biru langit', hex: '#87CEEB' },
  { name: 'Coklat susu', hex: '#D2B48C' },
  { name: 'Kuning', hex: '#FBBF24' },
  { name: 'merah', hex: '#EF4444' },
  { name: 'Magenta', hex: '#D946EF' },
  { name: 'Mint', hex: '#A7F3D0' }
];

export const getColorsByCategory = (cat: string): ColorPreset[] => {
  switch (cat) {
    case 'Celamis Regular': return celamisRegularColors;
    case 'Celamis Rib': return celamisRibColors;
    case 'Celamis Short Pants': return celamisShortPantsColors;
    case 'Celamis Kids': return celamisKidsColors;
    case 'Celamis Kids Rib': return celamisKidsRibColors;
    case 'Jilbab Woolpeach Pad':
    case 'Jilbab Woolpeach Softpad': return jilbabWoolpeachColors;
    case 'Jilbab Wollycrepe Pad':
    case 'Jilbab Wollycrepe Softpad': return jilbabWollycrapeColors;
    case 'Jilbab Anak': return jilbabAnakColors;
    default: return celamisRegularColors;
  }
};

export const getVariantsByCategory = (cat: string): string[] => {
  switch (cat) {
    case 'Celamis Regular':
    case 'Celamis Rib':
    case 'Celamis Short Pants':
      return ['All Size', 'Jumbo', 'Ekstra Jumbo'];
    case 'Celamis Kids':
    case 'Celamis Kids Rib':
      return ['Kids 1', 'Kids 2', 'Kids 3'];
    case 'Jilbab Woolpeach Pad':
    case 'Jilbab Woolpeach Softpad':
    case 'Jilbab Wollycrepe Pad':
    case 'Jilbab Wollycrepe Softpad':
      return ['M', 'L', 'XL'];
    case 'Jilbab Anak':
      return ['Jilbab Anak 1', 'Jilbab Anak 2', 'Jilbab Anak 3'];
    default:
      return ['All Size'];
  }
};

interface ProductEditorProps {
  isCreatingNew: boolean;
  isEditing: boolean;
  selectedProduct: Product | null;
  productsList: Product[];
  categoryList: string[];
  currentUser: { Full_Name: string; Email: string; Role: UserRole } | null;
  onClose: () => void;
  onSaveProduct: (prod: Partial<Product>, isNew: boolean, id?: string) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  productToDeleteLocal: Product | null;
  setProductToDeleteLocal: (p: Product | null) => void;
}

export default function ProductEditor({
  isCreatingNew,
  isEditing,
  selectedProduct,
  productsList,
  categoryList,
  currentUser,
  onClose,
  onSaveProduct,
  onDeleteProduct,
  productToDeleteLocal,
  setProductToDeleteLocal
}: ProductEditorProps) {
  // Local Form fields
  const [sku, setSku] = useState('');
  const [prodName, setProdName] = useState('');
  const [category, setCategory] = useState('Celamis Regular');
  const [variant, setVariant] = useState('');
  const [color, setColor] = useState('');
  const [size, setSize] = useState('All Size');
  const [costPrice, setCostPrice] = useState<number | string>('');
  const [sellingPrice, setSellingPrice] = useState<number | string>('');
  const [minStock, setMinStock] = useState<number | string>(10);
  const [currentStock, setCurrentStock] = useState<number | string>('');
  const [status, setStatus] = useState<'Active' | 'Discontinued'>('Active');
  
  const [notif, setNotif] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const triggerNotif = (type: 'success' | 'error', text: string) => {
    setNotif({ type, text });
    setTimeout(() => setNotif(null), 4000);
  };

  // Init form state based on open mode
  useEffect(() => {
    if (isEditing && selectedProduct) {
      setSku(selectedProduct.SKU);
      setProdName(selectedProduct.Product_Name);
      setCategory(selectedProduct.Category);
      setVariant(selectedProduct.Variant);
      setColor(selectedProduct.Color);
      setSize(selectedProduct.Size);
      setCostPrice(selectedProduct.Cost_Price);
      setSellingPrice(selectedProduct.Selling_Price);
      setMinStock(selectedProduct.Minimum_Stock);
      setCurrentStock(selectedProduct.Current_Stock);
      setStatus(selectedProduct.Status);
    } else if (isCreatingNew) {
      const skuCode = generateAutoSKU('Celamis Regular', productsList.map(p => p.SKU));
      setSku(skuCode);
      setProdName('CELAMIS REGULAR ALL SIZE (HITAM)');
      setCategory('Celamis Regular');
      setColor('Hitam');
      setCostPrice('');
      setSellingPrice('');
      setMinStock(10);
      setCurrentStock('');
      setStatus('Active');
    }
  }, [isEditing, isCreatingNew, selectedProduct, productsList]);

  // Preset variants values based on categories chosen
  useEffect(() => {
    const list = getVariantsByCategory(category);
    if (list.length > 0) {
      const hasVariantMatch = list.includes(variant);
      if (!isEditing && !hasVariantMatch) {
        setVariant(list[0]);
        setSize(list[0]);
      }
    }
  }, [category, isEditing]);

  // Synchronize size with variant automatically
  useEffect(() => {
    if (variant) {
      setSize(variant);
    }
  }, [variant]);

  // Synchronize SKU Code automatically when categories change for new products
  useEffect(() => {
    if (isCreatingNew) {
      const skuCode = generateAutoSKU(category, productsList.map(p => p.SKU));
      setSku(skuCode);
    }
  }, [category, isCreatingNew, productsList]);

  // Automatically compile product name from: Brand Kategori + Variant pilihan + (Warna)
  useEffect(() => {
    if (category && variant && color) {
      setProdName(`${category} ${variant} (${color})`.toUpperCase().replace(/\s+/g, ' ').trim());
    } else if (category && color) {
      setProdName(`${category} (${color})`.toUpperCase().replace(/\s+/g, ' ').trim());
    }
  }, [category, variant, color]);

  // Set default color when category changes for new products
  useEffect(() => {
    const list = getColorsByCategory(category);
    if (list.length > 0) {
      const hasColorMatch = list.some(c => c.name.toLowerCase() === color.toLowerCase());
      if (!isEditing && !hasColorMatch) {
         setColor(list[0].name);
      }
    }
  }, [category, isEditing]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sku || !prodName) {
      triggerNotif('error', 'Semua kolom SKU dan Nama Produk wajib diisi.');
      return;
    }

    const payload: Partial<Product> = {
      SKU: sku,
      Product_Name: prodName,
      Category: category,
      Variant: variant,
      Color: color,
      Size: size,
      Cost_Price: Number(costPrice),
      Selling_Price: Number(sellingPrice),
      Current_Stock: Number(currentStock),
      Minimum_Stock: Number(minStock),
      Status: status,
      Barcode: sku,
      QR_Code: sku
    };

    const success = await onSaveProduct(payload, isCreatingNew, selectedProduct?.Product_ID);
    if (success) {
      onClose();
      alert('Data sudah tersimpan');
    } else {
      alert('Gagal menyimpan produk. SKU mungkin sudah terdaftar.');
    }
  };

  const handleDeleteClick = () => {
    if (!selectedProduct) return;
    setProductToDeleteLocal(selectedProduct);
  };

  const handleConfirmDelete = async () => {
    if (!productToDeleteLocal) return;
    const success = await onDeleteProduct(productToDeleteLocal.Product_ID);
    if (success) {
      triggerNotif('success', 'Produk berhasil dihapus.');
      setProductToDeleteLocal(null);
      // If we deleted the currently selected product being edited, close its modal edit popup
      if (selectedProduct?.Product_ID === productToDeleteLocal.Product_ID) {
        onClose();
      }
    } else {
      triggerNotif('error', 'Gagal menghapus produk.');
    }
  };

  const handleDownloadBarcode = (targetSku: string, targetName: string) => {
    const svgElement = document.getElementById(`barcode-svg-${targetSku}`);
    if (!svgElement) {
      triggerNotif('error', 'Sumber QR Code tidak ditemukan.');
      return;
    }
    const svgString = new XMLSerializer().serializeToString(svgElement);
    const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    const svgUrl = URL.createObjectURL(svgBlob);
    
    const downloadLink = document.createElement("a");
    downloadLink.href = svgUrl;
    downloadLink.download = `ALINA_QRCODE_${targetSku}.svg`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(svgUrl);
    triggerNotif('success', `Berhasil mengunduh QR Code untuk SKU ${targetSku}`);
  };

  const handlePrintLabel = (p: Product) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    
    // We only use QR Code now
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${p.SKU}`;

    printWindow.document.write(`
      <html>
        <head>
          <title>PRINT LABEL - ${p.SKU}</title>
          <style>
            body { font-family: 'Courier New', monospace; text-align: center; padding: 20px; }
            .label-card { border: 2px solid #ccc; border-radius: 12px; padding: 15px; width: 320px; margin: 0 auto; background: #fff; }
            .brand-h { font-size: 14px; font-weight: bold; margin-bottom: 2px; letter-spacing: 1px; color: #EC4899; }
            .prod-n { font-size: 11px; margin-bottom: 8px; font-weight: bold; }
            .meta { font-size: 9px; margin-bottom: 15px; border-bottom: 1px dashed #ccc; padding-bottom: 5px; }
            .qr-center { margin-top: 10px; display: flex; flex-direction: column; align-items: center; justify-content: center; }
          </style>
        </head>
        <body onload="window.print()">
          <div class="label-card">
            <div class="brand-h">Alina Official</div>
            <div class="prod-n">${p.Product_Name}</div>
            <div class="meta">COLOR: ${p.Color} | SIZE: ${p.Size} | VARIANT: ${p.Variant}</div>
            
            <div class="qr-center">
              <img src="${qrUrl}" width="120" height="120" />
              <div style="font-size:12px; font-weight:bold; margin-top:6px;">${p.SKU}</div>
              <div style="font-size:8px; font-weight:bold; margin-top:2px;">SCAN COMPLIANT</div>
            </div>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  if (!isCreatingNew && !isEditing && !productToDeleteLocal) return null;

  return (
    <>
      {/* Toast Notification */}
      {notif && (
        <div className={`fixed bottom-4 right-4 z-[110] p-4 rounded-2xl text-white text-xs font-bold shadow-xl flex items-center gap-2 ${
          notif.type === 'success' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
        }`}>
          <CheckCircle className="w-4 h-4" />
          {notif.text}
        </div>
      )}

      {/* Floating Liquid Glass Modal Popup Overlay for Creating and Editing Products */}
      {(isCreatingNew || isEditing) && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-[32px] border border-pink-100 p-5 sm:p-6 shadow-2xl relative space-y-4 max-h-[92vh] overflow-y-auto animate-[fadeIn_0.2s_ease-out]">
          
          <form onSubmit={handleFormSubmit} className="space-y-4 text-xs text-gray-700 text-left">
            
            {/* Header Modal popup */}
            <div className="flex justify-between items-center pb-3 border-b border-pink-100/60 mb-2">
              <h4 className="font-black text-[#EC4899] uppercase tracking-widest text-xs">
                {isCreatingNew ? '💡 BUAT SKU BARU' : '📝 EDIT DETAIL PRODUK'}
              </h4>
              <div className="flex items-center gap-1.5">
                {isEditing && currentUser?.Role === 'OWNER' && (
                  <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="p-1.5 text-red-500 hover:bg-red-50 rounded-xl cursor-pointer transition border border-transparent hover:border-red-100 mr-1"
                    title="Hapus Produk"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl cursor-pointer transition flex items-center justify-center"
                  title="Tutup"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* SKU Section (LOCKED & AUTO-GENERATED) */}
            <div className="bg-gray-50 p-3.5 rounded-2xl space-y-2 border border-gray-100">
              <div className="flex items-center justify-between">
                <label className="font-bold text-gray-500 uppercase text-[10px] tracking-wider">SUITE SKU CODE (Otomatis)</label>
                <span className="text-[9px] bg-pink-100 text-[#EC4899] font-black px-2 py-0.5 rounded-full font-mono uppercase">
                  LOCKED
                </span>
              </div>
              <input
                type="text"
                id="form-sku-input"
                required
                readOnly
                disabled
                placeholder="Generating SKU..."
                value={sku}
                className="w-full bg-gray-100/70 border border-gray-200 text-gray-500 font-mono font-black tracking-widest rounded-xl py-2 px-3 text-xs focus:outline-none cursor-not-allowed select-all"
              />
            </div>

            {/* Categorization */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block uppercase tracking-wider">Brand Kategori</label>
                <select
                  id="form-category-select"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white border border-pink-100 text-gray-700 rounded-xl py-2 px-3 focus:outline-none focus:border-pink-500 text-xs font-bold"
                >
                  {categoryList.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block uppercase tracking-wider">Variant Pilihan</label>
                <select
                  value={variant}
                  onChange={(e) => setVariant(e.target.value)}
                  className="w-full bg-white border border-pink-100 text-gray-700 rounded-xl py-2 px-3 focus:outline-none focus:border-pink-500 text-xs font-bold"
                >
                  {getVariantsByCategory(category).map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Product Name (Derived Automatically) */}
            <div className="space-y-1 bg-pink-50/40 p-3 rounded-2xl border border-pink-100/60">
              <label className="font-bold text-pink-600 block uppercase tracking-widest text-[9px]">Nama Produk Master (Otomatis)</label>
              <div className="font-extrabold text-sm text-gray-900 uppercase tracking-wide">
                {prodName || 'Pilih Kategori dan Warna...'}
              </div>
              <p className="text-[10px] text-gray-400">Nama produk disusun secara otomatis dari kombinasi Brand Kategori + Variant + (Warna) agar seragam.</p>
            </div>

            {/* Color Dot Picker */}
            <div className="space-y-3.5">
              {/* Dot Color Picker */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <label className="font-extrabold text-pink-600 block uppercase tracking-widest text-[9px] mb-1">Pilihan Warna Muslimah (Dot Warna)</label>
                  <span className="text-[9px] bg-pink-100 text-[#EC4899] font-black px-2 py-0.5 rounded-full uppercase">
                    {getColorsByCategory(category).length} Warna
                  </span>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 bg-pink-50/20 rounded-2xl border border-pink-100/30 max-h-[180px] overflow-y-auto">
                  {getColorsByCategory(category).map((c) => {
                    const isSelected = color.toLowerCase() === c.name.toLowerCase();
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setColor(c.name)}
                        className={`flex items-center gap-2 p-2 rounded-xl text-left border cursor-pointer transition-all ${
                          isSelected 
                            ? 'bg-pink-100/80 border-[#EC4899] ring-2 ring-pink-100 font-extrabold text-pink-700' 
                            : 'bg-white border-pink-100/40 hover:bg-pink-50/30 text-gray-750 font-medium'
                        }`}
                      >
                        <span 
                          className={`w-3.5 h-3.5 rounded-full inline-block shrink-0 shadow-sm ${
                            c.border ? 'border border-gray-400' : 'border border-black/10'
                          }`}
                          style={{ backgroundColor: c.hex }}
                        />
                        <span className="text-[11px] truncate">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* FINANCIALS (OWNER VS ADMIN VISIBILITY) */}
            <div className="border-t border-pink-100/60 pt-3.5 space-y-2">
              <label className="font-extrabold text-pink-600 block uppercase tracking-widest text-[9px]">SKEMA HARGA HARIAN</label>
              <div className="grid grid-cols-1 gap-3">
                {currentUser?.Role === 'OWNER' && (
                  <div className="space-y-1">
                    <label className="font-bold text-gray-600 block">HARGA MODAL (Owner Only)</label>
                    <input
                      type="number"
                      required
                      disabled={currentUser?.Role !== 'OWNER'}
                      value={costPrice}
                      onChange={(e) => setCostPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                      className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none font-mono text-gray-800 text-xs disabled:bg-gray-100 disabled:text-gray-400"
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="font-bold text-gray-600 block">HARGA JUAL (Umum)</label>
                  <input
                    type="number"
                    required
                    value={sellingPrice}
                    onChange={(e) => setSellingPrice(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                    className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none font-mono text-gray-900 font-bold text-xs focus:border-pink-500"
                  />
                </div>
              </div>
            </div>

            {/* Stok Sistem & Kondisi (Sejajar) */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block uppercase tracking-wider">Stok Sistem</label>
                <input
                  type="number"
                  required
                  disabled={!isCreatingNew} // WMS rules dictate modifications through Stock-In / Opname
                  value={currentStock}
                  onChange={(e) => setCurrentStock(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  className="w-full bg-white disabled:bg-pink-100/30 border border-pink-100 rounded-xl py-2 px-3 focus:outline-none text-xs focus:border-pink-500"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-gray-600 block uppercase tracking-wider">Kondisi</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'Active' | 'Discontinued')}
                  className="w-full bg-white border border-pink-100 text-gray-750 font-bold rounded-xl py-2 px-3 focus:outline-none text-xs focus:border-pink-500"
                >
                  <option value="Active">Aktif</option>
                  <option value="Discontinued">Dihentikan</option>
                </select>
              </div>
            </div>

            {/* Alert Minimal (Ditempatkan di baris tersendiri di bawahnya agar rapi) */}
            <div className="bg-amber-50/60 border border-amber-100 p-3.5 rounded-2xl space-y-1.5">
              <label className="font-extrabold text-amber-700 block uppercase tracking-widest text-[9px]">Ambangkan Alert Minimal (Warning)</label>
              <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                <input
                  type="number"
                  required
                  value={minStock}
                  onChange={(e) => setMinStock(e.target.value === '' ? '' : Math.max(0, Number(e.target.value)))}
                  className="w-32 bg-white border border-amber-200 rounded-xl py-2 px-3 focus:outline-none text-xs focus:border-amber-500 font-mono text-gray-800"
                />
                <p className="text-[10px] text-amber-800 leading-relaxed">
                  Sistem akan memunculkan alarm notifikasi jika stok barang ini kurang dari atau sama dengan <span className="font-black font-mono">{minStock} pcs</span>.
                </p>
              </div>
            </div>

            {/* PREVIEW BARCODE SECTION */}
            {sku && (
              <div className="bg-[#FFF8FB] p-4 rounded-2xl border border-pink-100 flex flex-col items-center justify-center space-y-2.5 text-center mt-3 shadow-inner">
                <p className="font-black text-[9px] text-[#EC4899] uppercase tracking-widest flex items-center gap-1.5">
                  <Tag className="w-3 h-3" /> QR CODE GENERATOR
                </p>
                
                <div className="bg-white p-2.5 rounded-xl border border-pink-100/50 inline-block text-center flex flex-col items-center">
                  <QRCodeSVG 
                    id={`barcode-svg-${sku}`}
                    value={sku}
                    size={120}
                    level={"M"}
                    includeMargin={true}
                  />
                  <p className="font-mono text-[10px] font-extrabold tracking-widest text-[#111827] mt-[4px]">
                    {sku}
                  </p>
                </div>

                <div className="flex gap-2 w-full pt-1">
                  <button
                    type="button"
                    onClick={() => handleDownloadBarcode(sku, prodName)}
                    className="flex-1 bg-white hover:bg-pink-50 text-[#EC4899] border border-pink-100 font-bold py-1.5 px-3 rounded-xl text-[10px] flex items-center justify-center gap-1 transition cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" /> Unduh SVG
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePrintLabel({
                      Product_ID: selectedProduct?.Product_ID || '',
                      SKU: sku,
                      Product_Name: prodName,
                      Category: category,
                      Variant: variant,
                      Color: color,
                      Size: size,
                      Cost_Price: Number(costPrice),
                      Selling_Price: Number(sellingPrice),
                      Current_Stock: Number(currentStock),
                      Minimum_Stock: Number(minStock),
                      Status: status,
                      Barcode: sku,
                      QR_Code: sku
                    })}
                    className="flex-1 bg-[#111827] hover:bg-black text-white font-semibold py-1.5 px-3 rounded-xl text-[10px] flex items-center justify-center gap-1 transition cursor-pointer shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" /> Cetak Label Gantung
                  </button>
                </div>
              </div>
            )}

            {/* Form Controls */}
            <div className="flex gap-2 pt-3.5">
              <button
                type="submit"
                id="save-product-form-btn"
                className="flex-1 bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-2.5 px-4 rounded-xl cursor-pointer transition text-xs flex items-center justify-center gap-2 shadow-md uppercase tracking-wider"
              >
                <Save className="w-4 h-4" />
                SIMPAN RECORD
              </button>
              <button
                type="button"
                onClick={onClose}
                className="bg-white hover:bg-gray-100 text-gray-500 border border-gray-200 font-bold py-2.5 px-4 rounded-xl cursor-pointer transition text-xs uppercase"
              >
                BATAL
              </button>
            </div>
          </form>

        </div>
      </div>
      )}

      {/* Product Deletion Confirmation Modal Popup */}
      {productToDeleteLocal && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-sm rounded-[32px] border border-red-100 p-6 shadow-2xl relative space-y-4 animate-[fadeIn_0.2s_ease-out] text-left">
            <div className="flex flex-col items-center text-center space-y-2.5 pb-2">
              <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center text-red-500 border border-red-100">
                <AlertTriangle className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="font-extrabold text-[#EF4444] uppercase tracking-wider text-sm mt-1">Konfirmasi Hapus Produk</h4>
              <p className="text-gray-500 text-[11px] leading-relaxed">
                Apakah Anda benar-benar yakin ingin menghapus produk ini dari database master? Tindakan ini bersifat permanen dan tidak dapat dibatalkan.
              </p>
            </div>

            <div className="bg-red-50/50 rounded-2xl border border-red-100/50 p-4 block space-y-1.5 text-xs">
              <div className="flex justify-between items-center text-[#991B1B] font-extrabold text-[10px] uppercase tracking-wider">
                <span>SKU MASTER</span>
                <span className="font-mono bg-[#FFECEF] px-2 py-0.5 rounded font-black text-red-600">{productToDeleteLocal.SKU}</span>
              </div>
              <p className="font-black text-gray-900 uppercase pt-1 text-[11px]">{productToDeleteLocal.Product_Name}</p>
              <p className="text-[10px] text-gray-500 font-medium">Kategori: {productToDeleteLocal.Category} | Variant: {productToDeleteLocal.Variant || '-'}</p>
            </div>

            <div className="flex gap-2 pt-2 text-xs font-bold">
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2.5 px-3 rounded-xl cursor-pointer transition uppercase text-center shadow-md shadow-red-500/10 tracking-widest text-[10px] font-black"
                id="btn-confirm-delete-product"
              >
                YA, HAPUS PERMANEN
              </button>
              <button
                type="button"
                onClick={() => setProductToDeleteLocal(null)}
                className="flex-1 bg-gray-50 hover:bg-gray-105 text-gray-600 border border-gray-200 py-2.5 px-3 rounded-xl cursor-pointer transition uppercase text-center shadow-sm text-[10px] tracking-wider"
              >
                TIDAK, BATALKAN
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

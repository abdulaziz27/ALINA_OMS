/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Product, UserRole } from '../types.ts';
import ProductStats from './products/ProductStats.tsx';
import ProductListTable from './products/ProductListTable.tsx';
import ProductEditor from './products/ProductEditor.tsx';

interface ProductFormProps {
  productsList: Product[];
  currentUser: { Full_Name: string; Email: string; Role: UserRole } | null;
  onSaveProduct: (prod: Partial<Product>, isNew: boolean, id?: string) => Promise<boolean>;
  onDeleteProduct: (id: string) => Promise<boolean>;
  onImportProducts: (products: any[]) => Promise<boolean>;
  categoryList: string[];
}

export default function ProductForm({
  productsList,
  currentUser,
  onSaveProduct,
  onDeleteProduct,
  onImportProducts,
  categoryList
}: ProductFormProps) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  
  // Notification State
  const [notif, setNotif] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  const triggerNotif = (type: 'success' | 'error', text: string) => {
    setNotif({ type, text });
    setTimeout(() => setNotif(null), 4000);
  };

  const handleCreateNewClick = () => {
    setIsEditing(false);
    setIsCreatingNew(true);
    setSelectedProduct(null);
  };

  const handleSelectProduct = (p: Product) => {
    setSelectedProduct(p);
    setIsEditing(true);
    setIsCreatingNew(false);
  };

  const handleCloseModal = () => {
    setIsEditing(false);
    setIsCreatingNew(false);
    setSelectedProduct(null);
  };

  // Keep a small local state for deleting product, since it can be triggered from both List and Editor
  const [productToDeleteLocal, setProductToDeleteLocal] = useState<Product | null>(null);

  const handleExportCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "SKU,Product_Name,Category,Variant,Color,Size,Cost_Price,Selling_Price,Current_Stock,Minimum_Stock,Status\n";

    productsList.forEach(p => {
      csvContent += `"${p.SKU}","${p.Product_Name}","${p.Category}","${p.Variant}","${p.Color}","${p.Size}",${p.Cost_Price},${p.Selling_Price},${p.Current_Stock},${p.Minimum_Stock},"${p.Status}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.href = encodedUri;
    link.download = "ALINA_PRODUCT_MASTER.csv";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    triggerNotif('success', 'Berhasil mengekspor produk ke CSV');
  };

  const handleImportCSVLocalInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const csvText = evt.target?.result as string;
      if (!csvText) return;

      const lines = csvText.split('\n');
      const importedList: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;

        const columns = line.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
        if (columns.length >= 2) {
          const skuVal = columns[0].replace(/"/g, '');
          const nameVal = columns[1].replace(/"/g, '');
          
          importedList.push({
            SKU: skuVal,
            Product_Name: nameVal,
            Category: columns[2]?.replace(/"/g, '') || 'Celamis Regular',
            Variant: columns[3]?.replace(/"/g, '') || 'All Size',
            Color: columns[4]?.replace(/"/g, '') || 'Pastel',
            Size: columns[5]?.replace(/"/g, '') || 'All Size',
            Cost_Price: Number(columns[6]) || 20000,
            Selling_Price: Number(columns[7]) || 40000,
            Current_Stock: Number(columns[8]) || 0,
            Minimum_Stock: Number(columns[9]) || 10,
            Status: columns[10]?.replace(/"/g, '') || 'Active'
          });
        }
      }

      if (importedList.length > 0) {
        const success = await onImportProducts(importedList);
        if (success) {
          triggerNotif('success', `Berhasil mengimpor ${importedList.length} produk ke Google Sheets.`);
        } else {
          triggerNotif('error', 'Impor gagal.');
        }
      }
    };
    reader.readAsText(file);
    // reset input
    e.target.value = '';
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Notification */}
      {notif && (
        <div className={`fixed bottom-4 right-4 z-[120] p-4 rounded-2xl text-white text-xs font-bold shadow-xl flex items-center gap-2 ${
          notif.type === 'success' ? 'bg-[#22C55E]' : 'bg-[#EF4444]'
        }`}>
          <CheckCircle className="w-4 h-4" />
          {notif.text}
        </div>
      )}

      {/* Product List Table Component */}
      <ProductListTable
        productsList={productsList}
        currentUser={currentUser}
        handleSelectProduct={handleSelectProduct}
        setProductToDelete={setProductToDeleteLocal}
        handleCreateNewClick={handleCreateNewClick}
        handleExportCSV={handleExportCSV}
        handleImportCSVLocalInput={handleImportCSVLocalInput}
      />

      {/* Product Stats Component */}
      <ProductStats productsList={productsList} />

      {/* Product Editor Modal Component */}
      <ProductEditor
        isCreatingNew={isCreatingNew}
        isEditing={isEditing}
        selectedProduct={selectedProduct}
        productsList={productsList}
        categoryList={categoryList}
        currentUser={currentUser}
        onClose={handleCloseModal}
        onSaveProduct={onSaveProduct}
        onDeleteProduct={onDeleteProduct}
        productToDeleteLocal={productToDeleteLocal}
        setProductToDeleteLocal={setProductToDeleteLocal}
      />

    </div>
  );
}

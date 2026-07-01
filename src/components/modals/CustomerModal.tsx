import React from 'react';
import { Customer } from '../../types.ts';

interface CustomerModalProps {
  isOpen: boolean;
  editingCustomer: Partial<Customer> | null;
  setEditingCustomer: React.Dispatch<React.SetStateAction<Partial<Customer> | null>>;
  setIsCustomerModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveCustomerSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function CustomerModal({
  isOpen,
  editingCustomer,
  setEditingCustomer,
  setIsCustomerModalOpen,
  handleSaveCustomerSubmit
}: CustomerModalProps) {
  if (!isOpen || !editingCustomer) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <form onSubmit={handleSaveCustomerSubmit} className="bg-pink-50 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-pink-500/20 p-6 text-left space-y-4">
        <h3 className="font-extrabold text-sm uppercase text-pink-500 border-b border-pink-50 pb-3">Profil Detil Pelanggan</h3>

        <div className="space-y-3 text-xs font-semibold text-gray-750">
          <div className="space-y-1">
            <label className="text-gray-500">Nama Lengkap Pelanggan</label>
            <input
              type="text"
              required
              value={editingCustomer.Customer_Name || ''}
              onChange={(e) => setEditingCustomer(prev => ({ ...prev!, Customer_Name: e.target.value }))}
              className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-gray-500">Kategori Distribusi</label>
              <select
                value={editingCustomer.Customer_Type || 'Reseller'}
                onChange={(e) => setEditingCustomer(prev => ({ ...prev!, Customer_Type: e.target.value as any }))}
                className="w-full bg-white border border-pink-100 text-gray-700 rounded-xl py-2 px-3 focus:outline-none"
              >
                <option value="Reseller">Reseller</option>
                <option value="Agen">Agen</option>
                <option value="Marketer">Marketer</option>
                <option value="Konsinyasi">Konsinyasi</option>
                <option value="Retail IG">Retail IG</option>
                <option value="Shopee">Shopee</option>
                <option value="TikTok & Tokopedia">TikTok & Tokopedia</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-500">No Telepon WA</label>
              <input
                type="text"
                required
                value={editingCustomer.Phone || ''}
                onChange={(e) => setEditingCustomer(prev => ({ ...prev!, Phone: e.target.value }))}
                className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-gray-500">Email Utama</label>
            <input
              type="email"
              required
              value={editingCustomer.Email || ''}
              onChange={(e) => setEditingCustomer(prev => ({ ...prev!, Email: e.target.value }))}
              className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-gray-500">Alamat Rumah/Gudang</label>
              <input
                type="text"
                required
                value={editingCustomer.Address || ''}
                onChange={(e) => setEditingCustomer(prev => ({ ...prev!, Address: e.target.value }))}
                className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-gray-500">Kota Domisili</label>
              <input
                type="text"
                required
                value={editingCustomer.City || ''}
                onChange={(e) => setEditingCustomer(prev => ({ ...prev!, City: e.target.value }))}
                className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-3">
          <button
            type="submit"
            className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-bold py-2.5 px-4 rounded-xl cursor-pointer text-xs"
          >
            Simpan Pelanggan
          </button>
          
          <button
            type="button"
            onClick={() => {
              setIsCustomerModalOpen(false);
              setEditingCustomer(null);
            }}
            className="bg-white text-gray-500 border border-gray-200 font-bold py-2.5 px-4 rounded-xl cursor-pointer text-xs"
          >
            Batal
          </button>
        </div>
      </form>
    </div>
  );
}

import React from 'react';
import { User } from '../../types.ts';

interface UserModalProps {
  isOpen: boolean;
  editingUser: (Partial<User> & { Password?: string }) | null;
  setEditingUser: React.Dispatch<React.SetStateAction<(Partial<User> & { Password?: string }) | null>>;
  setIsUserModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveUserSubmit: (e: React.FormEvent) => Promise<void>;
}

export default function UserModal({
  isOpen,
  editingUser,
  setEditingUser,
  setIsUserModalOpen,
  handleSaveUserSubmit
}: UserModalProps) {
  if (!isOpen || !editingUser) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <form onSubmit={handleSaveUserSubmit} className="bg-[#FFF8FB] rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl border border-pink-500/20 p-6 text-left space-y-4">
        <h3 className="font-extrabold text-sm uppercase text-[#EC4899] border-b border-pink-50 pb-3">Detil Kredensial Staff</h3>

        <div className="space-y-3 text-xs font-semibold text-gray-750">
          <div className="space-y-1">
            <label className="text-gray-500">Nama Lengkap Staff</label>
            <input
              type="text"
              required
              value={editingUser.Full_Name || ''}
              onChange={(e) => setEditingUser(prev => ({ ...prev!, Full_Name: e.target.value }))}
              className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-500">Email Login</label>
            <input
              type="email"
              required
              value={editingUser.Email || ''}
              onChange={(e) => setEditingUser(prev => ({ ...prev!, Email: e.target.value }))}
              className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="space-y-1">
            <label className="text-gray-500">Password Baru (Biarkan kosong jika tidak dirubah)</label>
            <input
              type="password"
              placeholder="Password..."
              value={editingUser.Password || ''}
              onChange={(e) => setEditingUser(prev => ({ ...prev!, Password: e.target.value }))}
              className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-gray-500">Role Sistem</label>
              <select
                value={editingUser.Role || 'Admin Gudang Alina'}
                onChange={(e) => setEditingUser(prev => ({ ...prev!, Role: e.target.value as any }))}
                className="w-full bg-white border border-pink-100 text-gray-700 rounded-xl py-2 px-3 focus:outline-none"
              >
                <option value="OWNER">OWNER (Full Privileges)</option>
                <option value="ADMIN">ADMIN (Operasional Gudang)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-gray-500">Kondisi Akun</label>
              <select
                value={editingUser.Status || 'Active'}
                onChange={(e) => setEditingUser(prev => ({ ...prev!, Status: e.target.value as any }))}
                className="w-full bg-white border border-pink-100 text-gray-700 rounded-xl py-2 px-3 focus:outline-none"
              >
                <option value="Active">Aktif</option>
                <option value="Inactive">Non-Aktifkan</option>
              </select>
            </div>
          </div>

          {/* Hak Akses Modul Checkboxes */}
          <div className="space-y-2 border-t border-pink-100 pt-3">
            <label className="text-gray-500 font-bold block text-xs uppercase tracking-wider">Akses Modul / Layar</label>
            {editingUser.Role === 'Owner Alina' ? (
              <div className="bg-pink-50 text-[#EC4899] text-[11px] font-bold p-3 rounded-2xl border border-pink-100">
                💡 Akun OWNER otomatis memiliki hak akses penuh ke seluruh modul sistem operasional Alina.
              </div>
            ) : (
              <>
                <p className="text-[10px] text-gray-400 font-medium">Beri centang pada modul yang diperbolehkan untuk diakses staff:</p>
                <div className="grid grid-cols-2 gap-2 bg-pink-50/40 p-3 rounded-2xl border border-pink-100/40">
                  {[
                    { id: 'dashboard', label: 'Dashboard / Ringkasan' },
                    { id: 'products', label: 'Catalog (Master Produk)' },
                    { id: 'inventory', label: 'Stock Trx (WMS Gudang)' },
                    { id: 'opname', label: 'Opname (Stock Opname)' },
                    { id: 'orders', label: 'Orders (OMS Sales)' },
                    { id: 'shipping', label: 'Shipping / Kurir' },
                    { id: 'reports', label: 'Reports (Finansial)' },
                    { id: 'customers', label: 'Customers (Pelanggan)' },
                    { id: 'settings', label: 'Sheets Connection' },
                  ].map((mod, idx) => {
                    const curPerms = editingUser.Permissions || ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"];
                    const isChecked = curPerms.includes(mod.id);
                    return (
                      <label key={`${mod.id}-${idx}`} className="flex items-center gap-2 cursor-pointer text-[11px] text-gray-750 hover:text-black font-bold">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={(e) => {
                            let nextPerms: string[];
                            if (e.target.checked) {
                              nextPerms = [...curPerms, mod.id];
                            } else {
                              nextPerms = curPerms.filter(p => p !== mod.id);
                            }
                            setEditingUser(prev => ({ ...prev!, Permissions: nextPerms }));
                          }}
                          className="w-3.5 h-3.5 rounded border-pink-300 text-[#EC4899] accent-[#EC4899]"
                        />
                        <span>{mod.label}</span>
                      </label>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-3">
          <button
            type="submit"
            className="flex-1 bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-2.5 px-4 rounded-xl cursor-pointer text-xs"
          >
            Simpan Kredensial Staff
          </button>
          
          <button
            type="button"
            onClick={() => {
              setIsUserModalOpen(false);
              setEditingUser(null);
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

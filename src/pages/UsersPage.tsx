
import React from 'react';
import { User } from '../types.ts';
import { Plus } from 'lucide-react';

interface UsersPageProps {
  currentUser: User | null;
  users: User[];
  setEditingUser: (user: any) => void;
  setIsUserModalOpen: (isOpen: boolean) => void;
  handleDeleteUser: (userId: string) => void;
}

export default function UsersPage({
  currentUser,
  users,
  setEditingUser,
  setIsUserModalOpen,
  handleDeleteUser
}: UsersPageProps) {
  return (
              <div className="space-y-6 text-left">
                
                {/* User settings summary */}
                <div className="bg-white p-5 rounded-[32px] border border-pink-100 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <h3 className="font-black text-[#EC4899] text-xs uppercase tracking-wider">MANAGEMEN ADMINISTRATIVE USER</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-semibold">Buat, ganti profil password, atau matikan ijin autentikasi staff operasional Alina WMS & OMS.</p>
                  </div>
                  <button
                    onClick={() => {
                      setEditingUser({
                        Full_Name: '',
                        Email: '',
                        Role: 'Admin Gudang Alina',
                        Status: 'Active',
                        Password: '',
                        Permissions: ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
                      });
                      setIsUserModalOpen(true);
                    }}
                    className="bg-[#EC4899] hover:bg-[#D93B84] text-white font-bold py-2.5 px-6 rounded-xl text-xs flex items-center gap-1 cursor-pointer shadow-sm transition"
                  >
                    <Plus className="w-4 h-4" /> Tambah Staff Baru
                  </button>
                </div>

                {/* User listings */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((u, idx) => (
                    <div key={`${u.User_ID}-${idx}`} className="bg-white border border-pink-100 p-5 rounded-[24px] shadow-sm flex flex-col justify-between gap-4">
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-bold text-gray-900 text-sm leading-tight">{u.Full_Name}</h4>
                            <span className="text-[10px] font-mono text-pink-500 block">{u.User_ID}</span>
                          </div>

                          <span className={`inline-block text-[9px] font-black uppercase px-2 py-0.5 rounded ${
                            u.Role === 'Owner Alina' ? 'bg-pink-100 text-[#EC4899]' : 'bg-blue-100 text-blue-700'
                          }`}>
                            {u.Role}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-gray-500 font-medium">
                          <p>✉ EMAIL: {u.Email}</p>
                          <p>🗓 CREATED: {new Date(u.Created_Date).toLocaleDateString()}</p>
                          <p>⌛ LAST LOGIN: {u.Last_Login ? new Date(u.Last_Login).toLocaleString() : 'Never logged in'}</p>
                        </div>

                        {/* Allowed permissions listing */}
                        <div className="pt-2 border-t border-pink-50/50">
                          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Akses Modul:</p>
                          <div className="flex flex-wrap gap-1">
                            {u.Role === 'Owner Alina' ? (
                              <span className="text-[9px] bg-pink-100 text-[#EC4899] font-bold px-2 py-0.5 rounded-full border border-pink-200">Semua Akses (OWNER)</span>
                            ) : !u.Permissions || u.Permissions.length === 0 ? (
                              <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-2 py-0.5 rounded-full border border-gray-200">Semua Akses (Staff Default)</span>
                            ) : (
                              u.Permissions.map((p, idxP) => (
                                <span key={`${p}-${idxP}`} className="text-[9px] bg-pink-50 text-pink-600 font-bold px-1.5 py-0.5 rounded border border-pink-100">
                                  {p === 'dashboard' ? 'Dashboard' :
                                   p === 'products' ? 'Catalog' :
                                   p === 'inventory' ? 'Stock Trx' :
                                   p === 'opname' ? 'Opname' :
                                   p === 'orders' ? 'Orders' :
                                   p === 'shipping' ? 'Shipping' :
                                   p === 'reports' ? 'Reports' :
                                   p === 'customers' ? 'Customers' :
                                   p === 'settings' ? 'Sheets' : p}
                                </span>
                              ))
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-pink-50 pt-3 mt-1 justify-end">
                        <button
                          onClick={() => {
                            setEditingUser({
                              ...u,
                              Permissions: u.Permissions || ["dashboard", "products", "inventory", "opname", "orders", "shipping", "reports", "customers", "settings"]
                            });
                            setIsUserModalOpen(true);
                          }}
                          className="text-xs font-bold text-gray-750 hover:underline cursor-pointer hover:text-black"
                        >
                          Modify State
                        </button>
                        
                        <button
                          onClick={() => handleDeleteUser(u.User_ID)}
                          className="text-xs font-bold text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Dissolve
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
  );
}

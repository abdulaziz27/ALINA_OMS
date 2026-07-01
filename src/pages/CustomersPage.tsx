
import React from 'react';
import { Customer } from '../types.ts';
import { Plus } from 'lucide-react';

interface CustomersPageProps {
  customers: Customer[];
  setEditingCustomer: (customer: any) => void;
  setIsCustomerModalOpen: (isOpen: boolean) => void;
  handleDeleteCustomer: (customerId: string) => void;
}

export default function CustomersPage({
  customers,
  setEditingCustomer,
  setIsCustomerModalOpen,
  handleDeleteCustomer
}: CustomersPageProps) {
  return (
              <div className="space-y-6 text-left">
                
                {/* Search / Controls */}
                <div className="flex justify-between items-center bg-white p-4 rounded-[24px] border border-pink-100 shadow-sm">
                  <h3 className="font-bold text-sm tracking-tight text-gray-900 uppercase">Customer Master Database</h3>
                  <button
                    onClick={() => {
                      setEditingCustomer({
                        Customer_Name: '',
                        Customer_Type: 'Reseller',
                        Phone: '',
                        Email: '',
                        Address: '',
                        City: '',
                        Status: 'Active'
                      });
                      setIsCustomerModalOpen(true);
                    }}
                    className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded-xl text-xs flex items-center gap-1.5 transition cursor-pointer"
                  >
                    <Plus className="w-4 h-4" /> Tambah Customer
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {customers.map((c, idx) => (
                    <div 
                      key={`${c.Customer_ID}-${idx}`}
                      className="bg-white border border-pink-100 p-5 rounded-[24px] shadow-sm hover:border-pink-300 transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-extrabold text-sm text-gray-900 leading-tight">{c.Customer_Name}</h4>
                            <span className="text-sm uppercase font-bold text-pink-500 font-mono tracking-wider">{c.Customer_ID}</span>
                          </div>
                          
                          <span className={`inline-block text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                            c.Customer_Type === 'Shopee' || c.Customer_Type === 'TikTok & Tokopedia'
                              ? 'bg-orange-50 text-orange-600'
                              : 'bg-indigo-50 text-indigo-600'
                          }`}>
                            {c.Customer_Type}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-gray-500 font-medium">
                          <p>📱 PHONE: {c.Phone}</p>
                          <p>✉ EMAIL: {c.Email}</p>
                          <p>📍 ALAMAT: {c.Address}, {c.City}</p>
                        </div>
                      </div>

                      <div className="flex gap-2 border-t border-pink-50 pt-3 mt-4 justify-end">
                        <button
                          onClick={() => {
                            setEditingCustomer(c);
                            setIsCustomerModalOpen(true);
                          }}
                          className="text-xs font-semibold text-gray-700 hover:text-black hover:underline cursor-pointer"
                        >
                          Edit Details
                        </button>
                        
                        <button
                          onClick={() => handleDeleteCustomer(c.Customer_ID)}
                          className="text-xs font-semibold text-red-500 hover:text-red-700 cursor-pointer"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

              </div>

  );
}

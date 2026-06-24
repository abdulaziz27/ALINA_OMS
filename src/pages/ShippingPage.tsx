
import React from 'react';
import { Truck, Search, CheckCircle2 } from 'lucide-react';
import { Order, Shipping, User } from '../types.ts';

interface ShippingPageProps {
  orders: Order[];
  hasPermission: (perm: string) => boolean;
  selectedShipOrder: string | null;
  setSelectedShipOrder: (val: string | null) => void;
  shipCourier: string;
  setShipCourier: (val: string) => void;
  shipTracking: string;
  setShipTracking: (val: string) => void;
  shipStatus: string;
  setShipStatus: (val: string) => void;
  fetchDatabaseState: () => Promise<void>;
  handleAssignShippingSubmit: (e: React.FormEvent) => void;
  shipping: Shipping[];
  currentUser: User | null;
}

export default function ShippingPage({
  orders,
  hasPermission,
  selectedShipOrder,
  setSelectedShipOrder,
  shipCourier,
  setShipCourier,
  shipTracking,
  setShipTracking,
  shipStatus,
  setShipStatus,
  fetchDatabaseState,
  handleAssignShippingSubmit,
  shipping,
  currentUser
}: ShippingPageProps) {
  return (
              <div className="space-y-6 text-left">
                
                {/* List and form components */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  
                  {/* Courier Assignment Form */}
                  <div className="lg:col-span-5 bg-white border border-pink-100 p-6 rounded-[32px] shadow-sm space-y-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-pink-700 pb-2 border-b border-pink-50">Assign Tracking & Expedition</h3>
                    
                    <form onSubmit={handleAssignShippingSubmit} className="space-y-4 text-xs font-semibold text-gray-750">
                      <div className="space-y-1 block">
                        <label className="font-bold text-gray-600 block uppercase">PILIH PESANAN (Status: Ready to Ship)</label>
                        <select
                          required
                          value={selectedShipOrder || ''}
                          onChange={(e) => setSelectedShipOrder(e.target.value)}
                          className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none focus:border-pink-500"
                        >
                          <option value="">-- PILIH ORDER NOMOR --</option>
                          {(() => {
                            const seen = new Set();
                            const readyGrouped: { Order_Number: string; Customer: string; Qty: number }[] = [];
                            orders.filter(o => o.Status === 'Ready To Ship').forEach(o => {
                              if (!seen.has(o.Order_Number)) {
                                seen.add(o.Order_Number);
                                const totalQty = orders
                                  .filter(item => item.Order_Number === o.Order_Number)
                                  .reduce((sum, item) => sum + item.Qty, 0);
                                readyGrouped.push({
                                  Order_Number: o.Order_Number,
                                  Customer: o.Customer,
                                  Qty: totalQty
                                });
                              }
                            });
                            return readyGrouped.map((o, idxRg) => (
                              <option key={`${o.Order_Number}-${idxRg}`} value={o.Order_Number}>
                                [{o.Order_Number}] {o.Customer} ({o.Qty} Pcs)
                              </option>
                            ));
                          })()}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-600">Ekspedisi Kurir</label>
                        <select
                          value={shipCourier}
                          onChange={(e) => setShipCourier(e.target.value)}
                          className="w-full bg-white border border-pink-100 rounded-xl py-2.5 px-3 focus:outline-none"
                        >
                          <option value="JNE Express">JNE Express</option>
                          <option value="SPX Shopee Express">SPX Shopee Express</option>
                          <option value="J&T Express">J&T Express</option>
                          <option value="Sicepat Reg">Sicepat Reg</option>
                          <option value="Wahana">Wahana</option>
                          <option value="GoSend instant">GoSend instant</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-600">Nomor Resi / Waybill Code</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. JB991122883"
                          value={shipTracking}
                          onChange={(e) => setShipTracking(e.target.value.toUpperCase())}
                          className="w-full bg-white border border-pink-100 rounded-xl py-2.5 px-3 focus:outline-none font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-bold text-gray-600">Status Awal</label>
                        <select
                          value={shipStatus}
                          onChange={(e) => setShipStatus(e.target.value as any)}
                          className="w-full bg-white border border-pink-100 rounded-xl py-2 px-3 focus:outline-none text-gray-700"
                        >
                          <option value="In Transit">Dalam Perjalanan (In Transit)</option>
                          <option value="Waiting Pickup">Menunggu Kurir (Waiting Pickup)</option>
                          <option value="Delivered">Tiba di Lokasi (Delivered)</option>
                        </select>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-[#111827] hover:bg-black text-white font-bold py-3 px-4 rounded-xl cursor-pointer transition uppercase"
                      >
                        Pasang Resi Kiriman
                      </button>
                    </form>
                  </div>

                  {/* Operational shipping log */}
                  <div className="lg:col-span-7 bg-white border border-pink-100 rounded-[32px] p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-pink-50">
                      <h4 className="font-bold text-xs uppercase tracking-wider text-gray-700">Active Expeditions Logistics</h4>
                      <span className="text-[10px] text-gray-400 font-mono font-bold">{shipping.length} shipments total</span>
                    </div>

                    <div className="space-y-3 min-h-[300px]">
                      {shipping.length === 0 ? (
                        <div className="text-center py-8 text-gray-400 text-xs">Belum ada pengiriman aktif.</div>
                      ) : (
                        shipping.map((s, idx) => (
                          <div key={`${s.Tracking_Number || s.Order_Number}-${idx}`} className="bg-white border border-pink-50 rounded-2xl p-4 hover:shadow-sm transition space-y-2.5 text-xs text-[#111827]">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <span className="font-mono text-xs font-bold text-[#EC4899] block">
                                  No. Order: {s.Order_Number}
                                </span>
                                <span className="text-[10px] text-gray-400 font-mono">
                                  {new Date(s.Shipping_Date).toLocaleString('id-ID')}
                                </span>
                              </div>
                              <span className={`inline-block py-1 px-2.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                s.Status === 'Delivered' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                              }`}>
                                {s.Status}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-dashed border-pink-50 text-xs">
                              <div>
                                <span className="text-gray-400 text-[10px] block uppercase font-mono tracking-wider mb-0.5">Ekspedisi / Resi</span>
                                <span className="font-bold text-gray-900 block">{s.Courier}</span>
                                <span className="text-[10px] font-mono text-gray-500 block">{s.Tracking_Number || '-'}</span>
                              </div>
                              <div>
                                <span className="text-gray-400 text-[10px] block uppercase font-mono tracking-wider mb-0.5">Keterangan</span>
                                <span className="italic text-gray-500 text-[10px]">Ready to delivered confirm.</span>
                              </div>
                            </div>

                            <div className="pt-2.5 flex justify-end items-center border-t border-pink-50/50">
                              {s.Status !== 'Delivered' ? (
                                <button
                                  onClick={async () => {
                                    // Simulate delivery confirm
                                    await fetch('/api/shipping', {
                                      method: 'POST',
                                      headers: { 'Content-Type': 'application/json' },
                                      body: JSON.stringify({
                                        action: 'UPSERT',
                                        shipping: { ...s, Status: 'Delivered' },
                                        user: { name: currentUser?.Full_Name, role: currentUser?.Role }
                                      })
                                    });
                                    alert(`Shipping deliver confirmation marked for order ${s.Order_Number}`);
                                    await fetchDatabaseState();
                                  }}
                                  className="w-full sm:w-auto bg-[#EC4899] hover:bg-pink-600 text-white font-bold py-1.5 px-4 rounded-xl text-[10px] cursor-pointer transition text-center"
                                >
                                  Mark Delivered ✓
                                </button>
                              ) : (
                                <span className="text-[10px] text-gray-400">Fulfillment Complete</span>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>

                  </div>

                </div>

              </div>
  );
}

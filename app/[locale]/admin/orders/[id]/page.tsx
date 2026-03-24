"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { MdArrowBack, MdPerson, MdLocationOn, MdPayment, MdLocalShipping } from "react-icons/md";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [order, setOrder] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`);
      if (res.ok) setOrder(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleStatusChange = async (value: string, type: string) => {
    try {
      const res = await fetch(`/api/admin/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [type]: value }),
      });
      if (res.ok) fetchOrder();
    } catch (e) {
      console.error(e);
    }
  };

  if (!order) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-6xl mx-auto">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <button 
             onClick={() => router.push("/admin/orders")}
             className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-2 mb-4"
           >
             <MdArrowBack size={16} /> Back to Manifest
           </button>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Order <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">#{order._id.slice(-8).toUpperCase()}</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2">Placed on {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer & Shipping */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-2xl bg-pink-500/10 text-pink-500 flex items-center justify-center">
                <MdPerson size={24} />
              </div>
              <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Patron Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Legal Name</div>
                  <div className="font-extrabold text-gray-900 dark:text-white">{order.user?.name || "Guest User"}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Contact Channel</div>
                  <div className="font-extrabold text-gray-900 dark:text-white">{order.user?.email || "N/A"}</div>
                </div>
              </div>
              <div className="space-y-6">
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Direct Line</div>
                  <div className="font-extrabold text-gray-900 dark:text-white">{order.phoneNumber || "Not provided"}</div>
                </div>
              </div>
            </div>

            <div className="mt-12 pt-12 border-t border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
                  <MdLocationOn size={24} />
                </div>
                <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight">Logistics Destination</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="md:col-span-2">
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Geographic Coordinates</div>
                  <div className="font-extrabold text-gray-900 dark:text-white">{order.shippingAddress}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Thoroughfare & Number</div>
                  <div className="font-extrabold text-gray-900 dark:text-white">{order.streetName || "N/A"}, {order.houseAddress || "N/A"}</div>
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-1">Municipality & Postal</div>
                  <div className="font-extrabold text-gray-900 dark:text-white uppercase">{order.city || "Unknown City"} / {order.postalCode}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10">
            <h2 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-8">Asset Manifest</h2>
            <div className="space-y-4">
              {order.items?.map((item: any, idx: number) => (
                <div key={idx} className="space-y-4 pb-4">
                  <div className="flex justify-between items-center p-6 bg-gray-50 dark:bg-white/5 rounded-[2rem] border border-white dark:border-white/5 hover:border-pink-500/20 transition-all">
                    <div className="flex items-center gap-6">
                      <div className="w-12 h-12 rounded-xl bg-white dark:bg-gray-800 flex items-center justify-center text-[10px] font-black text-pink-500 shadow-sm border border-gray-100 dark:border-white/5">
                        {item.quantity}x
                      </div>
                      <div>
                        <div className="font-black text-gray-900 dark:text-white uppercase tracking-tight">{item.name}</div>
                        <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">Unit Valuation: ${item.priceAtPurchase.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="text-lg font-black text-gray-900 dark:text-white tracking-tighter">
                      ${(item.priceAtPurchase * item.quantity).toFixed(2)}
                    </div>
                  </div>

                  {/* Gift Box Specs */}
                  {item.giftBoxData && (
                    <div className="ml-12 p-8 bg-pink-500/5 rounded-[2rem] border border-pink-500/10 grid grid-cols-1 md:grid-cols-2 gap-8 relative overflow-hidden">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-pink-500/5 rounded-full blur-3xl"></div>
                       <div className="space-y-4">
                          <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Vessel Arrangement</div>
                          <div className="space-y-2">
                             {item.giftBoxData.contents.map((c: any, ci: number) => (
                               <div key={ci} className="flex items-center gap-3 text-xs font-bold text-gray-500 dark:text-gray-400">
                                  <span className="text-[9px] text-pink-500/40 uppercase w-12">{c.sectionName}:</span>
                                  <span>{c.product?.name || "Premium Item"}</span>
                               </div>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-4">
                         <div className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Brief Metadata</div>
                         <div className="p-4 bg-white/40 dark:bg-black/20 rounded-2xl border border-white/20">
                            <div className="flex gap-4 mb-3">
                               <div className="text-[10px] font-black uppercase text-gray-400">From: <span className="text-gray-900 dark:text-white">{item.giftBoxData.from}</span></div>
                               <div className="text-[10px] font-black uppercase text-gray-400">To: <span className="text-gray-900 dark:text-white">{item.giftBoxData.to}</span></div>
                            </div>
                            <div className="text-[11px] font-medium italic text-gray-600 dark:text-gray-300 leading-relaxed leading-relaxed">
                               "{item.giftBoxData.customMessage}"
                            </div>
                         </div>
                       </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-between items-center px-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Net Investment Value</span>
              <span className="text-4xl font-black text-pink-500 tracking-tighter">${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Status Actions */}
        <div className="space-y-8">
           <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10 sticky top-10">
              <div className="mb-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 text-green-500 flex items-center justify-center">
                    <MdPayment size={20} />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Payment Cycle</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {['pending', 'paid', 'failed'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s, "paymentStatus")}
                      className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${order.paymentStatus === s ? 'bg-green-500 text-white shadow-xl scale-105' : 'bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-green-500'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                    <MdLocalShipping size={20} />
                  </div>
                  <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-widest">Logistics State</h3>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {['pending', 'shipped', 'delivered'].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleStatusChange(s, "deliveryStatus")}
                      className={`py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all ${order.deliveryStatus === s ? 'bg-blue-500 text-white shadow-xl scale-105' : 'bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-blue-500'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}


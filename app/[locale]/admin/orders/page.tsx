"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MdVisibility } from "react-icons/md";

type Order = {
  _id: string;
  user: { name: string; email: string };
  totalAmount: number;
  paymentStatus: string;
  deliveryStatus: string;
  createdAt: string;
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      if (res.ok) setOrders(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-12">
      <header>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Client <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Manifest</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2 uppercase tracking-widest">Tracking premium fulfilment cycles</p>
      </header>

      <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-black/20 text-left border-b border-gray-100 dark:border-white/5">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Reference</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Patron</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Investment</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Settlement</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Logistics</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {orders.map((o) => (
                <tr key={o._id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  <td className="px-10 py-6 font-black text-sm text-pink-500 tracking-tighter">
                    #{o._id.slice(-8).toUpperCase()}
                  </td>
                  <td className="px-8 py-6">
                    <div className="font-extrabold text-sm text-gray-900 dark:text-white">{o.user?.name || "Anonymous"}</div>
                    <div className="text-[10px] text-gray-400 font-bold tracking-tight">{o.user?.email || "N/A"}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-gray-900 dark:text-white">${o.totalAmount.toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 inline-flex text-[9px] font-black uppercase tracking-widest rounded-full ${o.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'}`}>
                      {o.paymentStatus}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 inline-flex text-[9px] font-black uppercase tracking-widest rounded-full border border-gray-100 dark:border-white/10 text-gray-500 dark:text-gray-400`}>
                      {o.deliveryStatus}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right">
                    <Link href={`/admin/orders/${o._id}`}>
                      <button className="px-6 py-2.5 rounded-xl bg-gray-900 dark:bg-white/5 text-white dark:text-white/80 font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-pink-500 hover:scale-105 transition-all flex items-center gap-2 ml-auto">
                        <MdVisibility size={16} />
                        Inspect
                      </button>
                    </Link>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-10 py-16 text-center text-gray-400 font-bold italic">No manifests found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


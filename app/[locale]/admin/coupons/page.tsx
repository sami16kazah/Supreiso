"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useModal } from "@/app/context/ModalContext";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";

type Coupon = {
  _id: string;
  code: string;
  discountAmount: number;
  isPercentage: boolean;
  expirationDate: string;
  isActive: boolean;
};

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const { showConfirm } = useModal();

  useEffect(() => {
    fetchCoupons();
  }, []);

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      if (res.ok) setCoupons(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm("Confirm Deletion", "Are you sure you want to delete this coupon?", async () => {
      await fetch(`/api/admin/coupons/${id}`, { method: "DELETE" });
      fetchCoupons();
    });
  };

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Promotion <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Vault</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2 uppercase tracking-widest">Architect your incentive strategies</p>
        </div>
        <Link href="/admin/coupons/form">
          <button className="px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
            <MdAdd size={20} />
            New Campaign
          </button>
        </Link>
      </header>

      <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-black/20 text-left border-b border-gray-100 dark:border-white/5">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Promo Code</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Benefit</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Lifecycle</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Expiry</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {coupons.map((c) => (
                <tr key={c._id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  <td className="px-10 py-6">
                    <span className="px-4 py-2 bg-pink-500/10 text-pink-600 font-black text-sm rounded-xl tracking-widest border border-pink-500/20 uppercase">
                      {c.code}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-gray-900 dark:text-white tracking-tighter text-lg">
                      {c.isPercentage ? `${c.discountAmount}% OFF` : `$${c.discountAmount} OFF`}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 inline-flex text-[9px] font-black uppercase tracking-widest rounded-full ${c.isActive ? 'bg-green-500/10 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                      {c.isActive ? 'Live' : 'Paused'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-gray-400 uppercase">
                      {new Date(c.expirationDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right space-x-2">
                    <Link href={`/admin/coupons/form?id=${c._id}`}>
                      <button className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-pink-500 hover:bg-white dark:hover:bg-white transition-all shadow-sm">
                        <MdEdit size={18} />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(c._id)}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-white transition-all shadow-sm"
                    >
                      <MdDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {coupons.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-16 text-center text-gray-400 font-bold italic">No active campaigns found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/api/auth/signin");
    } else if (status === "authenticated") {
      fetchOrders();
    }
  }, [status, router]);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/profile/orders");
      if (res.ok) setOrders(await res.json());
    } catch (e) {
      console.error(e);
    }
  };

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] py-20 px-4 md:px-12 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-pink-400/10 dark:bg-pink-900/10 rounded-full blur-[100px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[30%] h-[30%] bg-purple-400/10 dark:bg-purple-900/10 rounded-full blur-[100px] -z-0"></div>

      <div className="max-w-5xl mx-auto relative z-10">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Overview</span>
          </h1>
          <div className="w-16 h-1 bg-pink-500 rounded-full mt-6"></div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* User Info Card */}
          <div className="lg:col-span-1">
            <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10 text-center sticky top-28">
              <div className="relative inline-block mb-8">
                <div className="w-32 h-32 rounded-[2.5rem] bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-5xl font-black shadow-xl ring-4 ring-white dark:ring-gray-700">
                  {session.user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white dark:border-gray-800"></div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">{session.user?.name}</h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-8">{session.user?.email}</p>
              
              <div className="pt-8 border-t border-gray-100 dark:border-gray-700 space-y-4">
                 <button 
                  onClick={() => router.push("/api/auth/signout")}
                  className="w-full py-4 rounded-2xl bg-gray-50 dark:bg-white/5 text-gray-400 dark:text-gray-400 font-black text-[10px] uppercase tracking-widest hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/10 transition-all"
                 >
                   Logout Securely
                 </button>
              </div>
            </div>
          </div>

          {/* Orders Section */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-black mb-8 text-gray-800 dark:text-gray-200 tracking-tight flex items-center gap-3">
               Recent Transactions
               <span className="text-sm font-black bg-pink-500/10 text-pink-500 px-3 py-1 rounded-full">{orders.length}</span>
            </h2>
            
            <div className="space-y-6">
              {orders.map((o) => (
                <div key={o._id} className="group bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-lg border border-white dark:border-white/10 hover:shadow-2xl transition-all duration-500">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-6">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2">Order Reference</div>
                      <div className="font-extrabold text-xl text-gray-900 dark:text-white mb-2">#{o._id.slice(-6).toUpperCase()}</div>
                      <div className="text-xs font-bold text-gray-400">{new Date(o.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                    
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className={`text-[10px] font-black uppercase tracking-widest mb-2 ${o.paymentStatus === 'paid' ? 'text-green-500' : 'text-orange-500'}`}>
                           {o.paymentStatus === 'paid' ? '● Verified Paid' : '○ Pending'}
                        </div>
                        <div className="inline-block px-4 py-1.5 bg-gray-900 dark:bg-white/5 text-white dark:text-white text-[10px] font-black uppercase tracking-widest rounded-full">
                           {o.deliveryStatus}
                        </div>
                      </div>
                      <div className="text-3xl font-black text-pink-500 tracking-tighter">
                        ${o.totalAmount.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700">
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4">Artisan Items Included</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {o.items?.map((i: any, idx: number) => (
                        <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-white/5 rounded-2xl border border-transparent hover:border-pink-500/20 transition-all">
                          <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-[10px] font-black text-gray-400 shadow-sm">
                            {i.quantity}x
                          </div>
                          <span className="text-xs font-bold text-gray-600 dark:text-gray-300 line-clamp-1">{i.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}

              {orders.length === 0 && (
                <div className="text-center py-24 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-[3rem] border-2 border-dashed border-gray-200 dark:border-gray-700">
                  <div className="text-6xl mb-6 opacity-20">📦</div>
                  <h3 className="text-xl font-bold text-gray-400 mb-6">No premium orders yet.</h3>
                  <Link href="/products">
                    <button className="px-8 py-3 rounded-full border-2 border-pink-500 text-pink-500 font-black text-[10px] uppercase tracking-widest hover:bg-pink-500 hover:text-white transition-all">
                      Browse Masterpieces
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useCart } from "@/app/context/CartContext";
import { useModal } from "@/app/context/ModalContext";
import { useState } from "react";
import { Button, TextField } from "@mui/material";
import Link from "next/link";
import { MdDelete } from "react-icons/md";

export default function CartPage() {
  const { cart, removeFromCart, cartTotal, baseTotal, appliedCoupon, applyCoupon, removeCoupon } = useCart();
  const { showAlert } = useModal();
  const [couponInput, setCouponInput] = useState("");

  const handleApplyCoupon = async () => {
    if (!couponInput) return;
    try {
      const res = await fetch("/api/cart/coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponInput })
      });
      const data = await res.json();
      if (res.ok) {
        applyCoupon(data);
        setCouponInput("");
        showAlert("Success", "Coupon applied successfully!");
      } else {
        showAlert("Error", data.error || "Invalid coupon.");
      }
    } catch(err) {
      showAlert("Error", "Validation failed.");
    }
  }

  if (cart.length === 0) {
    return (
      <div className="relative min-h-[70vh] flex flex-col items-center justify-center space-y-8 px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-pink-500/10 rounded-full blur-[120px] -z-10"></div>
        <div className="text-8xl mb-4 animate-bounce opacity-20">🛒</div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">Your Cart is Quiet</h1>
        <p className="text-gray-500 text-lg font-medium max-w-md text-center">It seems you haven't started building your gift masterpiece yet.</p>
        <Link href="/products">
          <button className="px-10 py-4 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-sm uppercase tracking-widest shadow-xl hover:scale-105 transition-all">
            Explore Collection
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] py-20 px-4 md:px-12 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[30%] h-[30%] bg-pink-400/10 dark:bg-pink-900/10 rounded-full blur-[100px] -z-0"></div>
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-900/10 rounded-full blur-[100px] -z-0"></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="mb-16">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Review <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Your Selection</span>
          </h1>
          <div className="w-16 h-1 bg-pink-500 rounded-full mt-6"></div>
        </header>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 space-y-6">
            {cart.map((item) => (
              <div key={item.product._id} className="group flex flex-col sm:flex-row justify-between items-center p-6 bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl rounded-[2.5rem] shadow-lg border border-white dark:border-white/10 hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center gap-6 w-full sm:w-auto">
                  <div className="w-28 h-28 bg-gray-100 dark:bg-gray-700 rounded-3xl overflow-hidden shadow-inner flex-shrink-0">
                    {item.product.images?.[0] && (
                      <img src={item.product.images[0]} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                    )}
                  </div>
                  <div>
                    <div className="text-[10px] font-black uppercase tracking-[0.2em] text-pink-500 mb-1">
                      {item.product.type === 'gift-box' ? 'Custom Masterpiece' : item.product.type}
                    </div>
                    <h3 className="font-extrabold text-xl text-gray-900 dark:text-white mb-2 leading-tight">{item.product.name}</h3>
                    
                    {item.giftBoxData && (
                      <div className="mt-2 space-y-1">
                        <div className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Contents:</div>
                        <div className="flex flex-wrap gap-2">
                          {item.giftBoxData.contents.map((c: any, i: number) => (
                            <div key={i} className="text-[8px] font-black bg-gray-100 dark:bg-white/5 px-2 py-0.5 rounded uppercase text-gray-500">
                              {c.sectionName}: {c.product.name}
                            </div>
                          ))}
                        </div>
                        <div className="text-[9px] italic text-pink-500/70 mt-1">To: {item.giftBoxData.to}</div>
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm font-bold mt-3">
                       <span className="text-gray-400">${(item.product.price || item.product.basePrice || 0).toFixed(2)} unit</span>
                       <span className="px-3 py-1 bg-gray-50 dark:bg-white/5 rounded-lg text-gray-600 dark:text-gray-300">Qty: {item.quantity}</span>
                    </div>
                  </div>
                </div>
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center w-full sm:w-auto mt-6 sm:mt-0 h-full gap-4">
                  <span className="font-black text-2xl text-gray-900 dark:text-white tracking-tighter">
                    ${((item.product.price || item.product.basePrice || 0) * item.quantity).toFixed(2)}
                  </span>
                  <button 
                    onClick={() => removeFromCart(item.product._id)} 
                    className="p-3 rounded-full text-gray-300 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                  >
                    <MdDelete size={24} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="w-full lg:w-[400px]">
            <div className="sticky top-28 bg-white/80 dark:bg-gray-800/60 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-gray-700/50">
              <h2 className="text-2xl font-black mb-8 text-gray-900 dark:text-white tracking-tight">Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-sm font-bold text-gray-500 dark:text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-gray-900 dark:text-white">${baseTotal?.toFixed(2)}</span>
                </div>
                
                {appliedCoupon && (
                  <div className="flex justify-between items-center p-3 bg-green-500/10 rounded-2xl border border-green-500/20">
                    <div className="text-xs font-black text-green-600 dark:text-green-400 uppercase tracking-widest">
                       {appliedCoupon.code} Applied
                    </div>
                    <span className="font-black text-green-600">
                      -{appliedCoupon.isPercentage ? `${appliedCoupon.discountAmount}%` : `$${appliedCoupon.discountAmount.toFixed(2)}`}
                    </span>
                  </div>
                )}
              </div>

              <div className="mb-10">
                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input 
                      className="flex-1 px-5 py-3 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                      placeholder="Coupon Code"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value)}
                    />
                    <button 
                      onClick={handleApplyCoupon}
                      className="px-6 py-3 rounded-2xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-[10px] uppercase tracking-widest shadow-lg hover:bg-pink-500 dark:hover:bg-pink-500 dark:hover:text-white transition-all"
                    >
                      Apply
                    </button>
                  </div>
                ) : (
                  <button 
                    onClick={removeCoupon}
                    className="text-[10px] font-black uppercase tracking-widest text-red-500 hover:text-red-600 underline flex items-center gap-1"
                  >
                    Remove Applied Coupon
                  </button>
                )}
              </div>

              <div className="pt-8 border-t border-gray-100 dark:border-gray-700">
                <div className="flex justify-between items-end mb-10">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Total</span>
                  <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter animate-pulse">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>
                
                <Link href="/checkout">
                  <button className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-pink-500/40">
                    Proceed to Checkout
                  </button>
                </Link>
                
                <p className="text-[10px] text-gray-400 text-center mt-6 font-medium uppercase tracking-widest">
                   Secure payment powered by Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


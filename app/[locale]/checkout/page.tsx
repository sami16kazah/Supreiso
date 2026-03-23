"use client";

import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useModal } from "@/app/context/ModalContext";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const { cart, cartTotal, appliedCoupon } = useCart();
  const { showAlert } = useModal();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [formData, setFormData] = useState({
    city: "",
    streetName: "",
    houseAddress: "",
    postalCode: "",
    phoneNumber: ""
  });

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="relative min-h-[70vh] flex flex-col items-center justify-center space-y-10 px-4 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] -z-10"></div>
        <div className="text-7xl mb-2 opacity-20">🔐</div>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight text-center leading-tight">
          Secure Passport <br/> Required
        </h1>
        <p className="text-gray-500 text-lg font-medium max-w-sm text-center">Please sign in to finalize your premium gift selection.</p>
        <button 
          onClick={() => router.push("/api/auth/signin")} 
          className="px-12 py-5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all"
        >
          Sign In Content
        </button>
      </div>
    );
  }

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return showAlert("Empty Cart", "Cart is empty");

    const fullShippingString = `${formData.houseAddress} ${formData.streetName}, ${formData.city}, ${formData.postalCode}`;

    const payload = {
      items: cart,
      email: session?.user?.email,
      name: session?.user?.name,
      shippingAddress: fullShippingString,
      city: formData.city,
      streetName: formData.streetName,
      houseAddress: formData.houseAddress,
      postalCode: formData.postalCode,
      phoneNumber: formData.phoneNumber,
      userId: (session?.user as any)?.id,
      couponCode: appliedCoupon?.code
    };

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        showAlert("Checkout Error", data.error || "Something went wrong initializing Checkout");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] py-20 px-4 md:px-12 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-[20%] right-[-10%] w-[40%] h-[40%] bg-pink-400/10 dark:bg-pink-900/10 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 left-[-10%] w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-900/10 rounded-full blur-[120px] -z-0"></div>

      <div className="max-w-3xl mx-auto relative z-10">
        <header className="mb-16 text-center">
          <h1 className="text-5xl font-black text-gray-900 dark:text-white tracking-tight">
            Finalize <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Details</span>
          </h1>
          <div className="w-16 h-1 bg-pink-500 mx-auto mt-6 rounded-full"></div>
        </header>

        <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 md:p-14 rounded-[3rem] shadow-2xl border border-white dark:border-white/10 overflow-hidden">
          <h2 className="text-2xl font-black mb-10 text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
             <span className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
               <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
             </span>
             Shipping Information
          </h2>

          <form onSubmit={handleCheckout} className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-4">Phone Number</label>
              <input 
                className="w-full px-8 py-5 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phoneNumber} 
                onChange={e => setFormData({ ...formData, phoneNumber: e.target.value })} 
                required 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-4">City</label>
                <input 
                  className="w-full px-8 py-5 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="Paris"
                  value={formData.city} 
                  onChange={e => setFormData({ ...formData, city: e.target.value })} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-4">Postal Code</label>
                <input 
                  className="w-full px-8 py-5 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="10001"
                  value={formData.postalCode} 
                  onChange={e => setFormData({ ...formData, postalCode: e.target.value })} 
                  required 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-4">Street Name</label>
                <input 
                  className="w-full px-8 py-5 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="Avenue des Champs-Élysées"
                  value={formData.streetName} 
                  onChange={e => setFormData({ ...formData, streetName: e.target.value })} 
                  required 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 ml-4">House / Apt</label>
                <input 
                  className="w-full px-8 py-5 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                  placeholder="Suite 100"
                  value={formData.houseAddress} 
                  onChange={e => setFormData({ ...formData, houseAddress: e.target.value })} 
                  required 
                />
              </div>
            </div>

            <div className="pt-12 border-t border-gray-100 dark:border-gray-700 mt-6 bg-gradient-to-b from-transparent to-gray-50/50 dark:to-white/5 -mx-10 md:-mx-14 p-10 md:p-14 mb-[-3.5rem] text-center">
              <div className="flex flex-col items-center mb-10">
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.4em] mb-2">Grand Total</span>
                <span className="text-5xl font-black text-gray-900 dark:text-white tracking-tighter">${cartTotal.toFixed(2)}</span>
              </div>
              
              <button 
                type="submit" 
                className="w-full py-6 rounded-2xl bg-[#635BFF] text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 hover:bg-[#4B45C6] hover:scale-[1.02] hover:-translate-y-1"
              >
                Secure Payment with Stripe
              </button>
              
              <div className="flex items-center justify-center gap-4 mt-8 opacity-40 grayscale">
                 <img src="https://upload.wikimedia.org/wikipedia/commons/b/ba/Stripe_Logo%2C_revised_2016.svg" className="h-5" alt="Stripe" />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}


"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import { Button, LinearProgress } from "@mui/material";

export default function BuildABoxPage() {
  const [step, setStep] = useState(1);
  const [packages, setPackages] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [selectedBox, setSelectedBox] = useState<any>(null);
  const [selectedItems, setSelectedItems] = useState<any[]>([]);
  const { addToCart } = useCart();
  const { showAlert } = useModal();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/products?type=package").then(r => r.json()).then(setPackages);
    fetch("/api/products?type=item").then(r => r.json()).then(setItems);
  }, []);

  const currentArea = selectedItems.reduce((acc, item) => acc + ((item.product.width || 1) * (item.product.height || 1) * item.quantity), 0);
  const maxArea = selectedBox ? ((selectedBox.width || 1) * (selectedBox.height || 1)) : 0;
  const remainingArea = maxArea - currentArea;

  const handleAddItem = (product: any) => {
    const boxW = selectedBox.width || 1;
    const boxH = selectedBox.height || 1;
    const itemW = product.width || 1;
    const itemH = product.height || 1;
    
    const physicallyFits = (itemW <= boxW && itemH <= boxH) || (itemW <= boxH && itemH <= boxW);
    const itemArea = itemW * itemH;

    if (!physicallyFits) {
      showAlert("Notice", "This item is physically too large to fit in this box shape!");
      return;
    }

    if (remainingArea >= itemArea) {
      setSelectedItems(prev => {
        const existing = prev.find(i => i.product._id === product._id);
        if (existing) {
          return prev.map(i => i.product._id === product._id ? { ...i, quantity: i.quantity + 1 } : i);
        }
        return [...prev, { product, quantity: 1 }];
      });
    } else {
      showAlert("Notice", "Not enough area space remaining in the box!");
    }
  };

  const handleRemoveItem = (productId: string) => {
    setSelectedItems(prev => {
      const existing = prev.find(i => i.product._id === productId);
      if (existing && existing.quantity > 1) {
        return prev.map(i => i.product._id === productId ? { ...i, quantity: i.quantity - 1 } : i);
      }
      return prev.filter(i => i.product._id !== productId);
    });
  };

  const handleFinish = () => {
    if (!selectedBox) return;
    addToCart(selectedBox, 1);
    selectedItems.forEach(item => {
      addToCart(item.product, item.quantity);
    });
    router.push("/cart");
  };

  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] py-16 px-4 md:px-12 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-pink-400/10 dark:bg-pink-900/10 rounded-full blur-[120px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-purple-400/10 dark:bg-purple-900/10 rounded-full blur-[120px] -z-0"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-12 text-center">
          <div className="inline-block mb-4 px-6 py-1.5 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm">
            <span className="text-pink-500 font-bold uppercase tracking-widest text-[10px]">Step {step} of 2</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-4 tracking-tight">
            Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Gift Masterpiece</span>
          </h1>
          <div className="w-20 h-1 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto rounded-full mt-6"></div>
        </header>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-2xl font-bold mb-10 text-center text-gray-800 dark:text-gray-200">First, Select Your Artisan Box</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {packages.map(pkg => (
                <div 
                  key={pkg._id} 
                  className={`group relative cursor-pointer rounded-[2.5rem] overflow-hidden border-2 transition-all duration-500 ${selectedBox?._id === pkg._id ? 'border-pink-500 shadow-2xl ring-4 ring-pink-500/10' : 'border-transparent bg-white/80 dark:bg-gray-800/40 backdrop-blur-xl shadow-lg hover:shadow-xl hover:bg-white dark:hover:bg-gray-800/60'}`}
                  onClick={() => setSelectedBox(pkg)}
                >
                  <div className="h-56 bg-gray-100 dark:bg-gray-700 relative overflow-hidden">
                    {pkg.images?.[0] ? (
                      <img src={pkg.images[0]} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold text-lg italic">No Image</div>
                    )}
                    <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 shadow-sm">
                      Premium Pack
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="font-extrabold text-xl mb-4 text-gray-900 dark:text-white tracking-tight">{pkg.name}</h3>
                    <div className="flex justify-between items-center bg-gray-50 dark:bg-black/20 p-4 rounded-2xl">
                      <span className="font-black text-2xl text-gray-900 dark:text-white">${pkg.price.toFixed(2)}</span>
                      <span className="text-xs font-black uppercase tracking-wider text-gray-400 dark:text-gray-500">{pkg.width || 1}x{pkg.height || 1} Capacity</span>
                    </div>
                  </div>
                  {selectedBox?._id === pkg._id && (
                    <div className="absolute top-4 left-4 bg-pink-500 text-white rounded-full p-2 shadow-lg scale-110 animate-pulse">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-16 text-center">
              <button 
                disabled={!selectedBox} 
                onClick={() => setStep(2)} 
                className="group relative px-12 py-5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-lg shadow-2xl transition-all duration-300 hover:scale-105 hover:-translate-y-1 hover:shadow-pink-500/20 disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100 disabled:translate-y-0"
              >
                <span className="relative z-10 flex items-center gap-3">
                  Next Step: Fill It Up
                  <svg className="w-5 h-5 transform transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                </span>
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col lg:flex-row gap-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold mb-8 text-gray-800 dark:text-gray-200">Curate Your Contents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {items.map(item => (
                  <div key={item._id} className="group bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl p-6 rounded-[2rem] shadow-lg border border-white/60 dark:border-white/10 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 border-transparent hover:border-pink-500/30">
                    <div className="flex gap-6 items-start">
                      <div className="w-24 h-24 bg-gray-100 dark:bg-gray-700 rounded-2xl overflow-hidden flex-shrink-0 shadow-inner">
                        {item.images?.[0] ? (
                          <img src={item.images[0]} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 font-bold uppercase tracking-tighter">No Image</div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-extrabold text-lg text-gray-900 dark:text-white mb-2 line-clamp-1">{item.name}</h3>
                        <div className="flex items-center gap-3 mb-2">
                           <span className="text-lg font-black text-pink-500">${item.price.toFixed(2)}</span>
                           <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">Size {item.width || 1}x{item.height || 1}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-2">{item.description}</p>
                      </div>
                    </div>
                    <div className="mt-8">
                      <button 
                        onClick={() => handleAddItem(item)} 
                        disabled={((item.width||1)*(item.height||1)) > remainingArea}
                        className="w-full py-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-800 dark:text-gray-200 font-black text-xs uppercase tracking-widest transition-all duration-300 hover:bg-pink-500 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed border border-gray-100 dark:border-white/5"
                      >
                        Add to Selection
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:w-1/3">
              <div className="sticky top-28 bg-white/80 dark:bg-gray-800/60 backdrop-blur-2xl p-8 rounded-[3rem] shadow-2xl border border-white dark:border-gray-700/50">
                <h3 className="font-black text-2xl mb-8 text-gray-900 dark:text-white tracking-tight flex items-center gap-3">
                  <span className="w-8 h-8 rounded-full bg-pink-500 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20"><path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path></svg>
                  </span>
                  Composition
                </h3>
                
                <div className="mb-10 p-5 bg-gray-50 dark:bg-black/20 rounded-[2rem] border border-gray-100 dark:border-white/5">
                  <div className="flex justify-between text-[11px] mb-3 font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
                    <span>Space Utilization</span>
                    <span className={remainingArea <= 2 ? "text-pink-500" : ""}>{currentArea} / {maxArea} Points</span>
                  </div>
                  <div className="h-2.5 w-full bg-gray-200 dark:bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-pink-500 to-purple-600 transition-all duration-500 shadow-[0_0_10px_rgba(236,72,153,0.3)]"
                      style={{ width: `${(currentArea / maxArea) * 100}%` }}
                    />
                  </div>
                </div>
                
                <div className="space-y-6 max-h-[30vh] overflow-y-auto mb-10 pr-2 custom-scrollbar">
                  {selectedItems.length === 0 && (
                    <div className="text-center py-10 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-3xl text-gray-400 font-bold text-sm italic">
                      Box is empty
                    </div>
                  )}
                  {selectedItems.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center group/item p-2 rounded-xl hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center font-black text-xs text-gray-400">
                          {item.quantity}x
                        </div>
                        <div>
                          <div className="font-extrabold text-sm text-gray-900 dark:text-white line-clamp-1">{item.product.name}</div>
                          <div className="text-[10px] font-black tracking-widest text-gray-400 uppercase">${(item.product.price * item.quantity).toFixed(2)}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.product._id)}
                        className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 hover:bg-red-500 hover:text-white transition-all scale-0 group-hover/item:scale-100"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                      </button>
                    </div>
                  ))}
                </div>

                <div className="pt-8 border-t border-gray-100 dark:border-gray-700">
                  <div className="flex justify-between items-end mb-8">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Grand Total</span>
                    <span className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                      ${((selectedBox?.price || 0) + selectedItems.reduce((acc, i) => acc + (i.product.price * i.quantity), 0)).toFixed(2)}
                    </span>
                  </div>
                  <div className="space-y-4">
                    <button 
                      onClick={handleFinish} 
                      disabled={selectedItems.length === 0} 
                      className="w-full py-5 rounded-[1.5rem] bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 hover:shadow-pink-500/40 disabled:opacity-20 disabled:cursor-not-allowed disabled:scale-100 disabled:translate-y-0"
                    >
                      Complete & Checkout
                    </button>
                    <button 
                      onClick={() => setStep(1)}
                      className="w-full py-4 rounded-[1.5rem] bg-gray-900 dark:bg-white/5 text-white dark:text-gray-300 font-bold text-xs uppercase tracking-widest transition-all duration-300 hover:bg-gray-800"
                    >
                      Change Box Type
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


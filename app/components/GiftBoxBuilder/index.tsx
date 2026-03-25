"use client";

import { useState, useEffect } from "react";
import { useCart } from "@/app/context/CartContext";
import { useModal } from "@/app/context/ModalContext";
import { useRouter } from "next/navigation";
import Box3D from "./Box3D";
import { MdChevronRight, MdChevronLeft, MdCheck, MdAdd, MdRemove } from "react-icons/md";
import Image from "next/image";

export default function GiftBoxBuilder() {
  const [step, setStep] = useState(1);
  const [giftBoxes, setGiftBoxes] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [briefCards, setBriefCards] = useState<any[]>([]);
  
  // Selection State
  const [selectedBox, setSelectedBox] = useState<any>(null);
  const [boxContents, setBoxContents] = useState<any[]>([]); // Array of { sectionName, product }
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [briefForm, setBriefForm] = useState({ from: "", to: "", message: "" });
  
  const [isBoxOpen, setIsBoxOpen] = useState(false);
  const { addToCart } = useCart();
  const { showAlert } = useModal();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/gift-boxes").then(r => r.json()).then(setGiftBoxes);
    fetch("/api/products?type=item").then(r => r.json()).then(setProducts);
    fetch("/api/brief-cards").then(r => r.json()).then(setBriefCards);
  }, []);

  const handleSectionClick = (sectionName: string) => {
    if (!isBoxOpen) {
      setIsBoxOpen(true);
    }
    setSelectedSection(sectionName);
  };

  const addItemToSection = (product: any) => {
    if (!selectedSection) return;
    
    // Check capacity
    const sectionConfig = selectedBox.sections.find((s: any) => s.name === selectedSection);
    const currentCount = boxContents.filter(c => c.sectionName === selectedSection).length;
    
    if (currentCount >= (sectionConfig?.capacity || 1)) {
      showAlert("Section Full", `This section can only hold ${sectionConfig?.capacity} items.`);
      return;
    }

    setBoxContents([...boxContents, { sectionName: selectedSection, product }]);
  };

  const removeItem = (index: number) => {
    const newContents = [...boxContents];
    newContents.splice(index, 1);
    setBoxContents(newContents);
  };

  const handleFinish = () => {
    if (!selectedBox || !selectedCard) return;

    const finalPrice = selectedBox.basePrice + boxContents.reduce((sum, c) => sum + c.product.price, 0);
    const boxWithPrice = { ...selectedBox, price: finalPrice, type: 'gift-box' };

    const giftBoxData = {
      giftBoxId: selectedBox._id,
      from: briefForm.from,
      to: briefForm.to,
      briefCardId: selectedCard._id,
      customMessage: briefForm.message,
      contents: boxContents.map(c => ({
        sectionName: c.sectionName,
        product: c.product // Include full product instead of just ID for easier cart rendering
      }))
    };

    addToCart(boxWithPrice, 1, giftBoxData);
    router.push("/cart");
  };

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  return (
    <div className="max-w-7xl mx-auto py-12 px-6">
      {/* Progress Stepper */}
      <div className="flex justify-between mb-16 relative">
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 dark:bg-white/5 -z-10"></div>
        {[1, 2, 3, 4].map((s) => (
          <div 
            key={s} 
            className={`w-12 h-12 rounded-full flex items-center justify-center font-black transition-all ${step >= s ? 'bg-pink-500 text-white shadow-lg scale-110' : 'bg-gray-100 dark:bg-gray-800 text-gray-400'}`}
          >
            {step > s ? <MdCheck size={24} /> : s}
          </div>
        ))}
      </div>

      {step === 1 && (
        <div className="animate-in fade-in duration-500 space-y-12">
           <div className="text-center">
              <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Step 1: Choose Your <span className="text-pink-500">Vessel</span></h2>
              <p className="text-gray-500 font-medium mt-2">Select the foundation for your gift</p>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {giftBoxes.map(box => (
                <div 
                  key={box._id}
                  onClick={() => setSelectedBox(box)}
                  className={`group relative p-8 rounded-[3rem] border-2 transition-all cursor-pointer ${selectedBox?._id === box._id ? 'border-pink-500 bg-white dark:bg-gray-800 shadow-2xl scale-105' : 'border-transparent bg-gray-50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 shadow-lg'}`}
                >
                   <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-[2rem] mb-6 overflow-hidden">
                      {box.images?.[0] && <img src={box.images[0]} className="w-full h-full object-cover" />}
                   </div>
                   <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">{box.name}</h3>
                   <div className="flex justify-between items-center mt-4">
                      <span className="font-black text-pink-500">${box.basePrice.toFixed(2)}</span>
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{box.sections.length} Compartments</span>
                   </div>
                </div>
              ))}
           </div>
           <div className="flex justify-center mt-12">
              <button 
                disabled={!selectedBox}
                onClick={nextStep}
                className="px-12 py-5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black uppercase tracking-widest shadow-2xl hover:scale-105 disabled:opacity-30 flex items-center gap-3 transition-all"
              >
                Next Step <MdChevronRight size={24} />
              </button>
           </div>
        </div>
      )}

      {step === 2 && (
        <div className="animate-in fade-in duration-500 grid grid-cols-1 lg:grid-cols-2 gap-12">
           <div className="bg-white/50 dark:bg-gray-900/40 rounded-[3rem] border border-white dark:border-white/10 shadow-2xl overflow-hidden relative min-h-[600px]">
              <Box3D 
                dimensions={selectedBox.dimensions} 
                sections={selectedBox.sections} 
                isOpen={isBoxOpen} 
                onSectionClick={handleSectionClick}
                selectedSection={selectedSection || undefined}
                texture={selectedBox.texture}
              />
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-4">
                 <button 
                  onClick={() => setIsBoxOpen(!isBoxOpen)}
                  className="px-8 py-3 rounded-full bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-black text-[10px] uppercase tracking-widest shadow-xl border border-white/20"
                >
                    {isBoxOpen ? 'Close Lid' : 'Open Lid'}
                 </button>
              </div>
           </div>

           <div className="space-y-8">
              <div className="p-8 bg-white/70 dark:bg-gray-800/40 rounded-[2.5rem] border border-white dark:border-white/10 shadow-2xl">
                 <h3 className="text-lg font-black text-gray-900 dark:text-white uppercase tracking-tight mb-6 flex items-center gap-3">
                   {selectedSection ? `Section: ${selectedSection}` : 'Select a Section to Begin'}
                   {selectedSection && <span className="text-[10px] bg-pink-500 text-white px-3 py-1 rounded-full animate-pulse">Active</span>}
                 </h3>
                 
                 <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {products.map(product => (
                      <div 
                        key={product._id}
                        onClick={() => selectedSection && addItemToSection(product)}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${selectedSection ? 'hover:border-pink-500 hover:shadow-lg bg-gray-50/50 dark:bg-black/20 border-white/10' : 'opacity-40 grayscale cursor-not-allowed'}`}
                      >
                         <div className="aspect-square bg-white dark:bg-gray-800 rounded-xl mb-3 overflow-hidden">
                            {product.images?.[0] && <img src={product.images[0]} className="w-full h-full object-cover" />}
                         </div>
                         <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase line-clamp-1">{product.name}</h4>
                         <span className="text-[10px] font-bold text-pink-500 mt-1 block">${product.price.toFixed(2)}</span>
                      </div>
                    ))}
                 </div>
              </div>

              <div className="p-8 bg-gray-900 text-white rounded-[2.5rem] shadow-2xl">
                 <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-6 underline">Vessel Contents</h3>
                 <div className="space-y-4 max-h-[200px] overflow-y-auto pr-2">
                    {boxContents.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center group">
                         <div className="flex items-center gap-3">
                            <span className="text-[9px] font-black bg-pink-500 px-2 py-0.5 rounded uppercase">{item.sectionName}</span>
                            <span className="text-xs font-bold">{item.product.name}</span>
                         </div>
                         <button onClick={() => removeItem(idx)} className="text-gray-500 hover:text-red-500 transition-colors">
                            <MdRemove size={18} />
                         </button>
                      </div>
                    ))}
                    {boxContents.length === 0 && <div className="text-[10px] font-bold text-gray-500 italic uppercase">Your masterpiece is currently empty...</div>}
                 </div>
                 <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Running Total</span>
                    <span className="text-2xl font-black tracking-tighter">${(selectedBox.basePrice + boxContents.reduce((sum, item) => sum + item.product.price, 0)).toFixed(2)}</span>
                 </div>
              </div>

              <div className="flex justify-between mt-8">
                 <button onClick={prevStep} className="p-5 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-pink-500 transition-all"><MdChevronLeft size={24} /></button>
                 <button 
                  disabled={boxContents.length === 0}
                  onClick={nextStep}
                  className="flex-1 ml-4 py-5 rounded-3xl bg-pink-500 text-white font-black uppercase tracking-widest shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-3"
                >
                    Choose Brief Card <MdChevronRight size={24} />
                 </button>
              </div>
           </div>
        </div>
      )}

      {step === 3 && (
        <div className="animate-in fade-in duration-500 space-y-12">
           <div className="text-center">
              <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Step 3: <span className="text-pink-500">The Greeting</span></h2>
              <p className="text-gray-500 font-medium mt-2">Select an artistic card from our album</p>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
              {briefCards.map(card => (
                <div 
                  key={card._id}
                  onClick={() => setSelectedCard(card)}
                  className={`group relative aspect-[3/4] rounded-[2rem] overflow-hidden cursor-pointer transition-all ${selectedCard?._id === card._id ? 'ring-4 ring-pink-500 scale-105 shadow-2xl' : 'opacity-70 hover:opacity-100 shadow-lg'}`}
                >
                   <img src={card.photo} className="w-full h-full object-cover" />
                   <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                   <div className="absolute bottom-4 left-4 right-4 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <h4 className="text-[10px] font-black uppercase tracking-widest">{card.title}</h4>
                      <p className="text-[8px] font-bold text-gray-300 uppercase mt-1">Limit: {card.characterLimit}</p>
                   </div>
                   {selectedCard?._id === card._id && (
                     <div className="absolute top-4 right-4 bg-pink-500 text-white rounded-full p-2">
                        <MdCheck size={20} />
                     </div>
                   )}
                </div>
              ))}
           </div>
           <div className="flex justify-between mt-12">
              <button onClick={prevStep} className="px-8 py-5 rounded-2xl bg-gray-100 dark:bg-white/5 text-gray-400 hover:text-pink-500 transition-all font-black uppercase text-xs tracking-widest flex items-center gap-2"><MdChevronLeft size={20} /> Back</button>
              <button 
                disabled={!selectedCard}
                onClick={nextStep}
                className="px-12 py-5 rounded-full bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black uppercase tracking-widest shadow-2xl hover:scale-105 disabled:opacity-30 flex items-center gap-3 transition-all"
              >
                Continue to Brief <MdChevronRight size={20} />
              </button>
           </div>
        </div>
      )}

      {step === 4 && (
        <div className="animate-in fade-in duration-500 max-w-2xl mx-auto space-y-12">
           <div className="text-center">
              <h2 className="text-4xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Final Step: <span className="text-pink-500">The Brief</span></h2>
              <p className="text-gray-500 font-medium mt-2">Personalize your masterpiece</p>
           </div>
           
           <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[3rem] border border-white dark:border-white/10 shadow-2xl space-y-8">
              <div className="grid grid-cols-2 gap-8">
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">From</label>
                    <input 
                      value={briefForm.from}
                      onChange={(e) => setBriefForm({...briefForm, from: e.target.value})}
                      placeholder="Your Name"
                      className="w-full px-8 py-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold outline-none focus:border-pink-500 transition-all"
                    />
                 </div>
                 <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">To</label>
                    <input 
                      value={briefForm.to}
                      onChange={(e) => setBriefForm({...briefForm, to: e.target.value})}
                      placeholder="Recipient's Name"
                      className="w-full px-8 py-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold outline-none focus:border-pink-500 transition-all"
                    />
                 </div>
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between items-center ml-2 mr-2">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Your Message</label>
                    <span className={`text-[10px] font-black uppercase ${briefForm.message.length > selectedCard.characterLimit ? 'text-red-500' : 'text-pink-500'}`}>
                       {briefForm.message.length} / {selectedCard.characterLimit}
                    </span>
                 </div>
                 <textarea 
                    value={briefForm.message}
                    onChange={(e) => setBriefForm({...briefForm, message: e.target.value})}
                    placeholder="Write something heartfelt..."
                    rows={6}
                    className="w-full px-8 py-6 rounded-3xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold outline-none focus:border-pink-500 transition-all"
                 />
              </div>

              <button 
                disabled={!briefForm.from || !briefForm.to || !briefForm.message || briefForm.message.length > selectedCard.characterLimit}
                onClick={handleFinish}
                className="w-full py-6 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black uppercase tracking-widest shadow-2xl hover:scale-105 disabled:grayscale disabled:opacity-40 transition-all flex items-center justify-center gap-3"
              >
                 Add Masterpiece to Cart
              </button>
           </div>
           
           <div className="flex justify-center">
              <button onClick={prevStep} className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-pink-500 transition-colors">← Change Greeting Card</button>
           </div>
        </div>
      )}
    </div>
  );
}

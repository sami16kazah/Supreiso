"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useModal } from "@/app/context/ModalContext";
import { MdCloudUpload, MdDelete, MdArrowBack } from "react-icons/md";

function ProductFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showAlert } = useModal();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "item",
    width: "" as any,
    height: "" as any,
    price: "" as any,
    discount: "" as any,
    amount: "" as any,
    images: [] as string[]
  });

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setFormData({
            name: data.name || "",
            description: data.description || "",
            type: data.type || "item",
            width: data.width || 1,
            height: data.height || 1,
            price: data.price || 0,
            discount: data.discount || 0,
            amount: data.amount || 0,
            images: data.images || []
          });
        });
    }
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("file", file);

    try {
      const res = await fetch(`/api/admin/upload`, {
        method: "POST",
        body: uploadData,
      });
      const data = await res.json();
      if (data.secure_url) {
        setFormData(prev => ({ ...prev, images: [...prev.images, data.secure_url] }));
      } else {
        showAlert("Upload Error", data.error || "Secure upload failed.");
      }
    } catch (err) {
      console.error(err);
      showAlert("Error", "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = id ? "PUT" : "POST";
    const url = id ? `/api/admin/products/${id}` : "/api/admin/products";

    const payload = {
      ...formData,
      width: Number(formData.width),
      height: Number(formData.height),
      price: Number(formData.price),
      discount: Number(formData.discount),
      amount: Number(formData.amount)
    };

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.push("/admin/products");
    } else {
      showAlert("Error", "Error saving product");
    }
  };

  const inputClasses = "w-full px-6 py-4 rounded-2xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all";
  const labelClasses = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-2 block ml-2";

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header>
        <button 
          onClick={() => router.push("/admin/products")}
          className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-pink-500 transition-colors flex items-center gap-2 mb-4"
        >
          <MdArrowBack size={16} /> Cancel & Return
        </button>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          {id ? "Edit Masterpiece" : "New Creation"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Entry</span>
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10 space-y-8">
          <div>
            <label className={labelClasses}>Product Title</label>
            <input 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              className={inputClasses} 
              placeholder="Ex: Midnight Velvet Box"
              required 
            />
          </div>

          <div>
            <label className={labelClasses}>Boutique Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              className={`${inputClasses} min-h-[120px] resize-none`}
              placeholder="Describe the aesthetic and contents..."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelClasses}>Classification</label>
              <select 
                name="type" 
                value={formData.type} 
                onChange={handleChange} 
                className={inputClasses}
              >
                <option value="item">Handcrafted Item</option>
                <option value="package">Bespoke Package</option>
              </select>
            </div>
            <div>
              <label className={labelClasses}>Stock Availability</label>
              <input 
                name="amount" 
                type="number" 
                value={formData.amount} 
                onChange={handleChange} 
                className={inputClasses} 
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <label className={labelClasses}>Standard Valuation ($)</label>
              <input 
                name="price" 
                type="number" 
                value={formData.price} 
                onChange={handleChange} 
                className={inputClasses} 
                required 
              />
            </div>
            <div>
              <label className={labelClasses}>Promotional Rebate ($)</label>
              <input 
                name="discount" 
                type="number" 
                value={formData.discount} 
                onChange={handleChange} 
                className={inputClasses} 
              />
            </div>
          </div>

          <div className="p-8 bg-gray-50/50 dark:bg-black/20 rounded-[2.5rem] border border-gray-100 dark:border-white/5">
            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-gray-400 mb-6 flex items-center gap-2">
               Dimensions <span className="text-[10px] font-bold text-gray-300">(Unit Grid)</span>
            </h3>
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className={labelClasses}>Width</label>
                <input 
                  name="width" 
                  type="number" 
                  value={formData.width} 
                  onChange={handleChange} 
                  className={inputClasses} 
                />
              </div>
              <div>
                <label className={labelClasses}>Height</label>
                <input 
                  name="height" 
                  type="number" 
                  value={formData.height} 
                  onChange={handleChange} 
                  className={inputClasses} 
                />
              </div>
            </div>
          </div>
        </div>

        {/* Image Management */}
        <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[3rem] shadow-2xl border border-white dark:border-white/10">
          <h3 className="text-xl font-black text-gray-900 dark:text-white tracking-tight mb-8">Visual Assets</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-6">
            {formData.images.map((url, i) => (
              <div key={i} className="relative group aspect-square rounded-[2rem] overflow-hidden border-4 border-white dark:border-white/10 shadow-lg transition-all hover:scale-105">
                <img src={url} alt="asset" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => handleRemoveImage(i)}
                  className="absolute inset-0 bg-pink-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                >
                  <MdDelete size={24} />
                </button>
              </div>
            ))}
            
            <label className={`aspect-square rounded-[2rem] border-4 border-dashed border-gray-200 dark:border-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-gray-400 hover:text-pink-500 ${uploading ? 'animate-pulse' : ''}`}>
               <MdCloudUpload size={32} className="mb-2" />
               <span className="text-[10px] font-black uppercase tracking-widest">{uploading ? "Uploading" : "Add Image"}</span>
               <input type="file" hidden accept="image/*" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        <div className="flex justify-end pt-4">
           <button 
             type="submit"
             className="px-16 py-6 rounded-3xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all"
           >
             Commit to Database
           </button>
        </div>
      </form>
    </div>
  );
}

export default function ProductForm() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading Form...</div>}>
      <ProductFormContent />
    </Suspense>
  );
}


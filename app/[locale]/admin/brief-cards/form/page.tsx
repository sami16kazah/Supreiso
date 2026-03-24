"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdArrowBack, MdCloudUpload, MdSave, MdCheckCircle } from "react-icons/md";
import Link from "next/link";
import Image from "next/image";

function BriefCardForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    title: "",
    characterLimit: 200,
    photo: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/brief-cards/${id}`)
        .then((res) => res.json())
        .then((data) => setFormData(data));
    }
  }, [id]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: data,
      });
      const result = await res.json();
      if (result.secure_url) {
        setFormData({ ...formData, photo: result.secure_url });
      }
    } catch (error) {
      console.error("Upload failed", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/admin/brief-cards/${id}` : "/api/admin/brief-cards";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/brief-cards");
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20">
      <header className="flex items-center gap-6">
        <Link href="/admin/brief-cards">
          <button className="p-4 rounded-2xl bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl border border-white dark:border-white/10 text-gray-400 hover:text-pink-500 transition-all shadow-lg">
            <MdArrowBack size={24} />
          </button>
        </Link>
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
            {id ? "Refine" : "Create"} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Brief Card</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">Greeting card configuration</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Photo Upload Section */}
        <div className="space-y-6">
           <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-4">Card Visual (Photo)</label>
           <div className={`relative aspect-[4/5] rounded-[3rem] border-4 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center bg-white/40 dark:bg-black/20 ${formData.photo ? 'border-pink-500/20' : 'border-gray-200 dark:border-white/5 hover:border-pink-500/40'}`}>
              {formData.photo ? (
                <>
                  <Image src={formData.photo} alt="Preview" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center">
                    <button type="button" onClick={() => setFormData({...formData, photo: ""})} className="px-6 py-3 bg-red-500 text-white rounded-xl font-black text-[10px] uppercase tracking-widest">Remove Photo</button>
                  </div>
                </>
              ) : (
                <div className="text-center p-10">
                   <div className={`p-6 rounded-3xl bg-pink-500/10 text-pink-500 mb-6 mx-auto w-fit ${uploading ? 'animate-pulse' : ''}`}>
                      <MdCloudUpload size={40} />
                   </div>
                   <input type="file" id="photo-upload" className="hidden" onChange={handleUpload} accept="image/*" />
                   <label htmlFor="photo-upload" className="cursor-pointer">
                      <div className="text-gray-900 dark:text-white font-black text-lg mb-2">Upload Artwork</div>
                      <div className="text-gray-400 text-xs font-bold leading-relaxed">High-resolution portraits recommended. (PNG, JPG, WEBP)</div>
                   </label>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-md flex items-center justify-center">
                   <div className="flex flex-col items-center gap-4">
                      <div className="w-12 h-12 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest">Uploading to Clouds...</span>
                   </div>
                </div>
              )}
           </div>
        </div>

        {/* Details Section */}
        <div className="space-y-10">
           <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white dark:border-white/10 space-y-8">
              <div className="space-y-3">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Card Title</label>
                 <input 
                    required
                    type="text" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    placeholder="E.g. Birthday Classic"
                    className="w-full px-8 py-5 rounded-2xl bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 outline-none transition-all"
                  />
              </div>

              <div className="space-y-3">
                 <div className="flex justify-between">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Character Limit</label>
                    <span className="text-[10px] font-black text-pink-500 uppercase tracking-widest mr-2">{formData.characterLimit} chars</span>
                 </div>
                 <input 
                    type="range"
                    min="10"
                    max="1000"
                    step="10"
                    value={formData.characterLimit}
                    onChange={(e) => setFormData({...formData, characterLimit: parseInt(e.target.value)})}
                    className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500"
                  />
              </div>

              <div className="flex items-center justify-between p-6 rounded-2xl bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5">
                 <div className="flex items-center gap-4">
                    <MdCheckCircle className={formData.isActive ? "text-green-500" : "text-gray-300"} size={24} />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Visibility Status</span>
                 </div>
                 <button 
                  type="button" 
                  onClick={() => setFormData({...formData, isActive: !formData.isActive})}
                  className={`relative w-16 h-8 rounded-full transition-colors duration-300 ${formData.isActive ? 'bg-green-500' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${formData.isActive ? 'translate-x-8' : ''}`}></div>
                </button>
              </div>
           </div>

           <button 
              disabled={loading || uploading || !formData.photo}
              type="submit" 
              className="w-full py-6 rounded-3xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-[1.02] active:scale-95 disabled:grayscale disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-3"
            >
              <MdSave size={20} />
              {loading ? "Commiting..." : "Save Configuration"}
           </button>
        </div>
      </form>
    </div>
  );
}

export default function BriefCardFormPage() {
  return (
    <Suspense fallback={<div>Loading form...</div>}>
      <BriefCardForm />
    </Suspense>
  );
}

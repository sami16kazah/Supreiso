"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { MdArrowBack, MdSave, MdAdd, MdDelete, MdLayers, MdDashboard, MdColorLens, MdCloudUpload } from "react-icons/md";
import Link from "next/link";
import Box3D from "@/app/components/GiftBoxBuilder/Box3D";
import { useModal } from "@/app/context/ModalContext";

function GiftBoxForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [formData, setFormData] = useState({
    name: "",
    basePrice: 0,
    dimensions: { width: 1, height: 1, length: 1, depth: 1 },
    sections: [] as any[],
    images: [] as string[],
    texture: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const { showAlert } = useModal();

  useEffect(() => {
    if (id) {
      fetch(`/api/admin/gift-boxes/${id}`)
        .then((res) => res.json())
        .then((data) => setFormData(data));
    }
  }, [id]);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData({ ...formData, images: [...formData.images, result.secure_url] });
      }
    } catch (error) {
      console.error("Upload failed", error);
      showAlert("Upload Error", "Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  const handleTextureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setFormData({ ...formData, texture: result.secure_url });
      }
    } catch (error) {
      console.error("Texture upload failed", error);
      showAlert("Upload Error", "Failed to upload texture.");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...formData.images];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const addSection = () => {
    setFormData({
      ...formData,
      sections: [...formData.sections, { name: "", level: 0, capacity: 1, color: "#ffffff", priceModifier: 0 }]
    });
  };

  const removeSection = (index: number) => {
    const newSections = [...formData.sections];
    newSections.splice(index, 1);
    setFormData({ ...formData, sections: newSections });
  };

  const updateSection = (index: number, field: string, value: any) => {
    const newSections = [...formData.sections];
    newSections[index] = { ...newSections[index], [field]: value };
    setFormData({ ...formData, sections: newSections });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const method = id ? "PUT" : "POST";
    const url = id ? `/api/admin/gift-boxes/${id}` : "/api/admin/gift-boxes";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        router.push("/admin/gift-boxes");
      }
    } catch (error) {
      console.error("Save failed", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-20">
      <header className="flex items-center gap-6">
        <Link href="/admin/gift-boxes">
          <button className="p-4 rounded-2xl bg-white/70 dark:bg-gray-800/40 backdrop-blur-xl border border-white dark:border-white/10 text-gray-400 hover:text-pink-500 transition-all shadow-lg">
            <MdArrowBack size={24} />
          </button>
        </Link>
        <div>
          <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight uppercase">
             Design <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Gift Sphere</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-1 uppercase tracking-widest">3D Architecture & Logic</p>
        </div>
      </header>

      <form onSubmit={handleSubmit} className="space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
           {/* Left Column: Form Details (5 Columns) */}
           <div className="lg:col-span-5 space-y-12">
              <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white dark:border-white/10 space-y-8">
                  <h3 className="text-xs font-black text-pink-500 uppercase tracking-[0.2em] mb-4">Base Configuration</h3>
                  
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Box Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="Classic Square Box"
                      className="w-full px-8 py-5 rounded-2xl bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold outline-none focus:border-pink-500 transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Base Price ($)</label>
                      <input 
                        required
                        type="number" 
                        step="0.01"
                        value={formData.basePrice}
                        onChange={(e) => setFormData({...formData, basePrice: parseFloat(e.target.value)})}
                        className="w-full px-8 py-5 rounded-2xl bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold outline-none focus:border-pink-500 transition-all"
                      />
                    </div>
                    <div className="space-y-3">
                       <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Status</label>
                       <select 
                        value={formData.isActive ? "true" : "false"}
                        onChange={(e) => setFormData({...formData, isActive: e.target.value === "true"})}
                        className="w-full px-8 py-5 rounded-2xl bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold outline-none focus:border-pink-500 transition-all"
                       >
                         <option value="true">Active</option>
                         <option value="false">Inactive</option>
                       </select>
                    </div>
                  </div>
              </div>

              <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white dark:border-white/10 space-y-8">
                  <h3 className="text-xs font-black text-purple-500 uppercase tracking-[0.2em] mb-4">3D Dimensions (Units)</h3>
                  <div className="grid grid-cols-2 gap-6">
                    {['width', 'height', 'length', 'depth'].map((dim) => (
                        <div key={dim} className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">{dim}</label>
                          <input 
                            type="number" 
                            step="0.1"
                            value={(formData.dimensions as any)[dim]}
                            onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, [dim]: parseFloat(e.target.value)}})}
                            className="w-full px-6 py-4 rounded-xl bg-gray-50/50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-sm font-bold outline-none focus:border-purple-500 transition-all"
                          />
                        </div>
                    ))}
                  </div>
              </div>

              {/* Texture Management */}
              <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white dark:border-white/10 space-y-6">
                <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.2em]">3D Surface Skin (Texture)</h3>
                {formData.texture ? (
                  <div className="relative group rounded-2xl overflow-hidden border-2 border-pink-500/30 aspect-video bg-black/5">
                    <img src={formData.texture} className="w-full h-full object-contain" />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, texture: "" })}
                      className="absolute top-4 right-4 p-3 bg-red-500 text-white rounded-xl shadow-xl hover:scale-110 transition-all"
                    >
                      <MdDelete size={20} />
                    </button>
                    <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-[8px] font-black text-white uppercase tracking-widest">
                       Active Engine Skin
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-orange-500/20 rounded-[2rem] cursor-pointer hover:bg-orange-500/5 transition-all group">
                    <MdColorLens size={32} className="text-orange-500/40 group-hover:text-orange-500 mb-4 transition-all" />
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Upload 3D Texture Mapping</span>
                    <input type="file" hidden accept="image/*" onChange={handleTextureUpload} />
                  </label>
                )}
              </div>

              {/* Image Management */}
              <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-2xl border border-white dark:border-white/10">
                <h3 className="text-xs font-black text-teal-500 uppercase tracking-[0.2em] mb-8">Visual Gallery</h3>
                
                <div className="grid grid-cols-3 gap-4">
                  {formData.images.map((url, i) => (
                    <div key={i} className="relative group aspect-square rounded-2xl overflow-hidden border-2 border-white dark:border-white/10 shadow-lg transition-all hover:scale-105">
                      <img src={url} alt="asset" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all"
                      >
                        <MdDelete size={20} />
                      </button>
                    </div>
                  ))}
                  
                  <label className={`aspect-square rounded-2xl border-2 border-dashed border-gray-200 dark:border-white/5 flex flex-col items-center justify-center cursor-pointer hover:border-pink-500/50 hover:bg-pink-500/5 transition-all text-gray-400 hover:text-pink-500 ${uploading ? 'animate-pulse' : ''}`}>
                    <MdCloudUpload size={24} className="mb-2" />
                    <span className="text-[8px] font-black uppercase tracking-widest">{uploading ? "Uploading" : "Add Image"}</span>
                    <input type="file" hidden accept="image/*" onChange={handleImageUpload} disabled={uploading} />
                  </label>
                </div>
              </div>

              {/* Sections Management */}
              <div className="space-y-8">
                <div className="flex items-center justify-between mb-2 px-4">
                    <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-[0.2em]">Compartments & Logic</h3>
                    <button 
                      type="button" 
                      onClick={addSection}
                      className="px-6 py-3 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <MdAdd size={16} />
                      Add Section
                    </button>
                </div>

                <div className="grid grid-cols-1 gap-6">
                    {formData.sections.map((section, idx) => (
                      <div key={idx} className="group bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-8 rounded-[2.5rem] border border-white dark:border-white/10 shadow-xl transition-all hover:border-pink-500/30">
                        <div className="flex flex-col gap-6">
                            <div className="grid grid-cols-2 gap-4 w-full">
                              <div className="space-y-2">
                                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Name</label>
                                  <input 
                                    value={section.name}
                                    onChange={(e) => updateSection(idx, 'name', e.target.value)}
                                    placeholder="Section A"
                                    className="w-full px-6 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-xs font-bold outline-none focus:border-pink-500"
                                  />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Level</label>
                                  <input 
                                      type="number"
                                      value={section.level}
                                      onChange={(e) => updateSection(idx, 'level', parseInt(e.target.value))}
                                      className="w-full px-6 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-xs font-bold outline-none focus:border-pink-500"
                                    />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Capacity</label>
                                  <input 
                                      type="number"
                                      value={section.capacity}
                                      onChange={(e) => updateSection(idx, 'capacity', parseInt(e.target.value))}
                                      className="w-full px-6 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-gray-100 dark:border-white/5 text-xs font-bold outline-none focus:border-pink-500"
                                    />
                              </div>
                              <div className="space-y-2">
                                  <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2">Color</label>
                                  <input 
                                      type="color"
                                      value={section.color}
                                      onChange={(e) => updateSection(idx, 'color', e.target.value)}
                                      className="h-10 w-full cursor-pointer rounded-xl bg-transparent border-none"
                                    />
                              </div>
                            </div>
                            <div className="flex justify-end">
                              <button 
                                type="button" 
                                onClick={() => removeSection(idx)}
                                className="p-3 rounded-xl text-red-500 hover:bg-red-500/10 transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                              >
                                 <MdDelete size={16} /> Delete Section
                              </button>
                            </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
           </div>

           {/* Right Column: 3D Visualization (7 Columns) */}
           <div className="lg:col-span-7 sticky top-12 space-y-8 h-full">
              <div className="bg-white dark:bg-black/40 backdrop-blur-3xl rounded-[4rem] shadow-[0_22px_70px_4px_rgba(0,0,0,0.1)] dark:shadow-[0_22px_70px_4px_rgba(0,0,0,0.5)] border border-white dark:border-white/10 overflow-hidden relative min-h-[500px] h-[75vh] transition-all flex flex-col group/canvas">
                <div className="absolute top-10 left-10 z-10">
                   <div className="px-6 py-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-[10px] uppercase tracking-widest shadow-xl flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-white animate-ping"></div>
                      Live Engine Rendering
                   </div>
                </div>
                
                <div className="flex-1 w-full bg-gradient-to-b from-gray-50/50 to-white dark:from-black/10 dark:to-transparent">
                  <Box3D 
                    dimensions={formData.dimensions}
                    sections={formData.sections}
                    isOpen={true}
                    texture={formData.texture}
                    onSectionClick={() => {}}
                  />
                </div>

                <div className="p-10 bg-white/50 dark:bg-black/20 backdrop-blur-xl border-t border-white dark:border-white/5 grid grid-cols-3 gap-10">
                   <div>
                      <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Structure Name</div>
                      <div className="text-lg font-black text-gray-900 dark:text-white truncate">{formData.name || "Untitled Blueprint"}</div>
                   </div>
                   <div className="text-center">
                      <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Complexity</div>
                      <div className="text-lg font-black text-pink-500">{formData.sections.length} Compartments</div>
                   </div>
                   <div className="text-right">
                      <div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-2">Valuation</div>
                      <div className="text-2xl font-black text-gray-900 dark:text-white">${formData.basePrice.toFixed(2)}</div>
                   </div>
                </div>
              </div>

              <button 
                disabled={loading || formData.sections.length === 0}
                onClick={handleSubmit}
                type="button" 
                className="w-full py-8 rounded-[2.5rem] bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-lg uppercase tracking-[0.3em] shadow-[0_20px_50px_rgba(236,72,153,0.3)] hover:scale-[1.02] active:scale-[0.98] disabled:grayscale disabled:opacity-50 transition-all flex items-center justify-center gap-4 group"
              >
                <MdSave size={28} className="group-hover:rotate-12 transition-transform" />
                {loading ? "Constructing..." : "Finalize Blueprint"}
              </button>
           </div>
        </div>
      </form>
    </div>
  );
}

export default function GiftBoxFormPage() {
  return (
    <Suspense fallback={<div>Loading architect...</div>}>
      <GiftBoxForm />
    </Suspense>
  );
}

"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useModal } from "@/app/context/ModalContext";
import { MdAdd, MdEdit, MdDelete, MdSearch, MdLayers, MdDashboard } from "react-icons/md";

type GiftBox = {
  _id: string;
  name: string;
  basePrice: number;
  sections: any[];
  images?: string[];
  isActive: boolean;
};

export default function GiftBoxesPage() {
  const [boxes, setBoxes] = useState<GiftBox[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { showConfirm } = useModal();

  useEffect(() => {
    fetchBoxes();
  }, []);

  const fetchBoxes = async () => {
    try {
      const res = await fetch("/api/admin/gift-boxes");
      if (res.ok) setBoxes(await res.json());
    } catch(e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm("Confirm Deletion", "Are you sure you want to delete this gift box?", async () => {
      await fetch(`/api/admin/gift-boxes/${id}`, { method: "DELETE" });
      fetchBoxes();
    });
  };

  const filteredBoxes = boxes.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Box <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Architectures</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2 uppercase tracking-widest">Design 3D structures and compartments</p>
        </div>
        <Link href="/admin/gift-boxes/form">
          <button className="px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
            <MdAdd size={20} />
            Build New Box
          </button>
        </Link>
      </header>

      <div className="relative group">
        <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-pink-500" size={24} />
        <input 
          className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl border border-white dark:border-white/10 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all shadow-lg"
          placeholder="Filter box configurations..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-black/20 text-left border-b border-gray-100 dark:border-white/5">
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Box Identity</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price Point</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Compartments</th>
                <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Levels</th>
                <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {filteredBoxes.map((box) => {
                const levels = Array.from(new Set(box.sections.map(s => s.level))).length;
                return (
                  <tr key={box._id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        {box.images?.[0] ? (
                          <div className="w-12 h-12 rounded-xl border border-white/20 overflow-hidden shadow-md">
                            <img src={box.images[0]} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-xl bg-gray-100 dark:bg-white/5 border border-dashed border-gray-200 dark:border-white/10 flex items-center justify-center text-[10px] text-gray-400 font-black">N/A</div>
                        )}
                        <div>
                          <div className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors uppercase tracking-tight">{box.name}</div>
                          <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">ID: ...{box._id.slice(-8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="font-black text-gray-900 dark:text-white tracking-tighter">${box.basePrice.toFixed(2)}</span>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <MdDashboard className="text-pink-500" size={16} />
                        <span className="font-black text-sm text-gray-900 dark:text-white">{box.sections.length}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <div className="flex items-center gap-2">
                        <MdLayers className="text-purple-500" size={16} />
                        <span className="font-black text-sm text-gray-900 dark:text-white">{levels}</span>
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right space-x-2">
                      <Link href={`/admin/gift-boxes/form?id=${box._id}`}>
                        <button className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-pink-500 hover:bg-white dark:hover:bg-white transition-all shadow-sm">
                          <MdEdit size={18} />
                        </button>
                      </Link>
                      <button 
                        onClick={() => handleDelete(box._id)}
                        className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-white transition-all shadow-sm"
                      >
                        <MdDelete size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              {filteredBoxes.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-10 py-16 text-center text-gray-400 font-bold italic">No structures defined yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

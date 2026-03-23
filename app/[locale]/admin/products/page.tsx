"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useModal } from "@/app/context/ModalContext";
import { MdAdd, MdEdit, MdDelete, MdSearch } from "react-icons/md";

type Product = {
  _id: string;
  name: string;
  type: string;
  price: number;
  amount: number;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { showConfirm } = useModal();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/admin/products");
      if (res.ok) setProducts(await res.json());
    } catch(e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm("Confirm Deletion", "Are you sure you want to delete this product?", async () => {
      await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      fetchProducts();
    });
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const packages = filteredProducts.filter(p => p.type === "package");
  const items = filteredProducts.filter(p => p.type === "item");

  const renderTable = (data: Product[], title: string) => (
    <div className="mb-16">
      <div className="flex items-center gap-3 mb-8">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">{title}</h2>
        <span className="px-3 py-1 bg-gray-100 dark:bg-white/5 text-gray-400 text-xs font-black rounded-full uppercase tracking-widest">{data.length}</span>
      </div>
      
      <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl border border-white dark:border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50/50 dark:bg-black/20 text-left border-b border-gray-100 dark:border-white/5">
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Product Name</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Price</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Availability</th>
                <th className="px-10 py-5 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
              {data.map((p) => (
                <tr key={p._id} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                  <td className="px-10 py-6">
                    <div className="font-extrabold text-sm text-gray-900 dark:text-white group-hover:text-pink-500 transition-colors uppercase tracking-tight">{p.name}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="font-black text-gray-900 dark:text-white tracking-tighter">${p.price.toFixed(2)}</span>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-4 py-1.5 inline-flex text-[9px] font-black uppercase tracking-widest rounded-full ${p.amount > 10 ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'}`}>
                      {p.amount} in stock
                    </span>
                  </td>
                  <td className="px-10 py-6 text-right space-x-2">
                    <Link href={`/admin/products/form?id=${p._id}`}>
                      <button className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-pink-500 hover:bg-white dark:hover:bg-white transition-all shadow-sm">
                        <MdEdit size={18} />
                      </button>
                    </Link>
                    <button 
                      onClick={() => handleDelete(p._id)}
                      className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-white transition-all shadow-sm"
                    >
                      <MdDelete size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-10 py-16 text-center text-gray-400 font-bold italic">No records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Inventory <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Assets</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2 uppercase tracking-widest">Manage your boutique offerings</p>
        </div>
        <Link href="/admin/products/form">
          <button className="px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
            <MdAdd size={20} />
            Create Entry
          </button>
        </Link>
      </header>

      <div className="relative group">
        <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-pink-500" size={24} />
        <input 
          className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl border border-white dark:border-white/10 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all shadow-lg"
          placeholder="Filter masterpieces by title or type..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {renderTable(packages, "Gift Box Variations")}
      {renderTable(items, "A la Carte Items")}
    </div>
  );
}


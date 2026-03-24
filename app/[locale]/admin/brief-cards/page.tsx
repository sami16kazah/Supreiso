"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useModal } from "@/app/context/ModalContext";
import { MdAdd, MdEdit, MdDelete, MdSearch, MdInfo } from "react-icons/md";
import Image from "next/image";

type BriefCard = {
  _id: string;
  title: string;
  photo: string;
  characterLimit: number;
  isActive: boolean;
};

export default function BriefCardsPage() {
  const [cards, setCards] = useState<BriefCard[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { showConfirm } = useModal();

  useEffect(() => {
    fetchCards();
  }, []);

  const fetchCards = async () => {
    try {
      const res = await fetch("/api/admin/brief-cards");
      if (res.ok) setCards(await res.json());
    } catch(e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    showConfirm("Confirm Deletion", "Are you sure you want to delete this brief card?", async () => {
      await fetch(`/api/admin/brief-cards/${id}`, { method: "DELETE" });
      fetchCards();
    });
  };

  const filteredCards = cards.filter(c => 
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-12">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
           <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
            Brief <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Cards</span>
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2 uppercase tracking-widest">Manage greeting cards for gift boxes</p>
        </div>
        <Link href="/admin/brief-cards/form">
          <button className="px-10 py-4 rounded-2xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black text-sm uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
            <MdAdd size={20} />
            Add New Card
          </button>
        </Link>
      </header>

      <div className="relative group">
        <MdSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 transition-colors group-focus-within:text-pink-500" size={24} />
        <input 
          className="w-full pl-16 pr-8 py-6 rounded-[2rem] bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl border border-white dark:border-white/10 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-pink-500/10 focus:border-pink-500 transition-all shadow-lg"
          placeholder="Search cards by title..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredCards.map((card) => (
          <div key={card._id} className="group relative bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl rounded-[2.5rem] shadow-lg border border-white dark:border-white/10 overflow-hidden transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
            <div className="relative h-64 w-full overflow-hidden">
              <Image 
                src={card.photo} 
                alt={card.title} 
                fill 
                className="object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6">
                <h3 className="text-xl font-black text-white tracking-tight uppercase">{card.title}</h3>
                <div className="flex items-center gap-2 mt-2">
                   <MdInfo className="text-pink-400" size={14} />
                   <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">{card.characterLimit} Characters Max</span>
                </div>
              </div>
            </div>
            
            <div className="p-6 flex justify-between items-center">
              <span className={`px-3 py-1 text-[9px] font-black uppercase tracking-widest rounded-full ${card.isActive ? 'bg-green-500/10 text-green-600' : 'bg-red-500/10 text-red-600'}`}>
                {card.isActive ? 'Active' : 'Inactive'}
              </span>
              <div className="flex gap-2">
                <Link href={`/admin/brief-cards/form?id=${card._id}`}>
                  <button className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-pink-500 hover:bg-white dark:hover:bg-white transition-all shadow-sm">
                    <MdEdit size={18} />
                  </button>
                </Link>
                <button 
                  onClick={() => handleDelete(card._id)}
                  className="p-3 rounded-xl bg-gray-50 dark:bg-white/5 text-gray-400 hover:text-red-500 hover:bg-white dark:hover:bg-white transition-all shadow-sm"
                >
                  <MdDelete size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredCards.length === 0 && (
          <div className="col-span-full py-20 text-center">
             <div className="text-gray-400 font-bold italic">No cards found. Build your album!</div>
          </div>
        )}
      </div>
    </div>
  );
}

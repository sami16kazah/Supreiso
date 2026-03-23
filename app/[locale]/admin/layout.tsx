import { ReactNode } from "react";
import Link from "next/link";
import { MdDashboard, MdInventory, MdLoyalty, MdReceipt } from "react-icons/md";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any)?.role !== "admin") {
    redirect("/"); 
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: <MdDashboard size={20} /> },
    { label: "Products", href: "/admin/products", icon: <MdInventory size={20} /> },
    { label: "Coupons", href: "/admin/coupons", icon: <MdLoyalty size={20} /> },
    { label: "Orders", href: "/admin/orders", icon: <MdReceipt size={20} /> }
  ];

  return (
    <div className="flex min-h-screen bg-[#f8f9fa] dark:bg-[#0a0a0a] overflow-hidden relative">
      {/* Background Orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-pink-500/5 rounded-full blur-[100px] -z-0"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/5 rounded-full blur-[100px] -z-0"></div>

      <aside className="w-72 bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl border-r border-white dark:border-white/10 shadow-2xl z-20 flex flex-col">
        <div className="p-8 border-b border-gray-100 dark:border-white/5">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <span className="font-black text-xl">S</span>
             </div>
             <div>
                <div className="font-black text-gray-900 dark:text-white tracking-tight">Surpriso</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-pink-500">Admin Panel</div>
             </div>
          </div>
        </div>

        <nav className="p-6 space-y-3 flex-1">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href} 
              className="flex items-center gap-4 px-6 py-4 rounded-2xl text-gray-400 dark:text-gray-500 font-bold text-sm tracking-tight transition-all duration-300 hover:bg-white dark:hover:bg-white/5 hover:text-pink-500 dark:hover:text-pink-400 hover:shadow-xl group"
            >
              <span className="transition-transform duration-300 group-hover:scale-110">{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-8 border-t border-gray-100 dark:border-white/5">
           <Link href="/" className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-pink-500 transition-colors">
              ← Return to Store
           </Link>
        </div>
      </aside>

      <main className="flex-1 p-10 md:p-14 overflow-auto relative z-10 max-h-screen custom-scrollbar">
        {children}
      </main>
    </div>
  );
}


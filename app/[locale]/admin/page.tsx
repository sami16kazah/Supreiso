import dbConnect from "@/lib/mongoose";
import Order from "@/models/Order";
import Product from "@/models/Product";
import Coupon from "@/models/Coupon";
import { MdAttachMoney, MdLocalMall, MdAssignment, MdLocalOffer } from "react-icons/md";
import Link from 'next/link';

export default async function AdminDashboard() {
  await dbConnect();

  const totalProducts = await Product.countDocuments();
  const totalCoupons = await Coupon.countDocuments();
  const totalOrders = await Order.countDocuments();
  
  const revenueAggregation = await Order.aggregate([
    { $match: { paymentStatus: { $ne: 'failed' } } },
    { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
  ]);
  const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(8)
    .populate('user', 'name email')
    .lean();

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toFixed(2)}`, icon: <MdAttachMoney size={28} />, color: "from-green-500 to-emerald-600" },
    { label: "Total Orders", value: totalOrders, icon: <MdAssignment size={28} />, color: "from-blue-500 to-cyan-600" },
    { label: "Catalog Size", value: totalProducts, icon: <MdLocalMall size={28} />, color: "from-purple-500 to-indigo-600" },
    { label: "Active Offers", value: totalCoupons, icon: <MdLocalOffer size={28} />, color: "from-pink-500 to-rose-600" }
  ];

  return (
    <div className="space-y-16">
      <header>
        <h1 className="text-4xl font-black text-gray-900 dark:text-white tracking-tight">
          Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Analytics</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm font-medium mt-2 uppercase tracking-widest">Real-time performance metrics</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {stats.map((stat, idx) => (
          <div key={idx} className="group relative bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl p-8 rounded-[2.5rem] shadow-lg border border-white dark:border-white/10 transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
            <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.color} text-white shadow-xl mb-6 w-fit transform transition-transform group-hover:scale-110`}>
                {stat.icon}
            </div>
            <div className="text-[10px] font-black text-gray-400 dark:text-gray-500 uppercase tracking-[0.2em] mb-1">{stat.label}</div>
            <div className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">{stat.value}</div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight">Recent Transactions</h2>
          <Link href="/admin/orders" className="text-[10px] font-black uppercase tracking-widest text-pink-500 hover:text-pink-600 hover:underline">View All Orders →</Link>
        </div>
        
        <div className="bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl rounded-[3rem] shadow-2xl border border-white dark:border-white/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-black/20 text-left border-b border-gray-100 dark:border-white/5">
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Reference</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Customer</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-10 py-16 text-center text-gray-400 font-bold italic">
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order: any) => (
                    <tr key={order._id.toString()} className="group hover:bg-gray-50 dark:hover:bg-white/5 transition-all">
                      <td className="px-10 py-6 font-black text-sm text-pink-500">
                        <Link href={`/admin/orders/${order._id}`} className="hover:underline tracking-tighter">
                          #{order._id.toString().slice(-8).toUpperCase()}
                        </Link>
                      </td>
                      <td className="px-8 py-6">
                        <div className="font-extrabold text-sm text-gray-900 dark:text-white">{order.user?.name || 'Guest User'}</div>
                        <div className="text-[10px] text-gray-400 font-bold tracking-tight">{order.user?.email || 'N/A'}</div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-black text-gray-900 dark:text-white">${order.totalAmount.toFixed(2)}</span>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`px-4 py-1.5 inline-flex text-[9px] font-black uppercase tracking-widest rounded-full ${order.paymentStatus === 'paid' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="px-10 py-6 text-[10px] font-black text-gray-400 uppercase">
                        {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}


import dbConnect from "@/lib/mongoose";
import Product from "@/models/Product";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function ProductsCatalog() {
  await dbConnect();
  const rawProducts = await Product.find({}).sort({ createdAt: -1 }).lean();
  
  const products = rawProducts.map((p: any) => ({
    ...p,
    _id: p._id.toString(),
  }));

  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] py-20 px-4 md:px-12 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-[30%] h-[30%] bg-pink-400/20 dark:bg-pink-900/10 rounded-full blur-[100px] -z-10"></div>
      <div className="absolute bottom-0 right-0 w-[40%] h-[40%] bg-purple-400/20 dark:bg-purple-900/10 rounded-full blur-[100px] -z-10"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16 text-center">
          <div className="inline-block mb-4 px-6 py-1.5 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-sm">
            <span className="text-pink-500 font-bold uppercase tracking-widest text-xs">Exquisite Gallery</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 dark:text-white mb-6 tracking-tight">
            Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">Collection</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg font-medium">
            Explore our curated selection of premium artisan products and elegant gift boxes designed for unforgettable moments.
          </p>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
          {products.map((product) => (
            <div key={product._id} className="group relative bg-white/70 dark:bg-gray-800/40 backdrop-blur-2xl rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)] border border-white/60 dark:border-white/10 overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl">
              <div className="relative h-64 overflow-hidden">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 text-gray-400 font-bold">No Image</div>
                )}
                <div className="absolute top-4 left-4">
                  <span className="px-4 py-1 rounded-full bg-white/90 dark:bg-black/60 backdrop-blur-md text-[10px] font-black uppercase tracking-widest text-pink-600 dark:text-pink-400 shadow-sm border border-white/20">
                    {product.type}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col h-[calc(100%-16rem)]">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight group-hover:text-pink-500 transition-colors line-clamp-1">{product.name}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">{product.description}</p>
                </div>

                <div className="mt-auto space-y-6">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                    {product.discount > 0 && (
                      <span className="text-xs font-bold text-green-500">-{product.discount}% OFF</span>
                    )}
                  </div>
                  
                  <Link href="/build-a-box" className="block w-full">
                    <button className="w-full group/btn relative overflow-hidden rounded-2xl bg-gray-900 dark:bg-white px-6 py-4 text-white dark:text-gray-900 font-bold text-sm transition-all duration-300 hover:bg-pink-600 dark:hover:bg-pink-500 dark:hover:text-white shadow-xl hover:shadow-pink-500/20">
                      <span className="relative z-10 flex items-center justify-center gap-2">
                        Build into a Box
                        <svg className="w-4 h-4 transform transition-transform group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="arrow-right" /></svg>
                      </span>
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
          
          {products.length === 0 && (
            <div className="col-span-full text-center py-32 bg-white/40 dark:bg-gray-800/40 backdrop-blur-xl rounded-[3rem] border border-white/60 dark:border-white/10">
              <div className="text-6xl mb-6 opacity-30">✨</div>
              <h2 className="text-2xl font-bold text-gray-400">Our catalog is currently resting.</h2>
              <p className="text-gray-500 mt-2">Check back soon for new treasures.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


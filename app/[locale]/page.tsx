import Link from 'next/link';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations("Home");

  return (
    <div className="relative min-h-screen bg-[#fafafa] dark:bg-[#0a0a0a] overflow-hidden font-sans">
      {/* Decorative Premium Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-pink-300 dark:bg-pink-900/40 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[120px] opacity-70 animate-pulse"></div>
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-purple-300 dark:bg-purple-900/40 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[120px] opacity-70 animate-pulse" style={{ animationDelay: '2s' }}></div>
      <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] bg-yellow-200 dark:bg-yellow-900/20 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-[120px] opacity-70 animate-pulse" style={{ animationDelay: '4s' }}></div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-24 mx-auto max-w-5xl">
        <div className="inline-block mb-8 px-8 py-2.5 rounded-full bg-white/60 dark:bg-white/5 backdrop-blur-xl border border-white/80 dark:border-white/10 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500 font-extrabold tracking-widest uppercase text-sm drop-shadow-sm">
            The Ultimate Gifting Experience
          </span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 text-gray-900 dark:text-white leading-[1.1] drop-shadow-sm">
          {t('title')} <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 drop-shadow-md">
            Perfectly Packaged.
          </span>
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mb-12 font-medium leading-relaxed">
          {t('subtitle')} Elevate your gifting game with our premium hand-crafted boxes, curated flawlessly just for your loved ones.
        </p>
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
          <Link href="/build-a-box">
            <button className="w-full sm:w-auto relative group overflow-hidden rounded-full bg-gradient-to-r from-pink-500 to-purple-600 px-10 py-4 text-white font-bold text-lg shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
              <span className="relative z-10">{t('startBuilding')}</span>
              <div className="absolute inset-0 h-full w-full scale-0 rounded-full transition-all duration-300 ease-out group-hover:scale-100 group-hover:bg-white/20"></div>
            </button>
          </Link>
          <Link href="/products">
            <button className="w-full sm:w-auto rounded-full bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 px-10 py-4 text-gray-900 dark:text-white font-bold text-lg shadow-sm hover:shadow-lg hover:border-pink-500 dark:hover:border-pink-500 transition-all duration-300 hover:-translate-y-1">
              {t('browseCatalog')}
            </button>
          </Link>
        </div>
      </section>

      {/* Exquisite Features Box */}
      <section className="relative z-10 pb-32 px-4 md:px-12 max-w-7xl mx-auto">
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white drop-shadow-sm tracking-tight">{t('howItWorks')}</h2>
          <div className="w-24 h-1.5 bg-gradient-to-r from-pink-500 to-purple-500 mx-auto mt-8 rounded-full shadow-lg"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {[
             { step: "01", title: "Choose a Box", icon: "✨", desc: "Select from our premium, beautifully crafted gift packages spanning different artisan sizes." },
             { step: "02", title: "Fill It Up", icon: "💎", desc: "Browse our catalog of exquisite items. Pick exactly what fits into your chosen box flawlessly." },
             { step: "03", title: "Send the Love", icon: "🎀", desc: "Add a personal note. We handle the elegant packaging and guarantee a mesmerizing delivery." }
          ].map((item, idx) => (
             <div key={idx} className="group relative bg-white/70 dark:bg-gray-800/60 backdrop-blur-2xl p-10 rounded-[2.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)] border border-white/60 dark:border-gray-700/50 hover:bg-white/95 dark:hover:bg-gray-800/90 transition-all duration-500 hover:-translate-y-3 overflow-hidden cursor-default">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-gradient-to-br from-pink-500/10 to-purple-500/10 rounded-full blur-2xl group-hover:from-pink-500/40 group-hover:to-purple-500/40 transition-colors duration-700"></div>
               <div className="text-sm font-black text-gray-300 dark:text-gray-600 mb-6 tracking-widest">{item.step}</div>
               <div className="text-6xl mb-8 transform group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 drop-shadow-lg">{item.icon}</div>
               <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">{item.title}</h3>
               <p className="text-gray-600 dark:text-gray-400 font-medium leading-relaxed text-lg">{item.desc}</p>
             </div>
          ))}
        </div>
      </section>
    </div>
  );
}

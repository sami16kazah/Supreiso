"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import { MdShoppingCart, MdAccountCircle } from "react-icons/md";
import { Button, Select, MenuItem, FormControl } from "@mui/material";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, Link } from "@/i18n/routing";
import { useParams } from "next/navigation";

export default function Navbar() {
  const { data: session } = useSession();
  const t = useTranslations("Navbar");
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const currentLocale = params?.locale as string || "en";

  const changeLanguage = (newLocale: string) => {
    // Preserve current path, just swap the locale prefix seamlessly
    router.replace({ pathname } as any, { locale: newLocale });
  };

  return (
    <nav className="fixed top-0 w-full z-50 transition-all duration-300 backdrop-blur-md bg-white/70 dark:bg-black/70 border-b border-white/20 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-3xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600 hover:scale-105 transition-transform">
              Surpriso
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex flex-1 justify-center space-x-8">
            <Link href="/products" className="text-gray-700 dark:text-gray-200 hover:text-pink-500 dark:hover:text-pink-400 font-medium transition-colors text-lg tracking-wide">
              {t("shopAll")}
            </Link>
            <Link href="/build-a-box" className="text-pink-600 dark:text-pink-400 hover:text-pink-500 font-bold transition-colors text-lg tracking-wide border-b-2 border-transparent hover:border-pink-500">
              {t("buildBox")}
            </Link>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4  ">
            <FormControl size="small" variant="standard" sx={{ minWidth: 50 }}>
              <Select
                value={currentLocale}
                onChange={(e) => changeLanguage(e.target.value)}
                disableUnderline
                className="text-sm font-semibold text-gray-300 dark:text-gray-300 "
              >
                <MenuItem  value="en"> <p className="text-gray-900 dark:text-gray-300">EN</p></MenuItem>
                <MenuItem  value="de"> <p className="text-gray-900 dark:text-gray-300">DE</p></MenuItem>
              </Select>
            </FormControl>

            <Link href="/cart">
              <div className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                <MdShoppingCart className="text-2xl text-gray-700 dark:text-gray-300 group-hover:text-pink-500 transition-colors" />
              </div>
            </Link>
            
            {session ? (
              <div className="flex items-center space-x-2">
                <Link href="/profile">
                  <div className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                    <MdAccountCircle className="text-2xl text-gray-700 dark:text-gray-300 group-hover:text-pink-500 transition-colors" />
                  </div>
                </Link>
                {(session.user as any)?.role === 'admin' && (
                  <Link href="/admin">
                    <Button size="small" variant="outlined" className="border-purple-500 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-gray-800 rounded-full font-bold shadow-sm">
                      {t("admin")}
                    </Button>
                  </Link>
                )}
                <Button size="small" className="text-gray-500 hover:text-red-500 font-medium" onClick={() => signOut()}>
                  {t("signOut")}
                </Button>
              </div>
            ) : (
              <Button size="medium" variant="contained" className="bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all" onClick={() => signIn("google")}>
                {t("signIn")}
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { Providers } from "@/app/components/Providers";
import Navbar from "@/app/components/Navbar";
import { CartProvider } from "@/app/context/CartContext";
import { ModalProvider } from "@/app/context/ModalContext";
import { Geist, Geist_Mono } from "next/font/google";
import "@/app/globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Surpriso Store",
  description: "Gift packaging store",
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: any;
}) {
  // Await params safely for next 15 compatibility
  const resolvedParams = await params;
  const locale = resolvedParams?.locale || 'en';
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <ModalProvider>
              <CartProvider>
                <Navbar />
                <main className="flex-1 bg-gray-50 dark:bg-gray-900 pt-20">
                  {children}
                </main>
              </CartProvider>
            </ModalProvider>
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

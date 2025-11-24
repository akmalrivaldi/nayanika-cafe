import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner"; // <--- 1. Import Ini

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nayanika Cafe",
  description: "Taste the Warmth",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {children}

        {/* 2. Pasang Komponen Toaster di sini */}
        <Toaster
          position="top-center"
          richColors // <-- Membuat warna warni (Hijau=Sukses, Merah=Gagal)
          closeButton // <-- Menambah tombol X kecil
          style={{ zIndex: 99999 }} // <-- Memaksa muncul paling depan (di atas segalanya)
        />
      </body>
    </html>
  );
}

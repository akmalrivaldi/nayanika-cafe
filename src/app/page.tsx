import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, User, Coffee, LogOut } from "lucide-react";
import AddToCartButton from "@/components/ui/AddToCartButton";
import { cookies } from "next/headers";
import { logoutUser } from "@/actions/user-auth"; // Import action logout
import CartIndicator from "@/components/ui/CartIndicator";

async function getMenu() {
  return prisma.menu.findMany({
    where: { isAvailable: true },
    include: { category: true },
    orderBy: { category: { name: "asc" } },
  });
}

export default async function HomePage() {
  const menuItems = await getMenu();

  // Cek apakah User Login (di Next.js 15 cookies() harus await)
  const cookieStore = await cookies();
  const userName = cookieStore.get("user_name")?.value;
  const isLoggedIn = !!userName; // true jika ada user_name

  // Grouping Menu per Kategori
  const groupedMenu: Record<string, typeof menuItems> = {};
  menuItems.forEach((item) => {
    if (!groupedMenu[item.category.name]) groupedMenu[item.category.name] = [];
    groupedMenu[item.category.name].push(item);
  });

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans">
      {/* 1. NAVBAR - Sticky & Glassmorphism */}
      <nav className="bg-white/90 backdrop-blur-md sticky top-0 z-50 border-b border-stone-200 shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-stone-900 text-white p-2 rounded-lg">
              <Coffee size={20} strokeWidth={3} />
            </div>
            <h1 className="text-xl font-bold text-stone-800 tracking-tight">
              Nayanika Cafe
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <div className="hidden md:flex flex-col items-end mr-2">
                  <span className="text-xs text-stone-400 font-medium">
                    Hello,
                  </span>
                  <span className="text-sm font-bold text-stone-800 leading-none">
                    {userName}
                  </span>
                </div>
                <CartIndicator />
                <form action={logoutUser}>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-400 hover:text-red-600 hover:bg-red-50"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </Button>
                </form>
              </>
            ) : (
              <Link href="/login">
                <Button className="bg-stone-900 hover:bg-stone-800 rounded-full px-6 font-medium">
                  <User size={16} className="mr-2" /> Masuk / Daftar
                </Button>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">
        {/* 2. HERO SECTION - Banner Besar */}
        <section className="relative h-[450px] md:h-[550px] flex items-center justify-center text-center px-4">
          {/* Background Image */}
          <div className="absolute inset-0 bg-stone-900">
            <Image
              src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=2070&auto=format&fit=crop"
              alt="Coffee Ambience"
              fill
              className="object-cover opacity-50" // Gelapkan gambar agar teks terbaca
              priority
            />
          </div>

          {/* Text Content */}
          <div className="relative z-10 max-w-3xl text-white space-y-6">
            <h2 className="text-5xl md:text-7xl font-black tracking-tight drop-shadow-lg">
              Taste the <span className="text-orange-500">Warmth</span>
            </h2>
            <p className="text-lg md:text-xl text-stone-100 font-light max-w-xl mx-auto drop-shadow-md">
              Temukan ketenangan dalam setiap tegukan kopi artisan kami. Dibuat
              dengan hati untuk Anda nikmati.
            </p>
            {!isLoggedIn && (
              <div className="pt-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-orange-600 hover:bg-orange-700 text-white rounded-full px-10 py-6 text-lg shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1"
                  >
                    Gabung Member Sekarang
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* 3. MENU LIST - Grid Layout */}
        <div className="container mx-auto px-4 py-16 space-y-20">
          {Object.entries(groupedMenu).map(([category, items]) => (
            <section key={category}>
              {/* Judul Kategori Cantik */}
              <div className="flex items-end gap-4 mb-8 border-b border-stone-200 pb-4">
                <h3 className="text-4xl font-bold text-stone-800">
                  {category}
                </h3>
                <span className="text-stone-400 text-lg font-light pb-1">
                  {items.length} Menu
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {items.map((menu) => (
                  <Card
                    key={menu.id}
                    className="group overflow-hidden border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white rounded-2xl"
                  >
                    {/* Gambar Menu dengan Zoom Effect */}
                    <div className="relative h-56 bg-stone-100 overflow-hidden">
                      {menu.image ? (
                        <Image
                          src={menu.image}
                          alt={menu.name}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-stone-300">
                          <Coffee size={48} />
                        </div>
                      )}
                      {/* Badge Harga Mengambang */}
                      <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-bold text-stone-900 shadow-sm">
                        {new Intl.NumberFormat("id-ID", {
                          style: "currency",
                          currency: "IDR",
                          maximumFractionDigits: 0,
                        }).format(menu.price)}
                      </div>
                    </div>

                    <CardContent className="p-5 flex flex-col justify-between h-[180px]">
                      <div>
                        <h4 className="font-bold text-lg text-stone-800 mb-2 line-clamp-1 group-hover:text-orange-600 transition-colors">
                          {menu.name}
                        </h4>
                        <p className="text-sm text-stone-500 line-clamp-2 leading-relaxed">
                          {menu.description ||
                            "Perpaduan rasa yang pas untuk menemani harimu."}
                        </p>
                      </div>

                      {/* Tombol Add to Cart */}
                      <div className="pt-4 mt-auto">
                        <AddToCartButton menu={menu} isLoggedIn={isLoggedIn} />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>

      {/* 4. FOOTER */}
      <footer className="bg-stone-900 text-stone-400 py-16 mt-12">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex justify-center mb-6">
            <div className="bg-stone-800 p-3 rounded-full text-white">
              <Coffee size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Nayanika Cafe
          </h2>
          <p className="max-w-md mx-auto text-stone-500">
            Tempat dimana rasa dan ketenangan bertemu. Datang dan nikmati
            hangatnya suasana kami.
          </p>
          <div className="pt-8 border-t border-stone-800 text-sm">
            &copy; 2025 Nayanika Cafe. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}

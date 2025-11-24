"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Coffee,
  ListOrdered,
  LogOut,
  Tags,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils"; // Utilitas bawaan shadcn untuk gabung class
import { logoutAdmin } from "@/actions/auth";

export default function Sidebar() {
  const pathname = usePathname();

  // Daftar Menu Admin
  const menuItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      title: "Antrian Pesanan",
      href: "/admin/orders",
      icon: <ListOrdered size={20} />,
    },
    {
      title: "Daftar Menu",
      href: "/admin/menu",
      icon: <Coffee size={20} />,
    },
    {
      title: "Kategori Menu", // Menu Baru
      href: "/admin/menu/categories",
      icon: <Tags size={20} />,
    },
  ];

  return (
    <aside className="w-64 bg-white border-r border-stone-200 hidden md:block flex-shrink-0 relative">
      <div className="p-6">
        <h2 className="text-2xl font-bold text-stone-800">Admin Panel</h2>
        <p className="text-sm text-stone-500">Nayanika Cafe</p>
      </div>

      <nav className="px-4 space-y-2">
        {menuItems.map((item) => {
          // Cek apakah halaman ini sedang aktif
          const isActive = pathname === item.href;

          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 mb-1",
                  isActive
                    ? "bg-stone-900 text-stone-50 hover:bg-stone-800 hover:text-stone-50" // Style Aktif
                    : "text-stone-600 hover:bg-stone-100" // Style Tidak Aktif
                )}
              >
                {item.icon}
                {item.title}
              </Button>
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-6 px-4 w-64">
        <form
          action={async () => {
            await logoutAdmin();
            // Redirect manual via window karena ini Client Component di dalam Form
            window.location.href = "/login";
          }}
        >
          <Button
            variant="outline"
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200"
          >
            <LogOut size={20} /> Logout
          </Button>
        </form>
      </div>
    </aside>
  );
}

"use client";

import { useCartStore } from "@/lib/store";
import { ShoppingBag } from "lucide-react"; // Ikon bawaan
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function CartIcon() {
  // Trik agar tidak error Hydration (karena LocalStorage baru bisa dibaca di browser)
  const [mounted, setMounted] = useState(false);

  const totalItems = useCartStore((state) => state.totalItems());

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Tampilkan tombol kosong saat loading awal agar layout tidak goyang
    return (
      <Button variant="outline" size="icon">
        <ShoppingBag size={20} />
      </Button>
    );
  }

  return (
    <Link href="/cart">
      <Button variant="outline" size="icon" className="relative">
        <ShoppingBag size={20} className="text-stone-700" />
        {totalItems > 0 && (
          <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center rounded-full bg-orange-600 text-white text-xs p-0">
            {totalItems}
          </Badge>
        )}
      </Button>
    </Link>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useCartStore } from "@/lib/store"; // Pastikan path ke store benar
import { useEffect, useState } from "react";

export default function CartIndicator() {
  const items = useCartStore((state) => state.items);
  const [isMounted, setIsMounted] = useState(false);

  // Trik untuk mencegah "Hydration Error" karena data di server & client beda
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Tampilkan tombol kosong saat loading awal
    return (
      <Button
        variant="outline"
        size="icon"
        className="relative border-stone-300"
      >
        <ShoppingBag size={20} />
      </Button>
    );
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link href="/cart">
      <Button
        variant="outline"
        size="icon"
        className="relative border-stone-300 hover:bg-stone-100"
      >
        <ShoppingBag size={20} />
        {totalItems > 0 && (
          <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full shadow-sm">
            {totalItems}
          </span>
        )}
      </Button>
    </Link>
  );
}

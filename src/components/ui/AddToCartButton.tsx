"use client";

import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useCartStore } from "@/lib/store";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Terima prop isLoggedIn
export default function AddToCartButton({
  menu,
  isLoggedIn,
}: {
  menu: any;
  isLoggedIn: boolean;
}) {
  const addItem = useCartStore((state) => state.addItem);
  const router = useRouter();

  const handleAdd = () => {
    // PROTEKSI: Jika belum login, tolak & arahkan ke login
    if (!isLoggedIn) {
      toast.error("Silakan Login atau Daftar dulu untuk memesan.", {
        duration: 3000,
      });
      router.push("/login");
      return;
    }

    // Jika sudah login, lanjut
    addItem({
      id: menu.id,
      name: menu.name,
      price: menu.price,
      image: menu.image,
    });
    toast.success(`${menu.name} masuk keranjang!`);
  };

  return (
    <Button
      onClick={handleAdd}
      className="w-full bg-stone-900 hover:bg-orange-600 transition-colors"
    >
      <Plus size={16} className="mr-2" /> Tambah
    </Button>
  );
}

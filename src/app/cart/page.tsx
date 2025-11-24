"use client";

import { useCartStore } from "@/lib/store";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function CartPage() {
  const [mounted, setMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { items, addItem, removeItem, totalPrice, clearCart } = useCartStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items,
          totalAmount: totalPrice(),
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      clearCart();
      toast.success("Pesanan Berhasil!");
      router.push(`/receipt/${data.orderId}`);
    } catch (error) {
      toast.error("Gagal checkout. Pastikan database konek.");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-stone-50 text-stone-900 pb-20">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft size={24} />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Keranjang Pesanan</h1>
        </div>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-stone-500 mb-4">
              Keranjang kamu masih kosong nih.
            </p>
            <Link href="/">
              <Button>Mulai Pesan</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {/* List Item */}
            <div className="space-y-4">
              {items.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden border-none shadow-sm"
                >
                  <CardContent className="p-4 flex items-center gap-4">
                    <div className="relative w-20 h-20 bg-stone-200 rounded-md overflow-hidden flex-shrink-0">
                      {item.image && (
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-stone-800">{item.name}</h3>
                      <p className="text-orange-700 font-semibold">
                        Rp {(item.price || 0).toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 bg-stone-100 rounded-full px-2 py-1">
                      <button
                        onClick={() => removeItem(item.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:text-red-600"
                      >
                        {item.quantity === 1 ? (
                          <Trash2 size={16} />
                        ) : (
                          <Minus size={16} />
                        )}
                      </button>
                      <span className="font-bold w-4 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => addItem(item)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm hover:text-green-600"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Total & Checkout */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-stone-100 mt-8">
              <div className="flex justify-between items-center mb-6">
                <span className="text-stone-500 text-lg">Total Pembayaran</span>
                <span className="text-2xl font-bold text-stone-900">
                  Rp {totalPrice().toLocaleString("id-ID")}
                </span>
              </div>

              <Button
                onClick={handleCheckout}
                disabled={isLoading}
                className="w-full h-12 text-lg bg-stone-900 hover:bg-stone-800"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Memproses...
                  </>
                ) : (
                  "Checkout Sekarang"
                )}
              </Button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

// src/app/receipt/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { notFound } from "next/navigation";

// Perbaikan 1: Definisikan tipe params sebagai Promise (Standar Next.js 15)
interface ReceiptPageProps {
  params: Promise<{ id: string }>;
}

async function getOrder(id: string) {
  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { menu: true } } },
  });
  return order;
}

// Perbaikan 2: Gunakan tipe props yang baru
export default async function ReceiptPage({ params }: ReceiptPageProps) {
  // Perbaikan 3: WAJIB pakai 'await' sebelum mengambil id
  const { id } = await params;

  const order = await getOrder(id);

  if (!order) return notFound();

  return (
    <main className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg border border-stone-100 text-center">
        {/* Icon Sukses */}
        <div className="flex justify-center mb-4">
          <CheckCircle2 className="w-16 h-16 text-green-500" />
        </div>

        <h1 className="text-2xl font-bold text-stone-800 mb-2">
          Pembayaran Berhasil!
        </h1>
        <p className="text-stone-500 mb-8">
          Terima kasih sudah memesan di Nayanika.
        </p>

        {/* NOMOR ANTRIAN */}
        <div className="bg-stone-900 text-stone-50 p-6 rounded-xl mb-8">
          <p className="text-sm uppercase tracking-widest opacity-80 mb-1">
            Nomor Antrian Anda
          </p>
          <div className="text-6xl font-black tracking-tighter">
            {order.queueNumber}
          </div>
        </div>

        {/* Detail Transaksi */}
        <div className="text-left space-y-3 mb-8 border-t border-b border-stone-100 py-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              {/* Pastikan menggunakan item.quantity */}
              <span className="text-stone-600">
                {item.quantity}x {item.menu.name}
              </span>
              <span className="font-semibold">
                Rp {item.price.toLocaleString("id-ID")}
              </span>
            </div>
          ))}
          <div className="flex justify-between text-lg font-bold pt-2 mt-2 border-t border-stone-100">
            <span>Total</span>
            <span>Rp {order.totalAmount.toLocaleString("id-ID")}</span>
          </div>
        </div>

        <Link href="/">
          <Button variant="outline" className="w-full">
            Kembali ke Menu
          </Button>
        </Link>
      </div>
    </main>
  );
}

// src/app/api/checkout/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { items, totalAmount } = body;

    // 1. Cek User Admin (Dummy User)
    const user = await prisma.user.findFirst();

    if (!user) {
      console.error(
        "Error: User tidak ditemukan di database. Pastikan sudah seeding."
      );
      return NextResponse.json(
        { error: "User tidak ditemukan" },
        { status: 401 }
      );
    }

    // 2. MULAI TRANSAKSI
    const newOrder = await prisma.$transaction(async (tx) => {
      // A. Hitung Antrian Hari Ini
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const countToday = await tx.order.count({
        where: {
          createdAt: {
            gte: startOfDay,
            lte: endOfDay,
          },
          status: "PAID",
        },
      });

      const nextQueueNumber = countToday + 1;

      // B. Simpan Order
      const order = await tx.order.create({
        data: {
          userId: user.id,
          totalAmount: totalAmount,
          status: "PAID",
          queueNumber: nextQueueNumber,
          items: {
            create: items.map((item: any) => ({
              menuId: item.id,
              // PERBAIKAN UTAMA DISINI:
              // Nama kolom di database adalah 'quantity', bukan 'qty'
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });

      return order;
    });

    // 3. Sukses
    return NextResponse.json({
      success: true,
      orderId: newOrder.id,
      queueNumber: newOrder.queueNumber,
    });
  } catch (error) {
    // Log error lengkap ke Terminal VS Code
    console.error("Checkout Error Detail:", error);
    return NextResponse.json(
      { error: "Gagal memproses pesanan" },
      { status: 500 }
    );
  }
}

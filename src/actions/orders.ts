"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function markAsCompleted(orderId: string) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: "COMPLETED" },
    });

    // Refresh halaman admin agar data terbaru langsung muncul tanpa reload
    revalidatePath("/admin/orders");
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal update status" };
  }
}

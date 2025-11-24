// src/actions/menu.ts
"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. CREATE atau UPDATE Menu
export async function saveMenu(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const price = parseInt(formData.get("price") as string);
  const image = formData.get("image") as string;
  const categoryId = formData.get("categoryId") as string;
  const isAvailable = formData.get("isAvailable") === "on";

  if (!name || !price || !categoryId) {
    return { success: false, error: "Nama, Harga, dan Kategori harus diisi." };
  }

  try {
    const data = {
      name,
      description,
      price,
      image: image || null,
      categoryId,
      isAvailable,
    };

    if (id) {
      // Jika ID ada, lakukan UPDATE
      await prisma.menu.update({ where: { id }, data });
    } else {
      // Jika ID kosong, lakukan CREATE
      await prisma.menu.create({ data });
    }

    revalidatePath("/"); // Refresh halaman utama
    revalidatePath("/admin/menu");
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Gagal menyimpan menu. Cek apakah harga sudah berupa angka.",
    };
  }
}

// 2. DELETE Menu
export async function deleteMenu(id: string) {
  try {
    await prisma.menu.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin/menu");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal menghapus menu." };
  }
}

"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// 1. CREATE atau UPDATE Kategori
export async function saveCategory(formData: FormData) {
  const name = formData.get("name") as string;
  const id = formData.get("id") as string;

  if (!name) {
    return { success: false, error: "Nama kategori tidak boleh kosong" };
  }

  try {
    if (id) {
      // Jika ID ada, lakukan UPDATE
      await prisma.category.update({
        where: { id },
        data: { name },
      });
    } else {
      // Jika ID kosong, lakukan CREATE
      await prisma.category.create({
        data: { name },
      });
    }

    revalidatePath("/admin/menu/categories");
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: "Gagal menyimpan kategori. Mungkin nama sudah ada.",
    };
  }
}

// 2. DELETE Kategori
export async function deleteCategory(id: string) {
  try {
    // Cek apakah ada menu yang masih menggunakan kategori ini
    const menuCount = await prisma.menu.count({ where: { categoryId: id } });
    if (menuCount > 0) {
      return {
        success: false,
        error: "Tidak bisa dihapus! Masih ada menu di kategori ini.",
      };
    }

    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/menu/categories");
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, error: "Gagal menghapus kategori." };
  }
}

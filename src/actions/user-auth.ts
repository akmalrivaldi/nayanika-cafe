"use server";

import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// 1. REGISTER USER BARU
export async function registerUser(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { success: false, error: "Semua kolom wajib diisi" };
  }

  try {
    // Cek apakah email sudah ada
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return { success: false, error: "Email sudah terdaftar" };

    // Buat User Baru (Default role: USER)
    await prisma.user.create({
      data: { name, email, password },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal mendaftar, coba lagi." };
  }
}

// 2. LOGIN USER
export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    // Cek password manual (karena kita belum pakai hashing bcrypt demi kemudahan)
    if (!user || user.password !== password) {
      return { success: false, error: "Email atau Password salah" };
    }

    // Simpan session user di cookie
    const cookieStore = await cookies();
    cookieStore.set("user_session", user.id, { httpOnly: true, path: "/" });
    cookieStore.set("user_name", user.name || "User", {
      httpOnly: true,
      path: "/",
    });

    // (Opsional) Simpan role jika ingin membedakan menu admin nanti
    cookieStore.set("user_role", user.role, { httpOnly: true, path: "/" });

    return { success: true };
  } catch (error) {
    return { success: false, error: "Terjadi kesalahan sistem." };
  }
}

// 3. LOGOUT
export async function logoutUser() {
  const cookieStore = await cookies();
  // Hapus semua jejak user
  cookieStore.delete("user_session");
  cookieStore.delete("user_name");
  cookieStore.delete("user_role");

  // Arahkan kembali ke login
  redirect("/login");
}

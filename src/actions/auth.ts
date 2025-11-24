"use server";

import { cookies } from "next/headers";

export async function loginAdmin(formData: FormData) {
  const username = formData.get("username") as string;
  const password = formData.get("password") as string;

  // Ambil kredensial dari .env
  const validUsername = process.env.ADMIN_USERNAME;
  const validPassword = process.env.ADMIN_PASSWORD;

  if (username === validUsername && password === validPassword) {
    // FIX NEXT.JS 15: Tambahkan 'await' di sini
    const cookieStore = await cookies();

    cookieStore.set("admin_session", "true", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 24 jam
      path: "/",
    });

    return { success: true };
  } else {
    return { success: false, error: "Username atau Password salah!" };
  }
}

export async function logoutAdmin() {
  // FIX NEXT.JS 15: Tambahkan 'await' di sini juga
  const cookieStore = await cookies();
  cookieStore.delete("admin_session");
}

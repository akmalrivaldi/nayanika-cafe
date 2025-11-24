"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Coffee, Lock } from "lucide-react";
import { loginUser } from "@/actions/user-auth"; // <-- PENTING: Pakai action user
import { loginAdmin } from "@/actions/auth"; // <-- (Opsional) Jika ingin logic admin terpisah
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Link from "next/link";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (formData: FormData) => {
    setIsLoading(true);

    // 1. Coba Login sebagai User Database dulu
    const userResult = await loginUser(formData);

    if (userResult.success) {
      toast.success("Selamat Datang!");
      window.location.href = "/"; // Redirect ke Home User
      return;
    }

    // 2. (Fallback) Jika gagal user, coba cek apakah dia Login Admin (.env)
    // Ini fitur rahasia agar Anda tetap bisa login sebagai admin pakai akun di .env
    const adminResult = await loginAdmin(formData);

    if (adminResult.success) {
      toast.success("Login Admin Berhasil!");
      router.push("/admin/dashboard");
    } else {
      // Jika keduanya gagal
      toast.error("Email atau Password salah!");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-100 p-4">
      <Card className="w-full max-w-md shadow-lg border-stone-200">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-2">
            <div className="bg-stone-900 p-3 rounded-full">
              <Coffee className="text-white w-8 h-8" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-stone-800">
            Masuk Nayanika
          </CardTitle>
          <CardDescription>Silakan login untuk memesan</CardDescription>
        </CardHeader>
        <CardContent>
          <form action={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email / Username</Label>
              <Input
                id="email"
                name="email"
                placeholder="Email Anda"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="••••••••"
                  required
                  className="pl-10"
                />
                <Lock className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-stone-900 hover:bg-stone-800"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Masuk"}
            </Button>

            <div className="text-center text-sm text-stone-500 mt-4 border-t border-stone-100 pt-4">
              Belum jadi member?{" "}
              <Link
                href="/register"
                className="text-orange-600 font-bold hover:underline"
              >
                Daftar Sekarang
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

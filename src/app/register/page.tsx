"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { registerUser } from "@/actions/user-auth";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleRegister = async (formData: FormData) => {
    setIsLoading(true);
    const res = await registerUser(formData);

    if (res.success) {
      toast.success("Akun berhasil dibuat! Silakan login.");
      router.push("/login");
    } else {
      toast.error(res.error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-stone-50 p-4">
      <Card className="w-full max-w-md shadow-lg border-none">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-stone-800">
            Daftar Member
          </CardTitle>
          <p className="text-center text-stone-500 text-sm">
            Bergabung dengan Nayanika Cafe
          </p>
        </CardHeader>
        <CardContent>
          <form action={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Lengkap</Label>
              <Input name="name" required placeholder="Contoh: Budi Santoso" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                name="email"
                type="email"
                required
                placeholder="nama@email.com"
              />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                name="password"
                type="password"
                required
                placeholder="******"
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-stone-900 hover:bg-orange-600 transition-colors"
              disabled={isLoading}
            >
              {isLoading ? "Memproses..." : "Daftar Sekarang"}
            </Button>

            <div className="text-center text-sm text-stone-500 mt-4">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="text-orange-600 font-bold hover:underline"
              >
                Login disini
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

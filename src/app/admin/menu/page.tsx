// src/app/admin/menu/page.tsx
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import MenuForm from "@/components/admin/MenuForm";
import DeleteMenuButton from "@/components/admin/DeleteMenuButton"; // <--- Import Tombol Baru

// Fungsi ambil data (Server Side)
async function getCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

async function getMenu() {
  return prisma.menu.findMany({
    include: { category: true },
    orderBy: [{ isAvailable: "desc" }, { name: "asc" }],
  });
}

export default async function AdminMenuPage() {
  const categories = await getCategories();
  const menuItems = await getMenu();

  // HAPUS fungsi handleDelete yang lama di sini. Tidak perlu lagi.

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-stone-800">Manajemen Menu</h1>
        <div className="flex gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-orange-600 hover:bg-orange-700">
                <Plus size={18} className="mr-2" /> Tambah Menu
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Buat Menu Baru</DialogTitle>
                <DialogDescription>
                  Isi detail menu baru di bawah ini.
                </DialogDescription>
              </DialogHeader>
              <MenuForm categories={categories} initialData={null} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Semua Menu ({menuItems.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead className="text-xs text-stone-500 uppercase">
              <tr>
                <th className="py-3">Nama</th>
                <th className="py-3">Kategori</th>
                <th className="py-3">Harga</th>
                <th className="py-3">Status</th>
                <th className="py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {menuItems.map((menu) => (
                <tr
                  key={menu.id}
                  className="border-b last:border-b-0 hover:bg-stone-50"
                >
                  <td className="py-3 font-medium">{menu.name}</td>
                  <td className="py-3 text-sm text-stone-600">
                    {menu.category.name}
                  </td>
                  <td className="py-3">
                    Rp {menu.price.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3">
                    <Badge
                      className={`text-xs ${
                        menu.isAvailable
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {menu.isAvailable ? "Tersedia" : "Habis"}
                    </Badge>
                  </td>
                  <td className="py-3 text-right flex gap-2 justify-end">
                    {/* Tombol Edit */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-stone-600"
                        >
                          <Pencil size={16} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Edit Menu</DialogTitle>
                        </DialogHeader>
                        <MenuForm categories={categories} initialData={menu} />
                      </DialogContent>
                    </Dialog>

                    {/* Tombol Delete (GANTI BAGIAN INI) */}
                    <DeleteMenuButton menuId={menu.id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

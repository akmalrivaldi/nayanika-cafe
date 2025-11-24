// src/app/admin/menu/categories/page.tsx
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteCategory } from "@/actions/categories";
import DeleteCategoryButton from "@/components/admin/DeeleteCategoryButton"; // <--- Import ini
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import CategoryForm from "@/components/admin/CategoryForm"; // <--- Import Komponen Baru

// Komponen Utama (Server Component)
export default async function AdminCategoryPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  const handleDelete = async (id: string) => {
    "use server"; // Server Action yang dipanggil langsung
    const result = await deleteCategory(id);
    if (result.success) {
      // Revalidate sudah ada di action, jadi hanya kasih toast
      return toast.success("Kategori berhasil dihapus.");
    } else {
      return toast.error(result.error);
    }
  };

  return (
    // ... (sisa kode JSX sama, tapi sekarang memanggil <CategoryForm /> )
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-stone-800">
          Manajemen Kategori Menu
        </h1>

        {/* Tombol Tambah Baru */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Plus size={18} className="mr-2" /> Tambah Baru
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Buat Kategori Baru</DialogTitle>
              <DialogDescription>
                Masukkan nama kategori (misal: Espresso, Makanan Berat).
              </DialogDescription>
            </DialogHeader>
            <CategoryForm initialData={null} />{" "}
            {/* <--- Panggil Komponen Baru */}
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabel Daftar Kategori */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Kategori ({categories.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="w-full text-left">
            <thead className="text-xs text-stone-500 uppercase">
              <tr>
                <th className="py-3">Nama Kategori</th>
                <th className="py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-b last:border-b-0 hover:bg-stone-50"
                >
                  <td className="py-3 font-medium">{category.name}</td>
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
                          <DialogTitle>
                            Edit Kategori: {category.name}
                          </DialogTitle>
                        </DialogHeader>
                        <CategoryForm initialData={category} />{" "}
                        {/* <--- Panggil Komponen Baru */}
                      </DialogContent>
                    </Dialog>

                    {/* Tombol Delete */}
                    {/* ... Tombol Delete BARU ... */}
                    <DeleteCategoryButton categoryId={category.id} />
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

"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { saveMenu } from "@/actions/menu";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

// Tipe data untuk prop (didefinisikan ulang di sini)
interface MenuFormProps {
  initialData?: {
    id: string;
    name: string;
    price: number;
    description: string | null;
    image: string | null;
    categoryId: string;
    isAvailable: boolean;
  } | null;
  categories: { id: string; name: string }[];
}

export default function MenuForm({ initialData, categories }: MenuFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData?.id;
  const formRef = useRef<HTMLFormElement>(null);

  // State lokal untuk checkbox
  const [isAvailable, setIsAvailable] = useState(
    initialData?.isAvailable ?? true
  );

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    // Panggil Server Action
    const result = await saveMenu(formData);

    if (result.success) {
      toast.success(
        isEditing
          ? "Menu berhasil diperbarui."
          : "Menu baru berhasil ditambahkan."
      );
      formRef.current?.reset();
      document.getElementById("menu-dialog-close")?.click();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <Input type="hidden" name="id" defaultValue={initialData?.id} />

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1">
          <Label htmlFor="name">Nama Menu</Label>
          <Input
            id="name"
            name="name"
            required
            defaultValue={initialData?.name}
          />
        </div>
        <div className="space-y-1">
          <Label htmlFor="price">Harga (Rp)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            required
            defaultValue={initialData?.price}
          />
        </div>
      </div>

      <div className="space-y-1">
        <Label htmlFor="categoryId">Kategori</Label>
        <select
          id="categoryId"
          name="categoryId"
          required
          defaultValue={initialData?.categoryId}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option value="">-- Pilih Kategori --</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1">
        <Label htmlFor="description">Deskripsi</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Deskripsi singkat..."
          defaultValue={initialData?.description || ""}
        />
      </div>

      <div className="space-y-1">
        <Label htmlFor="image">URL Gambar</Label>
        <Input
          id="image"
          name="image"
          placeholder="https://url-gambar-anda.com/kopi.jpg"
          defaultValue={initialData?.image || ""}
        />
      </div>

      <div className="flex items-center space-x-2 pt-2">
        <Checkbox
          id="isAvailable"
          name="isAvailable"
          checked={isAvailable}
          onCheckedChange={(checked) => setIsAvailable(checked as boolean)}
        />
        <Label htmlFor="isAvailable">Tersedia Saat Ini</Label>
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button" id="menu-dialog-close">
            Batal
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={loading}
          className="bg-stone-800 hover:bg-stone-700"
        >
          {loading
            ? "Menyimpan..."
            : isEditing
            ? "Update Menu"
            : "Simpan Menu Baru"}
        </Button>
      </DialogFooter>
    </form>
  );
}

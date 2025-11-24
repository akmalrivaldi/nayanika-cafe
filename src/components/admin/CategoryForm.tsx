"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { saveCategory } from "@/actions/categories";
import { useRef, useState } from "react";
import { toast } from "sonner";

// Tipe data untuk prop
interface CategoryFormProps {
  initialData?: { id: string; name: string } | null;
}

export default function CategoryForm({ initialData }: CategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const isEditing = !!initialData?.id;
  const formRef = useRef<HTMLFormElement>(null);

  // State lokal untuk input
  const [name, setName] = useState(initialData?.name || "");

  const handleSubmit = async (formData: FormData) => {
    setLoading(true);

    // Panggil Server Action
    const result = await saveCategory(formData);

    if (result.success) {
      toast.success(
        isEditing
          ? "Kategori berhasil diperbarui."
          : "Kategori baru berhasil ditambahkan."
      );
      // Reset form dan tutup dialog setelah sukses
      formRef.current?.reset();
      document.getElementById("dialog-close-button")?.click();
    } else {
      toast.error(result.error);
    }
    setLoading(false);
  };

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <Input type="hidden" name="id" defaultValue={initialData?.id} />

      <div className="space-y-1">
        <Label htmlFor="name">Nama Kategori</Label>
        <Input
          id="name"
          name="name"
          placeholder="Contoh: Espresso, Makanan Berat"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline" type="button" id="dialog-close-button">
            Batal
          </Button>
        </DialogClose>
        <Button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-stone-800 hover:bg-stone-700"
        >
          {loading
            ? "Menyimpan..."
            : isEditing
            ? "Update Kategori"
            : "Simpan Baru"}
        </Button>
      </DialogFooter>
    </form>
  );
}

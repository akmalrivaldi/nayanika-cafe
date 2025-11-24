"use client";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { deleteCategory } from "@/actions/categories";
import { toast } from "sonner";
import { useState } from "react";

export default function DeleteCategoryButton({
  categoryId,
}: {
  categoryId: string;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    if (
      !confirm(
        "Yakin ingin menghapus kategori ini? Semua menu di dalamnya harus kosong."
      )
    ) {
      return;
    }

    setIsLoading(true);
    const result = await deleteCategory(categoryId);

    if (result.success) {
      toast.success("Kategori berhasil dihapus!");
    } else {
      toast.error(result.error);
    }
    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleDelete}
      disabled={isLoading}
      variant="outline"
      size="icon"
      className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
    >
      {isLoading ? (
        <span className="animate-spin text-sm">...</span>
      ) : (
        <Trash2 size={16} />
      )}
    </Button>
  );
}

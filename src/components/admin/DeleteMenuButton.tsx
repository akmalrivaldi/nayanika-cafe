"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteMenu } from "@/actions/menu";
import { toast } from "sonner";

export default function DeleteMenuButton({ menuId }: { menuId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleDelete = async () => {
    // Fitur Safety: Konfirmasi sebelum hapus
    if (!confirm("Apakah Anda yakin ingin menghapus menu ini?")) return;

    setIsLoading(true);

    // Panggil Server Action
    const result = await deleteMenu(menuId);

    if (result.success) {
      toast.success("Menu berhasil dihapus!");
    } else {
      toast.error(result.error);
    }

    setIsLoading(false);
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={handleDelete}
      disabled={isLoading}
      className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
    >
      {isLoading ? (
        <Loader2 size={16} className="animate-spin" />
      ) : (
        <Trash2 size={16} />
      )}
    </Button>
  );
}

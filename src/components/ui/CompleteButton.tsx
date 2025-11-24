"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";
import { markAsCompleted } from "@/actions/orders"; // Import Server Action kita
import { toast } from "sonner";

export default function CompleteButton({ orderId }: { orderId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleComplete = async () => {
    setIsLoading(true);

    // Panggil Server Action
    const result = await markAsCompleted(orderId);

    if (result.success) {
      toast.success("Pesanan Selesai!");
    } else {
      toast.error("Gagal update status");
    }

    setIsLoading(false);
  };

  return (
    <Button
      onClick={handleComplete}
      disabled={isLoading}
      className="w-full bg-stone-900 hover:bg-stone-800 transition-all"
      size="sm"
    >
      {isLoading ? (
        <Loader2 size={16} className="mr-2 animate-spin" />
      ) : (
        <Check size={16} className="mr-2" />
      )}
      {isLoading ? "Menyimpan..." : "Tandai Selesai"}
    </Button>
  );
}

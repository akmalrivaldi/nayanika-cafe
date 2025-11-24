// src/lib/store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Tipe data untuk barang di keranjang
export interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string | null;
  quantity: number;
}

// Tipe data untuk Store
interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      // Aksi: Tambah Barang
      addItem: (newItem) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) => item.id === newItem.id
          );

          if (existingItem) {
            // Jika barang sudah ada, tambah jumlahnya (quantity + 1)
            return {
              items: state.items.map((item) =>
                item.id === newItem.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              ),
            };
          } else {
            // Jika barang belum ada, masukkan sebagai barang baru
            return { items: [...state.items, { ...newItem, quantity: 1 }] };
          }
        });
      },

      // Aksi: Kurangi/Hapus Barang
      removeItem: (id) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === id);

          if (existingItem && existingItem.quantity > 1) {
            // Kalau jumlah > 1, kurangi 1
            return {
              items: state.items.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity - 1 } : item
              ),
            };
          } else {
            // Kalau sisa 1, hapus dari keranjang
            return {
              items: state.items.filter((item) => item.id !== id),
            };
          }
        });
      },

      // Aksi: Kosongkan Keranjang
      clearCart: () => set({ items: [] }),

      // Hitung Total Item (untuk badge notifikasi)
      totalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      // Hitung Total Harga
      totalPrice: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "nayanika-cart-storage", // Nama key di LocalStorage browser
    }
  )
);

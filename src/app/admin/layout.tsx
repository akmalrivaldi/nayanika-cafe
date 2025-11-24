import Sidebar from "@/components/admin/Sidebar"; // Import Sidebar Baru

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-stone-50">
      {/* Panggil Sidebar di sini */}
      <Sidebar />

      {/* Area Konten Utama */}
      <main className="flex-1 p-8 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto">{children}</div>
      </main>
    </div>
  );
}

import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingBag,
  CalendarRange,
  TrendingUp,
} from "lucide-react";

// Fungsi untuk mengambil rekap data keuangan
async function getDashboardStats() {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  // 1. Hitung Pendapatan Hari Ini
  const todaySales = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: {
      status: "COMPLETED", // Hanya hitung yang sudah selesai
      createdAt: { gte: startOfDay },
    },
  });

  // 2. Hitung Pendapatan Bulan Ini
  const monthSales = await prisma.order.aggregate({
    _sum: { totalAmount: true },
    where: {
      status: "COMPLETED",
      createdAt: { gte: startOfMonth },
    },
  });

  // 3. Total Order Hari Ini
  const todayOrdersCount = await prisma.order.count({
    where: {
      createdAt: { gte: startOfDay },
      status: { not: "PENDING" }, // Hitung PAID dan COMPLETED
    },
  });

  // 4. Ambil 5 Transaksi Terakhir
  const recentOrders = await prisma.order.findMany({
    take: 5,
    orderBy: { createdAt: "desc" },
    include: { user: true },
    where: { status: { not: "PENDING" } },
  });

  return {
    todayIncome: todaySales._sum.totalAmount || 0,
    monthIncome: monthSales._sum.totalAmount || 0,
    todayOrders: todayOrdersCount,
    recentOrders,
  };
}

export default async function AdminDashboard() {
  const stats = await getDashboardStats();

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-stone-800">Dashboard Laporan</h1>

      {/* --- KARTU STATISTIK --- */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Pendapatan Hari Ini */}
        <Card className="border-none shadow-md bg-stone-900 text-stone-50">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium opacity-80">
              Pendapatan Hari Ini
            </CardTitle>
            <DollarSign className="h-4 w-4 text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              Rp {stats.todayIncome.toLocaleString("id-ID")}
            </div>
            <p className="text-xs text-stone-400 mt-1">+ dari kemarin</p>
          </CardContent>
        </Card>

        {/* Card 2: Pendapatan Bulan Ini */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">
              Pendapatan Bulan Ini
            </CardTitle>
            <CalendarRange className="h-4 w-4 text-stone-900" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">
              Rp {stats.monthIncome.toLocaleString("id-ID")}
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Total Order Hari Ini */}
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-stone-500">
              Pesanan Hari Ini
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-stone-900" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-stone-800">
              {stats.todayOrders} Pesanan
            </div>
          </CardContent>
        </Card>
      </div>

      {/* --- TABEL TRANSAKSI TERAKHIR --- */}
      <section className="bg-white rounded-xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-stone-800 flex items-center gap-2">
            <TrendingUp size={20} /> Transaksi Terbaru
          </h2>
        </div>
        <div className="p-0">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-stone-500 uppercase bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="px-6 py-3">ID Order</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {stats.recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-6 text-center text-stone-400">
                    Belum ada data
                  </td>
                </tr>
              ) : (
                stats.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="bg-white border-b border-stone-50 hover:bg-stone-50"
                  >
                    <td className="px-6 py-4 font-medium text-stone-900">
                      #{order.queueNumber}{" "}
                      <span className="text-xs text-stone-400 font-normal ml-1">
                        ({order.id.slice(-4)})
                      </span>
                    </td>
                    <td className="px-6 py-4">{order.user?.name || "Guest"}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-semibold 
                        ${
                          order.status === "COMPLETED"
                            ? "bg-green-100 text-green-700"
                            : "bg-orange-100 text-orange-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-stone-800">
                      Rp {order.totalAmount.toLocaleString("id-ID")}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

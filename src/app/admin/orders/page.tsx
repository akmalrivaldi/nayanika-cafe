import { prisma } from "@/lib/prisma";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CompleteButton from "@/components/ui/CompleteButton"; // <--- Import Component Baru

async function getOrders() {
  const orders = await prisma.order.findMany({
    where: {
      status: { in: ["PAID", "COMPLETED"] },
    },
    include: {
      items: { include: { menu: true } },
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
  return orders;
}

export default async function AdminOrdersPage() {
  const orders = await getOrders();

  const activeOrders = orders.filter((o) => o.status === "PAID");
  const completedOrders = orders.filter((o) => o.status === "COMPLETED");

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-stone-800">Antrian Pesanan</h1>

      {/* --- BAGIAN 1: ANTRIAN MASUK --- */}
      <section>
        <div className="flex items-center gap-3 mb-4">
          <div className="h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
          <h2 className="text-xl font-bold text-stone-700">
            Perlu Disiapkan ({activeOrders.length})
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeOrders.length === 0 ? (
            <p className="text-stone-400 italic">Tidak ada antrian aktif.</p>
          ) : (
            activeOrders.map((order) => (
              <Card
                key={order.id}
                className="border-l-4 border-l-orange-500 shadow-sm"
              >
                <CardHeader className="pb-2 flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-2xl font-bold">
                      #{order.queueNumber}
                    </CardTitle>
                    <p className="text-xs text-stone-500">
                      {order.user.name || "Guest"}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className="bg-orange-50 text-orange-700 border-orange-200"
                  >
                    Menunggu
                  </Badge>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-4 text-sm">
                    {order.items.map((item) => (
                      <li
                        key={item.id}
                        className="flex justify-between border-b border-dashed border-stone-100 pb-1"
                      >
                        <span>
                          {item.quantity}x {item.menu.name}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* TOMBOL AKSI BARU (Client Component) */}
                  <CompleteButton orderId={order.id} />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </section>

      {/* --- BAGIAN 2: RIWAYAT SELESAI --- */}
      <section className="opacity-60 hover:opacity-100 transition-opacity">
        <h2 className="text-xl font-bold text-stone-700 mb-4 mt-8">
          Selesai / Diantar
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {completedOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg border border-stone-200 flex justify-between items-center"
            >
              <div>
                <span className="font-bold text-lg text-stone-600">
                  #{order.queueNumber}
                </span>
                <p className="text-xs text-stone-400">
                  {new Date(order.createdAt).toLocaleTimeString("id-ID")}
                </p>
              </div>
              <Badge
                variant="secondary"
                className="bg-stone-100 text-stone-500"
              >
                Selesai
              </Badge>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

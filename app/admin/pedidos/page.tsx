import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { formatCLP, type Order } from "@/lib/types"

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
}

export default async function AdminOrdersPage() {
  const supabase = await createClient()

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })

  const ordersList = (orders as Order[]) ?? []

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Pedidos</h1>
          <p className="mt-1 text-sm text-muted-foreground">{ordersList.length} pedido(s).</p>
        </div>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Pedido</th>
              <th className="px-4 py-3 font-medium">Cliente</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Fecha</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {ordersList.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  No hay pedidos todavía.
                </td>
              </tr>
            )}
            {ordersList.map((o) => (
              <tr key={o.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-mono text-xs text-foreground">{o.id.slice(0, 8)}…</td>
                <td className="px-4 py-3 text-foreground">
                  <div className="text-sm font-medium">{o.customer_name}</div>
                  <div className="text-xs text-muted-foreground">{o.customer_email}</div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">
                  {new Date(o.created_at).toLocaleDateString("es-CL")}
                </td>
                <td className="px-4 py-3 text-foreground">{formatCLP(o.total_clp)}</td>
                <td className="px-4 py-3">
                  <span className={`rounded-full px-2 py-0.5 text-xs ${statusColors[o.status] || "bg-gray-100 text-gray-800"}`}>
                    {statusLabels[o.status] || o.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <Link href={`/admin/pedidos/${o.id}`} className="text-xs text-primary hover:underline">
                    Ver detalle
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

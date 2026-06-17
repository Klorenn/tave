import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatCLP, type OrderWithItems, type OrderStatus } from "@/lib/types"
import { updateOrderStatus } from "@/lib/actions/orders"
import { Button } from "@/components/ui/button"

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

const nextStatuses: { status: OrderStatus; label: string }[] = [
  { status: "confirmed", label: "Confirmar pedido" },
  { status: "shipped", label: "Marcar como enviado" },
  { status: "delivered", label: "Marcar como entregado" },
  { status: "cancelled", label: "Cancelar pedido" },
]

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const supabase = await createClient()

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single()

  if (!order) notFound()

  const orderData = order as unknown as OrderWithItems

  async function handleStatusChange(formData: FormData) {
    "use server"
    const status = formData.get("status") as OrderStatus
    await updateOrderStatus(id, status)
    redirect(`/admin/pedidos/${id}`)
  }

  return (
    <div>
      <Link
        href="/admin/pedidos"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="size-4" />
        Volver a pedidos
      </Link>

      <h1 className="mt-4 font-serif text-2xl font-medium text-foreground">
        Pedido #{orderData.id.slice(0, 8)}
      </h1>

      <div className="mt-8 grid gap-8 md:grid-cols-3">
        <div className="space-y-6 md:col-span-2">
          <section className="rounded-lg border border-border p-5">
            <h2 className="font-serif text-base font-medium text-foreground">Productos</h2>
            <table className="mt-4 w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="pb-2 font-medium">Producto</th>
                  <th className="pb-2 font-medium">Precio</th>
                  <th className="pb-2 font-medium">Cant.</th>
                  <th className="pb-2 font-medium text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {orderData.order_items.map((item) => (
                  <tr key={item.id} className="border-b border-border last:border-0">
                    <td className="py-3 text-foreground">{item.product_name}</td>
                    <td className="py-3 text-muted-foreground">{formatCLP(item.price_clp)}</td>
                    <td className="py-3 text-muted-foreground">{item.quantity}</td>
                    <td className="py-3 text-right text-foreground">{formatCLP(item.price_clp * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="font-medium text-foreground">
                  <td colSpan={3} className="pt-4 text-right">Total</td>
                  <td className="pt-4 text-right">{formatCLP(orderData.total_clp)}</td>
                </tr>
              </tfoot>
            </table>
          </section>

          <section className="rounded-lg border border-border p-5">
            <h2 className="font-serif text-base font-medium text-foreground">Envío</h2>
            <div className="mt-3 space-y-1 text-sm text-foreground">
              <p>{orderData.customer_name}</p>
              <p className="text-muted-foreground">{orderData.customer_email}</p>
              {orderData.customer_phone && <p className="text-muted-foreground">{orderData.customer_phone}</p>}
              <p className="mt-2 text-muted-foreground">
                {orderData.shipping_address}, {orderData.shipping_city}, {orderData.shipping_region}
              </p>
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-lg border border-border p-5">
            <h2 className="font-serif text-base font-medium text-foreground">Estado</h2>
            <p className="mt-3">
              <span
                className={`rounded-full px-3 py-1 text-xs ${statusColors[orderData.status] || "bg-gray-100 text-gray-800"}`}
              >
                {statusLabels[orderData.status] || orderData.status}
              </span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              Creado el {new Date(orderData.created_at).toLocaleString("es-CL")}
            </p>

            <div className="mt-5 space-y-2">
              {nextStatuses
                .filter((ns) => ns.status !== orderData.status)
                .map((ns) => (
                  <form key={ns.status} action={handleStatusChange}>
                    <input type="hidden" name="status" value={ns.status} />
                    <Button
                      type="submit"
                      variant={ns.status === "cancelled" ? "ghost" : "outline"}
                      size="sm"
                      className={`w-full text-xs ${ns.status === "cancelled" ? "text-destructive hover:text-destructive" : ""}`}
                    >
                      {ns.label}
                    </Button>
                  </form>
                ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}

import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { formatCLP, type Order } from "@/lib/types"
import { LogOut } from "lucide-react"

const statusLabels: Record<string, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  shipped: "Enviado",
  delivered: "Entregado",
  cancelled: "Cancelado",
}

export default async function MyAccountPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("customer_email", user.email!)
    .order("created_at", { ascending: false })

  const ordersList = (orders as Order[]) ?? []

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] bg-card shadow-sm">
        <SiteHeader />
        <main className="px-5 py-8 md:px-8 md:py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-serif text-2xl font-medium text-foreground">Mi cuenta</h1>
              <p className="mt-1 text-sm text-muted-foreground">{user.email}</p>
            </div>
            <form action="/auth/logout" method="post">
              <button
                type="submit"
                className="flex items-center gap-1.5 text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-foreground"
              >
                <LogOut className="size-3.5" />
                Cerrar sesión
              </button>
            </form>
          </div>

          <section className="mt-10">
            <h2 className="font-serif text-lg font-medium text-foreground">Mis pedidos</h2>

            {ordersList.length === 0 ? (
              <p className="mt-4 text-sm text-muted-foreground">No tienes pedidos todavía.</p>
            ) : (
              <div className="mt-4 overflow-hidden rounded-lg border border-border">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                      <th className="px-4 py-3 font-medium">Pedido</th>
                      <th className="px-4 py-3 font-medium">Fecha</th>
                      <th className="px-4 py-3 font-medium">Total</th>
                      <th className="px-4 py-3 font-medium">Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ordersList.map((o) => (
                      <tr key={o.id} className="border-b border-border last:border-0">
                        <td className="px-4 py-3 font-mono text-xs text-foreground">#{o.id.slice(0, 8)}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(o.created_at).toLocaleDateString("es-CL")}
                        </td>
                        <td className="px-4 py-3 text-foreground">{formatCLP(o.total_clp)}</td>
                        <td className="px-4 py-3">
                          <span className="rounded-full bg-primary/15 px-2 py-0.5 text-xs text-primary">
                            {statusLabels[o.status] || o.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}

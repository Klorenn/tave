import Link from "next/link"
import Image from "next/image"
import { Plus } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { formatCLP, type ProductWithCategory } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { deleteProduct } from "../actions"

export default async function AdminDashboard() {
  const supabase = await createClient()
  const { data } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .order("created_at", { ascending: false })

  const products = (data as ProductWithCategory[]) ?? []

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Productos</h1>
          <p className="mt-1 text-sm text-muted-foreground">{products.length} producto(s) en el catálogo.</p>
        </div>
        <Button asChild>
          <Link href="/admin/nuevo" className="inline-flex items-center gap-2">
            <Plus className="size-4" />
            Nuevo producto
          </Link>
        </Button>
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Producto</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Categoría</th>
              <th className="px-4 py-3 font-medium">Precio</th>
              <th className="hidden px-4 py-3 font-medium sm:table-cell">Stock</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-muted-foreground">
                  Aún no hay productos. Crea el primero.
                </td>
              </tr>
            )}
            {products.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="relative size-11 shrink-0 overflow-hidden rounded bg-secondary">
                      <Image
                        src={p.image_url || "/placeholder.svg"}
                        alt={p.name}
                        fill
                        className="object-cover"
                        sizes="44px"
                      />
                    </div>
                    <span className="font-medium text-foreground">{p.name}</span>
                  </div>
                </td>
                <td className="hidden px-4 py-3 text-muted-foreground md:table-cell">{p.categories?.name ?? "—"}</td>
                <td className="px-4 py-3 text-foreground">{formatCLP(p.price_clp)}</td>
                <td className="hidden px-4 py-3 text-muted-foreground sm:table-cell">{p.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      p.is_active ? "bg-primary/15 text-primary" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {p.is_active ? "Activo" : "Oculto"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/admin/${p.id}`}>Editar</Link>
                    </Button>
                    <form action={deleteProduct}>
                      <input type="hidden" name="id" value={p.id} />
                      <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                        Eliminar
                      </Button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

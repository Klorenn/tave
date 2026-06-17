import { createClient } from "@/lib/supabase/server"
import { Plus } from "lucide-react"
import type { Category } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { deleteCategory } from "../../actions"
import { CategoryForm } from "./category-form"

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data } = await supabase.from("categories").select("*").order("sort_order", { ascending: true })
  const categories = (data as Category[]) ?? []

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-2xl font-medium text-foreground">Categorías</h1>
          <p className="mt-1 text-sm text-muted-foreground">{categories.length} categoría(s).</p>
        </div>
        <CategoryForm />
      </div>

      <div className="mt-8 overflow-hidden rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-border bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Nombre</th>
              <th className="hidden px-4 py-3 font-medium md:table-cell">Slug</th>
              <th className="px-4 py-3 font-medium">Orden</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  Aún no hay categorías. Crea la primera.
                </td>
              </tr>
            )}
            {categories.map((cat) => (
              <tr key={cat.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{cat.name}</td>
                <td className="hidden px-4 py-3 font-mono text-xs text-muted-foreground md:table-cell">{cat.slug}</td>
                <td className="px-4 py-3 text-muted-foreground">{cat.sort_order}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <CategoryForm category={cat} />
                    <form action={deleteCategory}>
                      <input type="hidden" name="id" value={cat.id} />
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

"use client"

import { useState } from "react"
import { useActionState } from "react"
import { Plus, Pencil } from "lucide-react"
import type { Category } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { createCategory, updateCategory, type ActionState } from "../../actions"

export function CategoryForm({ category }: { category?: Category }) {
  const [open, setOpen] = useState(false)
  const action = category ? updateCategory : createCategory
  const [state, formAction, pending] = useActionState<ActionState, FormData>(action, null)

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        size="sm"
        variant={category ? "outline" : "default"}
        className={category ? "" : "inline-flex items-center gap-2"}
      >
        {category ? <Pencil className="size-3.5" /> : <Plus className="size-4" />}
        {category ? "Editar" : "Nueva categoría"}
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
          <div
            className="w-full max-w-sm rounded-lg border border-border bg-card p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-serif text-lg font-medium text-foreground">
              {category ? "Editar categoría" : "Nueva categoría"}
            </h2>

            <form action={(fd) => { formAction(fd); setOpen(false) }} className="mt-4 space-y-4">
              {category && <input type="hidden" name="id" value={category.id} />}

              <div>
                <label htmlFor="name" className="block text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Nombre
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  defaultValue={category?.name || ""}
                  className="mt-1.5 h-9 w-full rounded border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <div>
                <label htmlFor="sort_order" className="block text-xs uppercase tracking-[0.1em] text-muted-foreground">
                  Orden
                </label>
                <input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  defaultValue={category?.sort_order || 0}
                  className="mt-1.5 h-9 w-full rounded border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              {state?.error && <p className="text-xs text-destructive">{state.error}</p>}
              {state?.success && <p className="text-xs text-green-600">{state.success}</p>}

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" size="sm" disabled={pending}>
                  {pending ? "Guardando…" : category ? "Actualizar" : "Crear"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

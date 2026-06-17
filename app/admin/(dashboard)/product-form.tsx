"use client"

import { useActionState } from "react"
import Link from "next/link"
import { useFormStatus } from "react-dom"
import { createProduct, updateProduct, type ActionState } from "../actions"
import { ImageUpload } from "./image-upload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import type { Category, ProductWithCategory } from "@/lib/types"

function SubmitButton({ isEdit }: { isEdit: boolean }) {
  const { pending } = useFormStatus()
  return (
    <Button type="submit" disabled={pending}>
      {pending ? "Guardando..." : isEdit ? "Guardar cambios" : "Crear producto"}
    </Button>
  )
}

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[]
  product?: ProductWithCategory
}) {
  const isEdit = Boolean(product)
  const action = isEdit ? updateProduct : createProduct
  const [state, formAction] = useActionState<ActionState, FormData>(action, null)

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {product && <input type="hidden" name="id" value={product.id} />}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nombre</Label>
          <Input id="name" name="name" defaultValue={product?.name ?? ""} required />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="category_id">Categoría</Label>
          <select
            id="category_id"
            name="category_id"
            defaultValue={product?.category_id ?? ""}
            className="h-9 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="">Sin categoría</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="price_clp">Precio (CLP)</Label>
          <Input
            id="price_clp"
            name="price_clp"
            type="number"
            min={0}
            step={10}
            defaultValue={product?.price_clp ?? 0}
            required
          />
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="stock">Stock</Label>
          <Input id="stock" name="stock" type="number" min={0} defaultValue={product?.stock ?? 0} />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea id="description" name="description" rows={4} defaultValue={product?.description ?? ""} />
      </div>

      <ImageUpload name="image_url" defaultValue={product?.image_url} />

      <div className="flex flex-wrap gap-8">
        <div className="flex items-center gap-3">
          <Switch id="is_active" name="is_active" defaultChecked={product ? product.is_active : true} />
          <Label htmlFor="is_active">Activo (visible en la tienda)</Label>
        </div>
        <div className="flex items-center gap-3">
          <Switch id="is_featured" name="is_featured" defaultChecked={product ? product.is_featured : true} />
          <Label htmlFor="is_featured">Destacado (portada)</Label>
        </div>
      </div>

      {state?.error && <p className="text-sm text-destructive">{state.error}</p>}

      <div className="flex items-center gap-3 border-t border-border pt-6">
        <SubmitButton isEdit={isEdit} />
        <Button asChild variant="outline">
          <Link href="/admin">Cancelar</Link>
        </Button>
      </div>
    </form>
  )
}

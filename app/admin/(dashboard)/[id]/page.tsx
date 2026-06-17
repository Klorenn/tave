import Link from "next/link"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { getCategories } from "@/lib/products"
import { ProductForm } from "../product-form"
import type { ProductWithCategory } from "@/lib/types"

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const [{ data }, categories] = await Promise.all([
    supabase.from("products").select("*, categories(name, slug)").eq("id", id).maybeSingle(),
    getCategories(),
  ])

  if (!data) notFound()
  const product = data as ProductWithCategory

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="size-4" />
        Volver
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-medium text-foreground">Editar producto</h1>
      <div className="mt-8 max-w-3xl">
        <ProductForm categories={categories} product={product} />
      </div>
    </div>
  )
}

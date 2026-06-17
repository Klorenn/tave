import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { getCategories } from "@/lib/products"
import { ProductForm } from "../product-form"

export default async function NewProductPage() {
  const categories = await getCategories()

  return (
    <div>
      <Link
        href="/admin"
        className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
      >
        <ChevronLeft className="size-4" />
        Volver
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-medium text-foreground">Nuevo producto</h1>
      <div className="mt-8 max-w-3xl">
        <ProductForm categories={categories} />
      </div>
    </div>
  )
}

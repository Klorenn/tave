import Link from "next/link"
import Image from "next/image"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { getAllProducts, getCategories } from "@/lib/products"
import { formatCLP } from "@/lib/types"

export const metadata = {
  title: "Tienda | tave",
  description: "Explora la colección completa de joyas tave.",
}

export default async function TiendaPage({
  searchParams,
}: {
  searchParams: Promise<{ categoria?: string; q?: string }>
}) {
  const { categoria, q } = await searchParams
  const [products, categories] = await Promise.all([getAllProducts(categoria, q), getCategories()])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-5 py-10 md:px-8 md:py-14">
          <h1 className="font-serif text-3xl font-medium text-foreground md:text-4xl">Tienda</h1>
          <p className="mt-2 text-sm text-muted-foreground">Nuestra colección de joyas hechas para destacar.</p>

          <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <form method="GET" action="/tienda" className="flex w-full max-w-xs gap-2">
              <input
                type="search"
                name="q"
                defaultValue={q || ""}
                placeholder="Buscar productos..."
                className="h-9 flex-1 rounded border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button
                type="submit"
                className="rounded bg-primary px-3 text-xs uppercase tracking-[0.1em] text-primary-foreground hover:opacity-90"
              >
                Buscar
              </button>
            </form>
            {q && (
              <Link
                href="/tienda"
                className="text-xs uppercase tracking-[0.12em] text-muted-foreground hover:text-primary"
              >
                Limpiar búsqueda
              </Link>
            )}
          </div>

          {/* Category filters */}
          <nav className="mt-6 flex flex-wrap gap-2">
            <Link
              href="/tienda"
              className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors ${
                !categoria
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground hover:border-primary"
              }`}
            >
              Todo
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/tienda?categoria=${cat.slug}`}
                className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-[0.12em] transition-colors ${
                  categoria === cat.slug
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border text-foreground hover:border-primary"
                }`}
              >
                {cat.name}
              </Link>
            ))}
          </nav>

          {products.length === 0 ? (
            <p className="mt-16 text-center text-sm text-muted-foreground">
              No hay productos en esta categoría por ahora.
            </p>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
              {products.map((product) => (
                <Link key={product.id} href={`/producto/${product.slug}`} className="group">
                  <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-secondary">
                    <Image
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 50vw, 25vw"
                    />
                    {product.stock === 0 && (
                      <span className="absolute left-2 top-2 rounded-full bg-foreground/80 px-2 py-1 text-[10px] uppercase tracking-wide text-background">
                        Agotado
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-sm tracking-wide text-foreground">{product.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{formatCLP(product.price_clp)}</p>
                </Link>
              ))}
            </div>
          )}
        </main>
        <SiteFooter />
    </div>
  )
}

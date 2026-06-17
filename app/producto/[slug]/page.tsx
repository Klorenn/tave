import Link from "next/link"
import Image from "next/image"
import { notFound } from "next/navigation"
import { ChevronLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { AddToCartButton } from "@/components/add-to-cart-button"
import { getProductBySlug } from "@/lib/products"
import { formatCLP } from "@/lib/types"

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)
  if (!product) return { title: "Producto | tave" }
  return {
    title: `${product.name} | tave`,
    description: product.description ?? "Joya tave",
  }
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product || !product.is_active) notFound()

  const gallery = product.images?.length ? product.images : [product.image_url || "/placeholder.svg"]

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main className="mx-auto max-w-[1200px] px-5 py-8 md:px-8 md:py-12">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="size-4" />
            Volver a la tienda
          </Link>

          <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Gallery */}
            <div className="flex flex-col gap-4">
              <div className="relative flex aspect-square items-center justify-center overflow-hidden bg-secondary">
                <Image
                  src={gallery[0] || "/placeholder.svg"}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                />
              </div>
              {gallery.length > 1 && (
                <div className="grid grid-cols-4 gap-3">
                  {gallery.slice(0, 4).map((img, i) => (
                    <div key={i} className="relative aspect-square overflow-hidden bg-secondary">
                      <Image
                        src={img || "/placeholder.svg"}
                        alt={`${product.name} ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="120px"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              {product.categories?.name && (
                <p className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
                  {product.categories.name}
                </p>
              )}
              <h1 className="mt-2 font-serif text-3xl font-medium text-foreground md:text-4xl">{product.name}</h1>

              <div className="mt-4 flex items-center gap-3">
                <span className="text-2xl text-foreground">{formatCLP(product.price_clp)}</span>
                {product.compare_at_clp && product.compare_at_clp > product.price_clp && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatCLP(product.compare_at_clp)}
                  </span>
                )}
              </div>

              {product.description && (
                <p className="mt-6 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              )}

              <div className="mt-6 text-xs uppercase tracking-[0.12em]">
                {product.stock > 0 ? (
                  <span className="text-primary">En stock · {product.stock} disponibles</span>
                ) : (
                  <span className="text-muted-foreground">Agotado</span>
                )}
              </div>

              <AddToCartButton
                productId={product.id}
                name={product.name}
                price_clp={product.price_clp}
                image_url={product.image_url}
                slug={product.slug}
                stock={product.stock}
              />

              <ul className="mt-8 space-y-2 border-t border-border pt-6 text-xs text-muted-foreground">
                <li>Envío a todo Chile.</li>
                <li>Garantía de 6 meses.</li>
                <li>Empaque de regalo incluido.</li>
              </ul>
            </div>
          </div>
        </main>
        <SiteFooter />
    </div>
  )
}

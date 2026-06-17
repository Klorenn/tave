import Image from "next/image"
import Link from "next/link"
import { formatCLP, type Product } from "@/lib/types"

export function NewArrivals({ products }: { products: Product[] }) {
  if (!products.length) return null

  return (
    <section id="new-arrivals" className="px-5 py-14 md:px-8 md:py-16">
      <div className="flex items-end justify-between">
        <h2 className="font-serif text-2xl font-medium text-foreground md:text-3xl">Nuevos ingresos</h2>
        <Link
          href="/tienda"
          className="text-xs tracking-wide text-muted-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          ver todos los productos
        </Link>
      </div>

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
            </div>
            <p className="mt-3 text-sm tracking-wide text-foreground">{product.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">{formatCLP(product.price_clp)}</p>
          </Link>
        ))}
      </div>

      <hr className="mt-12 border-border" />
    </section>
  )
}

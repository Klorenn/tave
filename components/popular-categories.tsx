import Image from "next/image"
import Link from "next/link"

const categories = [
  { name: "Aros", slug: "aros", image: "/cat-earrings.png" },
  { name: "Collares", slug: "collares", image: "/cat-necklaces.png" },
  { name: "Anillos", slug: "anillos", image: "/cat-rings.png" },
  { name: "Pulseras", slug: "pulseras", image: "/cat-bracelets.png" },
]

export function PopularCategories() {
  return (
    <section className="px-5 py-14 md:px-8 md:py-16">
      <h2 className="font-serif text-2xl font-medium text-foreground md:text-3xl">Categorías destacadas</h2>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
        {categories.map((cat) => (
          <Link key={cat.name} href={`/tienda?categoria=${cat.slug}`} className="group">
            <div className="relative aspect-square overflow-hidden bg-secondary">
              <Image
                src={cat.image || "/placeholder.svg"}
                alt={cat.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="(max-width: 768px) 50vw, 25vw"
              />
            </div>
            <p className="mt-3 text-base tracking-wide text-foreground">{cat.name}</p>
          </Link>
        ))}
      </div>
    </section>
  )
}

import Image from "next/image"

export function Hero() {
  return (
    <section className="relative grid grid-cols-1 md:grid-cols-2">
      <div className="relative aspect-square md:aspect-auto md:min-h-[560px]">
        <Image
          src="/hero-rings.png"
          alt="Anillos y cadenas de oro"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="relative aspect-square md:aspect-auto md:min-h-[560px]">
        <Image
          src="/hero-model.png"
          alt="Mujer usando collares de oro"
          fill
          priority
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-card">
        <h1 className="font-serif text-3xl font-medium uppercase tracking-wide text-balance drop-shadow-sm sm:text-4xl md:text-5xl">
          Nueva temporada
        </h1>
        <p className="mt-4 max-w-md text-base tracking-wide text-card/90 drop-shadow-sm">
          Inspirate con nuestras piezas destacadas
        </p>
        <div className="pointer-events-auto mt-6 flex flex-col gap-3 sm:flex-row">
          <a
            href="#new-arrivals"
            className="bg-card px-10 py-3 text-sm uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Nuevos ingresos
          </a>
          <a
            href="/tienda"
            className="bg-card px-10 py-3 text-sm uppercase tracking-[0.15em] text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            Más vendidos
          </a>
        </div>
      </div>
    </section>
  )
}

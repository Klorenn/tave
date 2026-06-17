import Image from "next/image"

export function GiftSection() {
  return (
    <section className="grid grid-cols-1 md:grid-cols-2">
      {/* Text panel */}
      <div className="flex flex-col justify-center bg-secondary px-6 py-14 md:px-12 md:py-20">
        <h2 className="font-serif text-2xl font-medium text-foreground md:text-3xl text-balance">
          Envía un regalo a alguien especial.
        </h2>
        <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
          Las cosas buenas vienen en envases pequeños.
        </p>
        <a
          href="#"
          className="mt-5 w-fit text-sm tracking-wide text-foreground underline underline-offset-4 transition-colors hover:text-primary"
        >
          Tú eliges, nosotros envolvemos
        </a>
      </div>

      {/* Image panel */}
      <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[340px]">
        <Image
          src="/gift-image.jpg"
          alt="Regalo tave"
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
        />
      </div>
    </section>
  )
}

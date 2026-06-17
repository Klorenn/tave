import Image from "next/image"

const photos = [
  { src: "/fotos/2-partes.jpg", alt: "Aros tave en dos estilos" },
  { src: "/fotos/2-partes-puesto.jpg", alt: "Aros tave puestos" },
  { src: "/fotos/collar-naranjo.jpg", alt: "Collar naranjo tave" },
  { src: "/fotos/luna-puesta.jpg", alt: "Collar luna tave puesto" },
]

export function GetInspired() {
  return (
    <section className="px-5 pb-12 md:px-8">
      <h2 className="font-serif text-2xl font-medium text-foreground md:text-3xl">
        Inspírate
      </h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Etiquétanos en Instagram para aparecer.
      </p>

      <div className="mt-8 grid grid-cols-2 gap-1 md:grid-cols-4">
        {photos.map((photo) => (
          <a key={photo.src} href="#" className="group relative aspect-[3/4] overflow-hidden">
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </a>
        ))}
      </div>
    </section>
  )
}

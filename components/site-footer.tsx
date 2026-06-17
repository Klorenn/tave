"use client"

import { useState } from "react"

const columns = [
  { title: "Productos", links: ["pulseras", "collares", "aros", "anillos"] },
  { title: "Info", links: ["nosotros", "contacto", "políticas", "preguntas frecuentes"] },
  { title: "Social", links: ["facebook", "instagram", "pinterest", "blog"] },
]

export function SiteFooter() {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setMessage("")

    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, name: name || undefined }),
    })

    const data = await res.json()

    if (res.ok) {
      setStatus("success")
      setMessage("¡Gracias por suscribirte!")
      setEmail("")
      setName("")
    } else {
      setStatus("error")
      setMessage(data.error || "Error al suscribir.")
    }
  }

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="grid grid-cols-1 gap-10 px-6 py-12 md:grid-cols-2 md:px-10 lg:grid-cols-4">
        {/* Link columns */}
        {columns.map((col) => (
          <div key={col.title} className="flex gap-4">
            <h3 className="font-serif text-base uppercase tracking-[0.2em] [writing-mode:vertical-rl] rotate-180">
              {col.title}
            </h3>
            <ul className="flex flex-col gap-2 text-base text-primary-foreground/80">
              {col.links.map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-primary-foreground">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}

        {/* Newsletter */}
        <div className="flex gap-4">
          <h3 className="font-serif text-base uppercase tracking-[0.2em] [writing-mode:vertical-rl] rotate-180">
            Noticias
          </h3>
          <div className="flex-1">
            <p className="text-base lowercase tracking-wide">únete a nuestra comunidad</p>
            <p className="mt-2 text-sm leading-relaxed text-primary-foreground/80">
              Recibe novedades y acceso anticipado a nuevas colecciones y promociones, además obtén un 10% de descuento en tu primer pedido.
            </p>
            <form onSubmit={handleSubscribe} className="mt-4 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-card/95 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
                <input
                  type="email"
                  placeholder="Correo"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-card/95 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={status === "loading"}
                className="bg-foreground px-6 py-3 text-sm uppercase tracking-[0.15em] text-card transition-opacity hover:opacity-90 disabled:opacity-50"
              >
                {status === "loading" ? "Enviando…" : "Suscribirme"}
              </button>
              {message && (
                <p className={`text-xs ${status === "success" ? "text-green-300" : "text-red-300"}`}>{message}</p>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex flex-col items-center justify-between gap-4 border-t border-primary-foreground/20 px-6 py-5 text-sm text-primary-foreground/80 md:flex-row md:px-10">
        <span>© tave 2026</span>
        <span className="tracking-wide">Chile (CLP $)</span>
      </div>
    </footer>
  )
}

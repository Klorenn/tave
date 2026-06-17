"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function ContactoPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" })
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")

    const res = await fetch("/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    })

    const data = await res.json()

    if (res.ok) {
      setStatus("success")
      setMessage("¡Mensaje enviado! Te responderemos pronto.")
      setForm({ name: "", email: "", message: "" })
    } else {
      setStatus("error")
      setMessage(data.error || "Error al enviar el mensaje.")
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] bg-card shadow-sm">
        <SiteHeader />
        <main className="mx-auto max-w-lg px-5 py-16">
          <h1 className="text-center font-serif text-3xl font-medium text-foreground md:text-4xl">Contacto</h1>
          <p className="mt-2 text-center text-sm text-muted-foreground">
            Escríbenos y te responderemos a la brevedad.
          </p>

          <form onSubmit={handleSubmit} className="mt-10 flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-xs text-muted-foreground">Nombre</label>
              <input
                id="name"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="h-10 rounded border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-xs text-muted-foreground">Correo electrónico</label>
              <input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className="h-10 rounded border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-xs text-muted-foreground">Mensaje</label>
              <textarea
                id="message"
                required
                rows={5}
                value={form.message}
                onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                className="rounded border border-input bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {message && (
              <p className={`text-sm ${status === "success" ? "text-green-600" : "text-destructive"}`}>{message}</p>
            )}

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full bg-primary py-3 text-xs uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {status === "loading" ? "Enviando…" : "Enviar mensaje"}
            </button>
          </form>
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}

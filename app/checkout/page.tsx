"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useRef } from "react"
import { ChevronLeft, CreditCard, Truck } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useCart } from "@/components/cart-context"
import { formatCLP } from "@/lib/types"

export default function CheckoutPage() {
  const { items, total } = useCart()
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)

    const form = formRef.current
    if (!form) return

    const formData = new FormData(form)
    const sessionId = localStorage.getItem("cart_sid") || ""

    formData.append("sessionId", sessionId)

    try {
      const res = await fetch("/api/orders", { method: "POST", body: formData })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setSubmitting(false)
        return
      }
      setSuccess(true)
    } catch {
      setError("Error al procesar el pedido. Intenta de nuevo.")
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex max-w-[1200px] flex-col items-center justify-center bg-card px-5 py-24 text-center shadow-sm">
          <div className="rounded-full bg-primary/15 p-6">
            <Truck className="size-10 text-primary" />
          </div>
          <h1 className="mt-6 font-serif text-2xl font-medium text-foreground">¡Pedido confirmado!</h1>
          <p className="mt-2 max-w-md text-sm text-muted-foreground">
            Gracias por tu compra. Te enviaremos un correo con los detalles del pedido y la información de seguimiento.
          </p>
          <Link
            href="/tienda"
            className="mt-8 rounded-none bg-primary px-8 py-3 text-xs uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90"
          >
            Seguir comprando
          </Link>
        </div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1200px] bg-card shadow-sm">
          <SiteHeader />
          <main className="flex flex-col items-center px-5 py-24 text-center">
            <p className="text-sm text-muted-foreground">Tu carrito está vacío.</p>
            <Link href="/tienda" className="mt-4 text-xs uppercase tracking-[0.12em] text-primary hover:underline">
              Ir a la tienda
            </Link>
          </main>
          <SiteFooter />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] bg-card shadow-sm">
        <SiteHeader />
        <main className="px-5 py-8 md:px-8 md:py-12">
          <Link
            href="/carrito"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="size-4" />
            Volver al carrito
          </Link>

          <h1 className="mt-6 font-serif text-2xl font-medium text-foreground md:text-3xl">Checkout</h1>

          <form ref={formRef} onSubmit={handleSubmit} className="mt-8 grid gap-12 md:grid-cols-3">
            <div className="space-y-8 md:col-span-2">
              <fieldset>
                <legend className="flex items-center gap-2 font-serif text-base font-medium text-foreground">
                  <Truck className="size-4 text-muted-foreground" />
                  Información de envío
                </legend>
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor="name" className="text-xs text-muted-foreground">
                      Nombre completo
                    </label>
                    <input
                      id="name"
                      name="customer_name"
                      required
                      className="h-10 rounded border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="email" className="text-xs text-muted-foreground">
                      Correo electrónico
                    </label>
                    <input
                      id="email"
                      name="customer_email"
                      type="email"
                      required
                      className="h-10 rounded border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-xs text-muted-foreground">
                      Teléfono
                    </label>
                    <input
                      id="phone"
                      name="customer_phone"
                      type="tel"
                      className="h-10 rounded border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5 md:col-span-2">
                    <label htmlFor="address" className="text-xs text-muted-foreground">
                      Dirección
                    </label>
                    <input
                      id="address"
                      name="shipping_address"
                      required
                      className="h-10 rounded border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="city" className="text-xs text-muted-foreground">
                      Ciudad
                    </label>
                    <input
                      id="city"
                      name="shipping_city"
                      required
                      className="h-10 rounded border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="region" className="text-xs text-muted-foreground">
                      Región
                    </label>
                    <input
                      id="region"
                      name="shipping_region"
                      required
                      className="h-10 rounded border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                    />
                  </div>
                </div>
              </fieldset>

              <fieldset>
                <legend className="flex items-center gap-2 font-serif text-base font-medium text-foreground">
                  <CreditCard className="size-4 text-muted-foreground" />
                  Medio de pago
                </legend>
                <p className="mt-4 text-sm text-muted-foreground">
                  Próximamente: Webpay Plus, MercadoPago y transferencia bancaria.
                </p>
              </fieldset>
            </div>

            <div className="md:col-span-1">
              <div className="rounded-lg border border-border bg-secondary/30 p-6">
                <h2 className="font-serif text-lg font-medium text-foreground">Resumen</h2>
                <ul className="mt-4 space-y-3">
                  {items.map((item) => (
                    <li key={item.product_id} className="flex gap-3">
                      <div className="relative size-12 shrink-0 overflow-hidden rounded bg-secondary">
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div className="flex-1 text-xs">
                        <p className="text-foreground">{item.name}</p>
                        <p className="text-muted-foreground">
                          {item.quantity} × {formatCLP(item.price_clp)}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground">{formatCLP(total)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Envío</span>
                    <span className="text-foreground">{total >= 50000 ? "Gratis" : "Por calcular"}</span>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2 font-medium text-foreground">
                    <span>Total</span>
                    <span>{formatCLP(total)}</span>
                  </div>
                </div>
                {error && <p className="mt-3 text-xs text-destructive">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="mt-6 flex w-full items-center justify-center bg-primary py-3 text-xs uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90 disabled:opacity-50"
                >
                  {submitting ? "Procesando..." : "Confirmar pedido"}
                </button>
              </div>
            </div>
          </form>
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}

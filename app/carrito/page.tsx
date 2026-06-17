"use client"

import Link from "next/link"
import Image from "next/image"
import { Minus, Plus, Trash2, ShoppingBag, ChevronLeft } from "lucide-react"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { useCart } from "@/components/cart-context"
import { formatCLP } from "@/lib/types"

export default function CartPage() {
  const { items, itemCount, total, updateQuantity, removeItem } = useCart()

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] bg-card shadow-sm">
        <SiteHeader />
        <main className="px-5 py-8 md:px-8 md:py-12">
          <Link
            href="/tienda"
            className="inline-flex items-center gap-1 text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
          >
            <ChevronLeft className="size-4" />
            Seguir comprando
          </Link>

          <h1 className="mt-6 font-serif text-2xl font-medium text-foreground md:text-3xl">
            Carrito
            {itemCount > 0 && (
              <span className="ml-2 text-sm font-normal text-muted-foreground">({itemCount} producto(s))</span>
            )}
          </h1>

          {items.length === 0 ? (
            <div className="mt-16 flex flex-col items-center gap-4 text-center">
              <ShoppingBag className="size-12 text-muted-foreground/30" />
              <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
              <Link
                href="/tienda"
                className="rounded-none bg-primary px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-primary-foreground"
              >
                Explorar productos
              </Link>
            </div>
          ) : (
            <div className="mt-8 grid gap-12 md:grid-cols-3">
              <div className="md:col-span-2">
                <ul className="flex flex-col gap-6">
                  {items.map((item) => (
                    <li key={item.product_id} className="flex gap-5 border-b border-border pb-6">
                      <div className="relative size-24 shrink-0 overflow-hidden bg-secondary md:size-28">
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="112px"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div>
                          <Link
                            href={`/producto/${item.slug}`}
                            className="text-sm font-medium text-foreground hover:text-primary"
                          >
                            {item.name}
                          </Link>
                          <p className="mt-1 text-sm text-muted-foreground">{formatCLP(item.price_clp)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 rounded border border-border px-3 py-1.5">
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                              className="text-muted-foreground hover:text-foreground"
                              aria-label="Reducir cantidad"
                            >
                              <Minus className="size-3.5" />
                            </button>
                            <span className="w-8 text-center text-sm text-foreground">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                              className="text-muted-foreground hover:text-foreground"
                              aria-label="Aumentar cantidad"
                              disabled={item.quantity >= item.stock}
                            >
                              <Plus className="size-3.5" />
                            </button>
                          </div>
                          <button
                            onClick={() => removeItem(item.product_id)}
                            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 className="size-3.5" />
                            Eliminar
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="md:col-span-1">
                <div className="rounded-lg border border-border bg-secondary/30 p-6">
                  <h2 className="font-serif text-lg font-medium text-foreground">Resumen</h2>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between text-foreground">
                      <span className="text-muted-foreground">Subtotal ({itemCount} producto(s))</span>
                      <span>{formatCLP(total)}</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span className="text-muted-foreground">Envío</span>
                      <span>{total >= 50000 ? "Gratis" : "Por calcular"}</span>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-border pt-4">
                    <div className="flex justify-between text-base font-medium text-foreground">
                      <span>Total</span>
                      <span>{formatCLP(total)}</span>
                    </div>
                  </div>
                  <Link
                    href="/checkout"
                    className="mt-6 flex w-full items-center justify-center bg-primary py-3 text-xs uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90"
                  >
                    Ir al checkout
                  </Link>
                </div>
              </div>
            </div>
          )}
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}

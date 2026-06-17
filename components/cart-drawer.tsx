"use client"

import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useCart } from "./cart-context"
import { formatCLP } from "@/lib/types"

export function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, itemCount, total, updateQuantity, removeItem } = useCart()

  return (
    <>
      {open && <div className="fixed inset-0 z-40 bg-black/30" onClick={onClose} />}
      <div
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-card shadow-xl transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h2 className="font-serif text-lg font-medium text-foreground">
            Carrito ({itemCount})
          </h2>
          <button onClick={onClose} aria-label="Cerrar carrito" className="text-muted-foreground hover:text-foreground">
            <X className="size-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-5 text-center">
            <ShoppingBag className="size-10 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">Tu carrito está vacío</p>
            <Link
              href="/tienda"
              onClick={onClose}
              className="rounded-none bg-primary px-6 py-2.5 text-xs uppercase tracking-[0.15em] text-primary-foreground"
            >
              Explorar productos
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="flex flex-col gap-4">
                {items.map((item) => (
                  <li key={item.product_id} className="flex gap-4 border-b border-border pb-4 last:border-0">
                    <div className="relative size-20 shrink-0 overflow-hidden bg-secondary">
                      <Image
                        src={item.image_url || "/placeholder.svg"}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    </div>
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <Link
                          href={`/producto/${item.slug}`}
                          onClick={onClose}
                          className="text-xs font-medium text-foreground hover:text-primary"
                        >
                          {item.name}
                        </Link>
                        <p className="mt-0.5 text-xs text-muted-foreground">{formatCLP(item.price_clp)}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 rounded border border-border px-2 py-1">
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity - 1)}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Reducir cantidad"
                          >
                            <Minus className="size-3" />
                          </button>
                          <span className="w-6 text-center text-xs text-foreground">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.product_id, item.quantity + 1)}
                            className="text-muted-foreground hover:text-foreground"
                            aria-label="Aumentar cantidad"
                            disabled={item.quantity >= item.stock}
                          >
                            <Plus className="size-3" />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(item.product_id)}
                          className="text-muted-foreground hover:text-destructive"
                          aria-label="Eliminar producto"
                        >
                          <Trash2 className="size-4" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="border-t border-border px-5 py-4">
              <div className="flex items-center justify-between text-sm text-foreground">
                <span>Total</span>
                <span className="font-medium">{formatCLP(total)}</span>
              </div>
              <Link
                href="/carrito"
                onClick={onClose}
                className="mt-3 flex w-full items-center justify-center bg-primary py-3 text-xs uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90"
              >
                Ver carrito
              </Link>
            </div>
          </>
        )}
      </div>
    </>
  )
}

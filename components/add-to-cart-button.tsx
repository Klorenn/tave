"use client"

import { useState } from "react"
import { useCart } from "./cart-context"

export function AddToCartButton({
  productId,
  name,
  price_clp,
  image_url,
  slug,
  stock,
}: {
  productId: string
  name: string
  price_clp: number
  image_url: string | null
  slug: string
  stock: number
}) {
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)

  function handleClick() {
    addItem({ id: "", product_id: productId, name, price_clp, image_url, slug, quantity: 1, stock })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  return (
    <button
      disabled={stock === 0}
      onClick={handleClick}
      className="mt-8 w-full rounded-none bg-primary py-4 text-xs uppercase tracking-[0.18em] text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40 md:w-auto md:px-16"
    >
      {stock === 0 ? "Sin stock" : added ? "✓ Agregado" : "Agregar al carrito"}
    </button>
  )
}

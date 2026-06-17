"use server"

import { createClient } from "@/lib/supabase/server"
import { cookies } from "next/headers"

export async function addToCart(productId: string, quantity: number = 1) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get("cart_sid")?.value

  if (!sessionId) return { error: "Sesión de carrito no encontrada" }

  const supabase = await createClient()

  let { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle()

  if (!cart) {
    const { data: newCart } = await supabase
      .from("carts")
      .insert({ session_id: sessionId })
      .select("id")
      .single()
    if (!newCart) return { error: "No se pudo crear el carrito" }
    cart = newCart
  }

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .maybeSingle()

  if (existing) {
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + quantity })
      .eq("id", existing.id)
    if (error) return { error: error.message }
  } else {
    const { error } = await supabase
      .from("cart_items")
      .insert({ cart_id: cart.id, product_id: productId, quantity })
    if (error) return { error: error.message }
  }

  return { success: true }
}

export async function removeFromCart(itemId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from("cart_items").delete().eq("id", itemId)
  if (error) return { error: error.message }
  return { success: true }
}

export async function updateCartItemQuantity(itemId: string, quantity: number) {
  if (quantity < 1) return removeFromCart(itemId)

  const supabase = await createClient()
  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
  if (error) return { error: error.message }
  return { success: true }
}

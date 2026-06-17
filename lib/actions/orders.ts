"use server"

import { revalidatePath } from "next/cache"
import { createClient } from "@/lib/supabase/server"
import type { OrderStatus } from "@/lib/types"

export async function createOrder(formData: FormData) {
  const supabase = await createClient()

  const sessionId = formData.get("sessionId") as string
  const customerName = formData.get("customer_name") as string
  const customerEmail = formData.get("customer_email") as string
  const customerPhone = formData.get("customer_phone") as string
  const shippingAddress = formData.get("shipping_address") as string
  const shippingCity = formData.get("shipping_city") as string
  const shippingRegion = formData.get("shipping_region") as string

  if (!sessionId || !customerName || !customerEmail || !shippingAddress || !shippingCity || !shippingRegion) {
    return { error: "Faltan campos obligatorios" }
  }

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle()

  if (!cart) return { error: "Carrito no encontrado" }

  const { data: items } = await supabase
    .from("cart_items")
    .select("product_id, quantity, products!inner(name, price_clp)")
    .eq("cart_id", cart.id)

  if (!items || items.length === 0) return { error: "El carrito está vacío" }

  const total = items.reduce((sum: number, i: any) => sum + i.products.price_clp * i.quantity, 0)

  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      session_id: sessionId,
      customer_name: customerName,
      customer_email: customerEmail,
      customer_phone: customerPhone || null,
      shipping_address: shippingAddress,
      shipping_city: shippingCity,
      shipping_region: shippingRegion,
      total_clp: total,
      status: "pending",
    })
    .select("id")
    .single()

  if (orderError || !order) return { error: "No se pudo crear la orden" }

  const { error: itemsError } = await supabase.from("order_items").insert(
    items.map((i: any) => ({
      order_id: order.id,
      product_id: i.product_id,
      product_name: i.products.name,
      price_clp: i.products.price_clp,
      quantity: i.quantity,
    })),
  )

  if (itemsError) return { error: "No se pudieron guardar los items" }

  await supabase.from("cart_items").delete().eq("cart_id", cart.id)
  await supabase.from("carts").delete().eq("id", cart.id)

  revalidatePath("/admin/pedidos")

  return { success: true, orderId: order.id }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user?.user_metadata?.is_admin) return { error: "No autorizado" }

  const { error } = await supabase
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId)

  if (error) return { error: error.message }

  revalidatePath("/admin/pedidos")
  revalidatePath(`/admin/pedidos/${orderId}`)
  return { success: true }
}

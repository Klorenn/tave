import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const sessionId = request.nextUrl.searchParams.get("sessionId")
  if (!sessionId) return NextResponse.json({ items: [] })

  const supabase = await createClient()

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .maybeSingle()

  if (!cart) return NextResponse.json({ items: [] })

  const { data: items } = await supabase
    .from("cart_items")
    .select("id, product_id, quantity, products!inner(name, price_clp, image_url, slug, stock)")
    .eq("cart_id", cart.id)

  const mapped = (items ?? []).map((i: any) => ({
    id: i.id,
    product_id: i.product_id,
    name: i.products.name,
    price_clp: i.products.price_clp,
    image_url: i.products.image_url,
    slug: i.products.slug,
    stock: i.products.stock,
    quantity: i.quantity,
  }))

  return NextResponse.json({ items: mapped })
}

export async function POST(request: NextRequest) {
  const { sessionId, productId, quantity } = await request.json()
  if (!sessionId || !productId) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

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
    if (!newCart) return NextResponse.json({ error: "Failed to create cart" }, { status: 500 })
    cart = newCart
  }

  const { data: existing } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cart.id)
    .eq("product_id", productId)
    .maybeSingle()

  if (existing) {
    await supabase
      .from("cart_items")
      .update({ quantity: existing.quantity + (quantity ?? 1) })
      .eq("id", existing.id)
  } else {
    await supabase
      .from("cart_items")
      .insert({ cart_id: cart.id, product_id: productId, quantity: quantity ?? 1 })
  }

  return NextResponse.json({ success: true })
}

export async function PATCH(request: NextRequest) {
  const { sessionId, productId, quantity } = await request.json()
  if (!sessionId || !productId) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  const supabase = await createClient()

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .single()

  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 })

  if (quantity < 1) {
    await supabase
      .from("cart_items")
      .delete()
      .eq("cart_id", cart.id)
      .eq("product_id", productId)
  } else {
    await supabase
      .from("cart_items")
      .update({ quantity })
      .eq("cart_id", cart.id)
      .eq("product_id", productId)
  }

  return NextResponse.json({ success: true })
}

export async function DELETE(request: NextRequest) {
  const { sessionId, productId } = await request.json()
  if (!sessionId || !productId) return NextResponse.json({ error: "Missing fields" }, { status: 400 })

  const supabase = await createClient()

  const { data: cart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .single()

  if (!cart) return NextResponse.json({ error: "Cart not found" }, { status: 404 })

  await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cart.id)
    .eq("product_id", productId)

  return NextResponse.json({ success: true })
}

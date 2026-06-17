export type Category = {
  id: string
  name: string
  slug: string
  sort_order: number
}

export type Product = {
  id: string
  name: string
  slug: string
  description: string | null
  price_clp: number
  compare_at_clp: number | null
  category_id: string | null
  image_url: string | null
  images: string[]
  stock: number
  is_active: boolean
  is_featured: boolean
  created_at: string
  updated_at: string
}

export type ProductWithCategory = Product & {
  categories: { name: string; slug: string } | null
}

export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"

export type Order = {
  id: string
  session_id: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  shipping_address: string
  shipping_city: string
  shipping_region: string
  total_clp: number
  status: OrderStatus
  created_at: string
  updated_at: string
}

export type OrderWithItems = Order & {
  order_items: {
    id: string
    product_id: string
    product_name: string
    price_clp: number
    quantity: number
  }[]
}

/** Format an integer amount of Chilean pesos, e.g. 29990 -> "$29.990" */
export function formatCLP(amount: number | null | undefined): string {
  if (amount == null) return ""
  return new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(amount)
}

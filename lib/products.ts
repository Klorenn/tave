import { createClient } from "@/lib/supabase/server"
import type { Category, Product, ProductWithCategory } from "@/lib/types"

export async function getFeaturedProducts(limit = 8): Promise<Product[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(limit)

  if (error) {
    console.log("[v0] getFeaturedProducts error:", error.message)
    return []
  }
  return (data as Product[]) ?? []
}

export async function getAllProducts(categorySlug?: string, search?: string): Promise<ProductWithCategory[]> {
  const supabase = await createClient()
  let query = supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })

  if (categorySlug) {
    const { data: cat } = await supabase
      .from("categories")
      .select("id")
      .eq("slug", categorySlug)
      .maybeSingle()
    if (cat?.id) query = query.eq("category_id", cat.id)
  }

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data, error } = await query
  if (error) {
    console.log("[v0] getAllProducts error:", error.message)
    return []
  }
  return (data as ProductWithCategory[]) ?? []
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("products")
    .select("*, categories(name, slug)")
    .eq("slug", slug)
    .maybeSingle()

  if (error) {
    console.log("[v0] getProductBySlug error:", error.message)
    return null
  }
  return (data as ProductWithCategory) ?? null
}

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true })

  if (error) {
    console.log("[v0] getCategories error:", error.message)
    return []
  }
  return (data as Category[]) ?? []
}

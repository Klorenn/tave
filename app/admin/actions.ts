"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"

function slugify(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user || !user.user_metadata?.is_admin) {
    throw new Error("No autorizado")
  }
  return supabase
}

export type ActionState = { error?: string; success?: string } | null

export async function createProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let supabase
  try {
    supabase = await requireAdmin()
  } catch {
    return { error: "No autorizado." }
  }

  const name = String(formData.get("name") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const price_clp = Number.parseInt(String(formData.get("price_clp") || "0"), 10)
  const stock = Number.parseInt(String(formData.get("stock") || "0"), 10)
  const category_id = String(formData.get("category_id") || "") || null
  const image_url = String(formData.get("image_url") || "").trim()
  const is_active = formData.get("is_active") === "on" || formData.get("is_active") === "true"
  const is_featured = formData.get("is_featured") === "on" || formData.get("is_featured") === "true"

  if (!name) return { error: "El nombre es obligatorio." }
  if (!image_url) return { error: "Debes subir una imagen del producto." }
  if (Number.isNaN(price_clp) || price_clp < 0) return { error: "Precio inválido." }

  const slug = `${slugify(name)}-${Math.random().toString(36).slice(2, 6)}`

  const { error } = await supabase.from("products").insert({
    name,
    slug,
    description: description || null,
    price_clp,
    stock: Number.isNaN(stock) ? 0 : stock,
    category_id,
    image_url,
    images: [image_url],
    is_active,
    is_featured,
  })

  if (error) return { error: error.message }

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/tienda")
  redirect("/admin")
}

export async function updateProduct(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let supabase
  try {
    supabase = await requireAdmin()
  } catch {
    return { error: "No autorizado." }
  }

  const id = String(formData.get("id") || "")
  if (!id) return { error: "Producto no encontrado." }

  const name = String(formData.get("name") || "").trim()
  const description = String(formData.get("description") || "").trim()
  const price_clp = Number.parseInt(String(formData.get("price_clp") || "0"), 10)
  const stock = Number.parseInt(String(formData.get("stock") || "0"), 10)
  const category_id = String(formData.get("category_id") || "") || null
  const image_url = String(formData.get("image_url") || "").trim()
  const is_active = formData.get("is_active") === "on" || formData.get("is_active") === "true"
  const is_featured = formData.get("is_featured") === "on" || formData.get("is_featured") === "true"

  if (!name) return { error: "El nombre es obligatorio." }
  if (Number.isNaN(price_clp) || price_clp < 0) return { error: "Precio inválido." }

  const { error } = await supabase
    .from("products")
    .update({
      name,
      description: description || null,
      price_clp,
      stock: Number.isNaN(stock) ? 0 : stock,
      category_id,
      image_url: image_url || null,
      images: image_url ? [image_url] : [],
      is_active,
      is_featured,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/tienda")
  redirect("/admin")
}

export async function deleteProduct(formData: FormData): Promise<void> {
  let supabase
  try {
    supabase = await requireAdmin()
  } catch {
    return
  }
  const id = String(formData.get("id") || "")
  if (!id) return

  await supabase.from("products").delete().eq("id", id)
  revalidatePath("/admin")
  revalidatePath("/")
  revalidatePath("/tienda")
}

// ── Category CRUD ──

export async function createCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let supabase
  try {
    supabase = await requireAdmin()
  } catch {
    return { error: "No autorizado." }
  }

  const name = String(formData.get("name") || "").trim()
  if (!name) return { error: "El nombre es obligatorio." }

  const slug = slugify(name)
  const sort_order = Number.parseInt(String(formData.get("sort_order") || "0"), 10)

  const { error } = await supabase.from("categories").insert({ name, slug, sort_order: Number.isNaN(sort_order) ? 0 : sort_order })
  if (error) return { error: error.message }

  revalidatePath("/admin/categorias")
}

export async function updateCategory(_prev: ActionState, formData: FormData): Promise<ActionState> {
  let supabase
  try {
    supabase = await requireAdmin()
  } catch {
    return { error: "No autorizado." }
  }

  const id = String(formData.get("id") || "")
  if (!id) return { error: "Categoría no encontrada." }

  const name = String(formData.get("name") || "").trim()
  if (!name) return { error: "El nombre es obligatorio." }

  const slug = slugify(name)
  const sort_order = Number.parseInt(String(formData.get("sort_order") || "0"), 10)

  const { error } = await supabase
    .from("categories")
    .update({ name, slug, sort_order: Number.isNaN(sort_order) ? 0 : sort_order })
    .eq("id", id)

  if (error) return { error: error.message }

  revalidatePath("/admin/categorias")
  revalidatePath("/")
  revalidatePath("/tienda")
}

export async function deleteCategory(formData: FormData): Promise<void> {
  let supabase
  try {
    supabase = await requireAdmin()
  } catch {
    return
  }
  const id = String(formData.get("id") || "")
  if (!id) return

  // Unlink products first
  await supabase.from("products").update({ category_id: null }).eq("category_id", id)
  await supabase.from("categories").delete().eq("id", id)
  revalidatePath("/admin/categorias")
  revalidatePath("/tienda")
}

export async function signOutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/admin/login")
}

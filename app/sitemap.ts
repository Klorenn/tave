import type { MetadataRoute } from "next"
import { createClient } from "@/lib/supabase/server"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient()

  const [{ data: products }, { data: categories }] = await Promise.all([
    supabase.from("products").select("slug, updated_at").eq("is_active", true),
    supabase.from("categories").select("slug"),
  ])

  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? "https://tave.cl"
    : "http://localhost:3000"

  const staticPages = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 1 },
    { url: `${baseUrl}/tienda`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.9 },
    { url: `${baseUrl}/contacto`, lastModified: new Date(), changeFrequency: "monthly" as const, priority: 0.5 },
  ]

  const productPages = (products || []).map((p: { slug: string; updated_at: string }) => ({
    url: `${baseUrl}/producto/${p.slug}`,
    lastModified: new Date(p.updated_at || Date.now()),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }))

  const categoryPages = (categories || []).map((c: { slug: string }) => ({
    url: `${baseUrl}/tienda?categoria=${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }))

  return [...staticPages, ...productPages, ...categoryPages]
}

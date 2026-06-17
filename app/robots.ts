import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    ? "https://tave.cl"
    : "http://localhost:3000"

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/api/", "/auth/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

import { SiteHeader } from "@/components/site-header"
import { Hero } from "@/components/hero"
import { PopularCategories } from "@/components/popular-categories"
import { GiftSection } from "@/components/gift-section"
import { NewArrivals } from "@/components/new-arrivals"
import { GetInspired } from "@/components/get-inspired"
import { SiteFooter } from "@/components/site-footer"
import { getFeaturedProducts } from "@/lib/products"

export default async function Page() {
  const products = await getFeaturedProducts(8)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <Hero />
        <PopularCategories />
        <GiftSection />
        <NewArrivals products={products} />
        <GetInspired />
      </main>
      <SiteFooter />
    </div>
  )
}

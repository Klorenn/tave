import { SetupClient } from "./setup-client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] bg-card shadow-sm">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-5 py-12">
          <SetupClient
            supabaseUrl={process.env.NEXT_PUBLIC_SUPABASE_URL!}
            anonKey={process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!}
          />
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}

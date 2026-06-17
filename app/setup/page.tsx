import dynamic from "next/dynamic"

const SetupClient = dynamic(() => import("./setup-client").then((m) => m.SetupClient), {
  ssr: false,
})

import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function SetupPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] bg-card shadow-sm">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-5 py-12">
          <SetupClient />
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}

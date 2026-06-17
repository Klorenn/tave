"use client"

import { SetupClient } from "./setup-client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import { Suspense, useEffect, useState } from "react"

export default function SetupPage() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] bg-card shadow-sm">
        <SiteHeader />
        <main className="mx-auto max-w-2xl px-5 py-12">
          <Suspense fallback={<div className="text-center text-sm text-muted-foreground">Cargando…</div>}>
            {mounted && <SetupClient />}
          </Suspense>
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function UpdatePasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      setError("Error al actualizar la contraseña.")
      setLoading(false)
      return
    }

    router.push("/mi-cuenta")
    router.refresh()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1200px] bg-card shadow-sm">
        <SiteHeader />
        <main className="mx-auto flex max-w-sm flex-col px-5 py-16">
          <h1 className="text-center font-serif text-2xl font-medium text-foreground">Nueva contraseña</h1>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-xs text-muted-foreground">Nueva contraseña</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="h-10 rounded border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full bg-primary py-3 text-xs uppercase tracking-[0.15em] text-primary-foreground hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Actualizando..." : "Actualizar contraseña"}
            </button>
          </form>
        </main>
        <SiteFooter />
      </div>
    </div>
  )
}

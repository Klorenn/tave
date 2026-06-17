"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const supabase = createClient()
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError("Correo o contraseña incorrectos.")
      setLoading(false)
      return
    }

    const isAdmin = data.user?.user_metadata?.is_admin
    if (!isAdmin) {
      await supabase.auth.signOut()
      setError("Esta cuenta no tiene permisos de administradora.")
      setLoading(false)
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-5">
      <div className="w-full max-w-sm">
        <Link href="/" className="block text-center font-serif text-4xl font-medium tracking-tight text-foreground">
          tave
        </Link>
        <p className="mt-2 text-center text-xs uppercase tracking-[0.15em] text-muted-foreground">
          Panel de administradora
        </p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4 rounded-lg border border-border bg-card p-6">
          <div className="flex flex-col gap-2">
            <Label htmlFor="email">Correo</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <Button type="submit" disabled={loading} className="mt-2">
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
      </div>
    </div>
  )
}

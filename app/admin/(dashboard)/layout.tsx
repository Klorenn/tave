import type React from "react"
import { redirect } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/server"
import { signOutAction } from "../actions"
import { Button } from "@/components/ui/button"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Login page renders its own UI; let it through.
  // (Next.js renders this layout for /admin/login too, so guard there.)
  const isAdmin = user?.user_metadata?.is_admin

  if (!isAdmin) {
    // If not on login already, send to login.
    redirect("/admin/login")
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-[1100px] items-center justify-between px-5 py-4">
          <div className="flex items-center gap-6">
            <Link href="/admin" className="font-serif text-2xl font-medium text-foreground">
              tave
            </Link>
            <nav className="hidden items-center gap-4 sm:flex">
              <Link
                href="/admin"
                className="text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
              >
                Productos
              </Link>
              <Link
                href="/admin/pedidos"
                className="text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
              >
                Pedidos
              </Link>
              <Link
                href="/admin/categorias"
                className="text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
              >
                Categorías
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
              <Link
                href="/setup"
                className="text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
              >
                Setup
              </Link>
              <Link
                href="/"
                className="text-xs uppercase tracking-[0.12em] text-muted-foreground transition-colors hover:text-primary"
              >
                Ver tienda
              </Link>
            <form action={signOutAction}>
              <Button type="submit" variant="outline" size="sm">
                Salir
              </Button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-5 py-8">{children}</main>
    </div>
  )
}

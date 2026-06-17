"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Heart, ShoppingBag, Menu, X, User } from "lucide-react"
import { useCart } from "./cart-context"
import { CartDrawer } from "./cart-drawer"
import { createClient } from "@/lib/supabase/client"

const navLinks = [
  { label: "Tienda", href: "/tienda" },
  { label: "Anillos", href: "/tienda?categoria=anillos" },
  { label: "Nosotros", href: "/#new-arrivals" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)
  const [cartOpen, setCartOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { itemCount } = useCart()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  return (
    <header>
      {/* Announcement bar */}
      <div className="bg-primary py-2.5 text-center text-xs font-medium uppercase tracking-[0.15em] text-primary-foreground">
        Envío gratis en compras sobre $50.000
      </div>

      {/* Nav */}
      <div className="flex items-center justify-between px-5 py-5 md:px-8">
        {/* Left nav */}
        <nav className="hidden items-center gap-7 text-sm uppercase tracking-[0.15em] text-foreground md:flex">
          {navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="transition-colors hover:text-primary">
              {link.label}
            </Link>
          ))}
        </nav>

        <button className="md:hidden" aria-label="Abrir menú" onClick={() => setOpen((v) => !v)}>
          {open ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

        {/* Logo */}
        <Link href="/" className="font-serif text-3xl font-medium tracking-tight text-foreground md:text-4xl">
          tave
        </Link>

        {/* Right actions */}
        <div className="flex items-center gap-5 text-sm uppercase tracking-[0.15em] text-foreground">
          <Link href="/admin" className="hidden transition-colors hover:text-primary sm:inline">
            Admin
          </Link>
          <Link
            href={user ? "/mi-cuenta" : "/auth/login"}
            className="hidden transition-colors hover:text-primary sm:inline-flex sm:items-center sm:gap-1.5"
          >
            <User className="size-3.5" />
            {user ? "Mi cuenta" : "Ingresar"}
          </Link>
          <button aria-label="Favoritos" className="transition-colors hover:text-primary">
            <Heart className="size-4" />
          </button>
          <button aria-label="Carrito" className="relative transition-colors hover:text-primary" onClick={() => setCartOpen(true)}>
            <ShoppingBag className="size-4" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-medium text-primary-foreground">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </button>
        </div>

        <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
      </div>

      {/* Mobile menu */}
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border px-5 pb-4 md:hidden">
          {[...navLinks, { label: "Mi cuenta", href: user ? "/mi-cuenta" : "/auth/login" }, { label: "Admin", href: "/admin" }].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="py-2 text-sm uppercase tracking-[0.15em] text-foreground"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  )
}

"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { Heart, ShoppingBag, Menu, X, User, Palette } from "lucide-react"
import { useCart } from "./cart-context"
import { useColorTheme, type ColorTheme } from "./color-theme-provider"
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
  const [themeOpen, setThemeOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const { theme, setTheme } = useColorTheme()
  const { itemCount } = useCart()
  const themeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (themeRef.current && !themeRef.current.contains(e.target as Node)) {
        setThemeOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [])

  const themes: { id: ColorTheme; label: string; className: string }[] = [
    { id: "default", label: "Clásico", className: "bg-[oklch(0.6_0.035_65)]" },
    { id: "noir", label: "Noir", className: "bg-[oklch(0.13_0.008_60)]" },
    { id: "rose", label: "Rose", className: "bg-[oklch(0.72_0.07_12)]" },
    { id: "lavande", label: "Lavande", className: "bg-[oklch(0.72_0.07_290)]" },
  ]

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
          <div className="relative" ref={themeRef}>
            <button
              aria-label="Cambiar tema"
              className="transition-colors hover:text-primary"
              onClick={() => setThemeOpen((v) => !v)}
            >
              <Palette className="size-4" />
            </button>
            {themeOpen && (
              <div className="absolute right-0 top-full z-50 mt-2 flex gap-1.5 rounded-lg border border-border bg-card p-2 shadow-lg">
                {themes.map((t) => (
                  <button
                    key={t.id}
                    title={t.label}
                    onClick={() => { setTheme(t.id); setThemeOpen(false) }}
                    className={`size-5 rounded-full ring-offset-2 ring-offset-card transition-all hover:scale-110 ${t.className} ${theme === t.id ? "ring-2 ring-ring" : ""}`}
                  />
                ))}
              </div>
            )}
          </div>
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

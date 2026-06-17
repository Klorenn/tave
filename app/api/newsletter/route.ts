import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { email, name } = await request.json()

  if (!email) {
    return NextResponse.json({ error: "Email es obligatorio." }, { status: 400 })
  }

  const { error } = await supabase.from("newsletter").insert({ email, name: name || null })

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ error: "Ya estás suscrito." }, { status: 409 })
    }
    if (error.code === "PGRST205" || error.message?.includes("Could not find the table")) {
      return NextResponse.json({
        error: "La tabla newsletter no existe. Ve a /setup para crearla.",
        needsSetup: true,
      }, { status: 500 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

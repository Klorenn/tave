import { createClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  const { name, email, message } = await request.json()

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Todos los campos son obligatorios." }, { status: 400 })
  }

  const { error } = await supabase.from("contact_messages").insert({ name, email, message })

  if (error) {
    if (error.code === "PGRST205" || error.message?.includes("Could not find the table")) {
      return NextResponse.json({
        error: "La tabla contact_messages no existe. Ve a /setup para crearla.",
        needsSetup: true,
      }, { status: 500 })
    }
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}

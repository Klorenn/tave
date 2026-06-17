import { NextResponse, type NextRequest } from "next/server"

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const authToken = extractAccessToken(request)

  let user = null
  if (authToken) {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/user`,
        { headers: { Authorization: `Bearer ${authToken}` } },
      )
      if (res.ok) {
        const body = await res.json()
        user = body
      }
    } catch {
      // fetch failed — treat as unauthenticated
    }
  }

  if (
    request.nextUrl.pathname.startsWith("/admin") &&
    request.nextUrl.pathname !== "/admin/login" &&
    !user
  ) {
    const url = request.nextUrl.clone()
    url.pathname = "/admin/login"
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

function extractAccessToken(request: NextRequest): string | null {
  const cookies = request.cookies.getAll()
  for (const c of cookies) {
    if (c.name.startsWith("sb-") && c.name.endsWith("-auth-token")) {
      try {
        const parsed = JSON.parse(c.value)
        if (typeof parsed.access_token === "string") return parsed.access_token
      } catch {
        continue
      }
    }
  }
  return null
}

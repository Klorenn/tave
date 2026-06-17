import { createOrder } from "@/lib/actions/orders"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const result = await createOrder(formData)

  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: 400 })
  }

  return NextResponse.json({ success: true, orderId: result.orderId })
}

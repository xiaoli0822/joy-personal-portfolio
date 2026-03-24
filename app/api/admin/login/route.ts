import { NextRequest, NextResponse } from "next/server"
import { ADMIN_COOKIE_NAME, getAdminCookieValue, isPasswordValid } from "@/lib/admin-auth"

export async function POST(request: NextRequest) {
  const { password } = (await request.json()) as { password?: string }

  if (!password || !isPasswordValid(password)) {
    return NextResponse.json({ message: "密码错误或后台未配置" }, { status: 401 })
  }

  const response = NextResponse.json({ success: true })
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: getAdminCookieValue(),
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  })

  return response
}

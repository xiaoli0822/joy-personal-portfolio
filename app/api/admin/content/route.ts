import { NextRequest, NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"
import { readSiteContent, writeSiteContent } from "@/lib/site-content"

export async function GET() {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ message: "未登录" }, { status: 401 })
  }

  const content = await readSiteContent()
  return NextResponse.json(content)
}

export async function PUT(request: NextRequest) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ message: "未登录" }, { status: 401 })
  }

  try {
    const content = await request.json()
    await writeSiteContent(content)
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      {
        message: error instanceof Error ? error.message : "保存失败",
      },
      { status: 400 }
    )
  }
}

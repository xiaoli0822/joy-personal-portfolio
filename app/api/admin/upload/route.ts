import { promises as fs } from "fs"
import path from "path"
import { NextResponse } from "next/server"
import { isAdminAuthenticated } from "@/lib/admin-auth"

const IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
])

const FILE_TYPES = new Set(["application/pdf"])

function sanitizeSegment(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
}

function getTargetDirectory(kind: string, slug: string) {
  if (kind === "profile-image" || kind === "contact-qr") {
    return path.join(process.cwd(), "public", "uploads", "profile")
  }

  if (kind === "resume") {
    return path.join(process.cwd(), "public", "uploads", "resume")
  }

  if (kind === "project-image") {
    return path.join(process.cwd(), "public", "uploads", "projects", slug)
  }

  throw new Error("未知上传类型")
}

function getPublicBase(kind: string, slug: string) {
  if (kind === "profile-image" || kind === "contact-qr") {
    return "/uploads/profile"
  }

  if (kind === "resume") {
    return "/uploads/resume"
  }

  if (kind === "project-image") {
    return `/uploads/projects/${slug}`
  }

  throw new Error("未知上传类型")
}

export async function POST(request: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ message: "未登录" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const kind = String(formData.get("kind") || "")
    const slug = sanitizeSegment(String(formData.get("slug") || "project"))
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "请选择文件" }, { status: 400 })
    }

    if (kind === "resume") {
      if (!FILE_TYPES.has(file.type) && path.extname(file.name).toLowerCase() !== ".pdf") {
        return NextResponse.json({ message: "简历仅支持 PDF" }, { status: 400 })
      }
    } else if (!IMAGE_TYPES.has(file.type)) {
      return NextResponse.json({ message: "仅支持常见图片格式" }, { status: 400 })
    }

    if (kind === "project-image" && !slug) {
      return NextResponse.json({ message: "项目 slug 不能为空" }, { status: 400 })
    }

    const extension = (path.extname(file.name) || (kind === "resume" ? ".pdf" : ".png")).toLowerCase()
    const dirPath = getTargetDirectory(kind, slug)
    await fs.mkdir(dirPath, { recursive: true })

    const fileName = `${Date.now()}${extension}`
    const filePath = path.join(dirPath, fileName)
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(filePath, buffer)

    return NextResponse.json({
      src: `${getPublicBase(kind, slug)}/${fileName}`,
    })
  } catch (error) {
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "上传失败" },
      { status: 500 }
    )
  }
}

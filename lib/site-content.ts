import "server-only"

import { promises as fs } from "fs"
import path from "path"
import { unstable_noStore as noStore } from "next/cache"
import type {
  ExperienceIconKey,
  ExperienceEntry,
  ProjectEntry,
  ProjectGalleryImage,
  SiteContactEntry,
  SiteContent,
} from "./site-content-schema"

export const CONTENT_FILE_PATH = path.join(process.cwd(), "content", "site-content.json")

export const EXPERIENCE_ICON_OPTIONS: ExperienceIconKey[] = ["graduation", "react", "vue"]

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string")
}

function isGalleryImage(value: unknown): value is ProjectGalleryImage {
  if (!value || typeof value !== "object") return false
  const image = value as Record<string, unknown>
  return typeof image.src === "string" && typeof image.alt === "string"
}

function isContactEntry(value: unknown): value is SiteContactEntry {
  if (!value || typeof value !== "object") return false
  const contact = value as Record<string, unknown>
  return (
    typeof contact.enabled === "boolean" &&
    typeof contact.displayMode === "string" &&
    ["qr", "account", "link"].includes(contact.displayMode) &&
    typeof contact.account === "string" &&
    typeof contact.link === "string" &&
    typeof contact.qrImage === "string"
  )
}

function isProjectEntry(value: unknown): value is ProjectEntry {
  if (!value || typeof value !== "object") return false
  const project = value as Record<string, unknown>
  return (
    typeof project.id === "string" &&
    typeof project.slug === "string" &&
    typeof project.title === "string" &&
    typeof project.summary === "string" &&
    typeof project.descriptionMarkdown === "string" &&
    isStringArray(project.tags) &&
    typeof project.coverImage === "string" &&
    Array.isArray(project.galleryImages) &&
    project.galleryImages.every(isGalleryImage) &&
    typeof project.projectUrl === "string" &&
    typeof project.demoUrl === "string" &&
    typeof project.showSourceButton === "boolean" &&
    typeof project.showDemoButton === "boolean" &&
    typeof project.showDescriptionCard === "boolean"
  )
}

function isExperienceEntry(value: unknown): value is ExperienceEntry {
  if (!value || typeof value !== "object") return false
  const experience = value as Record<string, unknown>
  return (
    typeof experience.id === "string" &&
    typeof experience.title === "string" &&
    typeof experience.location === "string" &&
    typeof experience.date === "string" &&
    typeof experience.description === "string" &&
    typeof experience.iconKey === "string" &&
    EXPERIENCE_ICON_OPTIONS.includes(experience.iconKey as ExperienceIconKey)
  )
}

export function validateSiteContent(content: unknown): asserts content is SiteContent {
  if (!content || typeof content !== "object") {
    throw new Error("内容格式无效")
  }

  const data = content as Record<string, unknown>
  const profile = data.profile as Record<string, unknown> | undefined

  if (!profile || typeof profile !== "object") {
    throw new Error("个人信息缺失")
  }

  if (
    typeof profile.name !== "string" ||
    typeof profile.headline !== "string" ||
    !isStringArray(profile.roles) ||
    typeof profile.shortIntro !== "string" ||
    typeof profile.focusLine !== "string" ||
    !isStringArray(profile.about) ||
    typeof profile.profileImage !== "string" ||
    typeof profile.resume !== "string" ||
    typeof profile.showResumeAction !== "boolean" ||
    typeof profile.showGithubAction !== "boolean" ||
    typeof profile.showBlogAction !== "boolean"
  ) {
    throw new Error("个人信息格式无效")
  }

  const socialLinks = profile.socialLinks as Record<string, unknown> | undefined
  if (
    !socialLinks ||
    typeof socialLinks.github !== "string" ||
    typeof socialLinks.blog !== "string"
  ) {
    throw new Error("社交链接格式无效")
  }

  const contacts = profile.contacts as Record<string, unknown> | undefined
  if (
    !contacts ||
    !isContactEntry(contacts.wechat) ||
    !isContactEntry(contacts.qq)
  ) {
    throw new Error("联系方式格式无效")
  }

  if (!isStringArray(data.skills)) {
    throw new Error("技能列表格式无效")
  }

  if (!Array.isArray(data.experiences) || !data.experiences.every(isExperienceEntry)) {
    throw new Error("经历列表格式无效")
  }

  if (!Array.isArray(data.projects) || !data.projects.every(isProjectEntry)) {
    throw new Error("项目列表格式无效")
  }

  const slugs = new Set<string>()
  for (const project of data.projects) {
    const slug = project.slug.trim()
    if (!slug) throw new Error("项目 slug 不能为空")
    if (slugs.has(slug)) throw new Error(`项目 slug 重复：${slug}`)
    slugs.add(slug)
    if (!project.title.trim()) throw new Error("项目标题不能为空")
  }
}

export async function readSiteContent() {
  noStore()
  const raw = await fs.readFile(CONTENT_FILE_PATH, "utf8")
  const parsed = JSON.parse(raw) as unknown
  validateSiteContent(parsed)
  return parsed
}

export async function writeSiteContent(content: SiteContent) {
  validateSiteContent(content)
  await fs.writeFile(CONTENT_FILE_PATH, JSON.stringify(content, null, 2), "utf8")
}

export async function getProjectBySlug(slug: string) {
  const content = await readSiteContent()
  return content.projects.find((project) => project.slug === slug) ?? null
}

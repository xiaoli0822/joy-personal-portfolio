"use client"
/* eslint-disable @next/next/no-img-element */

import type { ChangeEvent } from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import type {
  ContactDisplayMode,
  ExperienceEntry,
  ExperienceIconKey,
  ProjectEntry,
  SiteContactEntry,
  SiteContent,
} from "@/lib/site-content-schema"

type AdminDashboardProps = {
  initialContent: SiteContent
}

type AdminSection = "profile" | "skills" | "projects" | "experiences"

const sections: { id: AdminSection; label: string }[] = [
  { id: "profile", label: "个人信息" },
  { id: "skills", label: "技能" },
  { id: "projects", label: "项目" },
  { id: "experiences", label: "经历" },
]

const iconOptions: ExperienceIconKey[] = ["graduation", "react", "vue"]
const contactModes: ContactDisplayMode[] = ["qr", "account", "link"]

function cloneContent(content: SiteContent) {
  return JSON.parse(JSON.stringify(content)) as SiteContent
}

function moveItem<T>(list: T[], index: number, direction: -1 | 1) {
  const nextIndex = index + direction
  if (nextIndex < 0 || nextIndex >= list.length) return list
  const next = [...list]
  ;[next[index], next[nextIndex]] = [next[nextIndex], next[index]]
  return next
}

function createProject(): ProjectEntry {
  const id = `project-${Date.now()}`
  return {
    id,
    slug: id,
    title: "未命名项目",
    summary: "",
    descriptionMarkdown: "",
    tags: [],
    coverImage: "",
    galleryImages: [],
    projectUrl: "",
    demoUrl: "",
    showSourceButton: false,
    showDemoButton: false,
    showDescriptionCard: true,
  }
}

function createExperience(): ExperienceEntry {
  return {
    id: `experience-${Date.now()}`,
    title: "新经历",
    location: "",
    date: "",
    description: "",
    iconKey: "graduation",
  }
}

function contactPreview(contact: SiteContactEntry) {
  if (contact.displayMode === "qr" && contact.qrImage) return { type: "qr" as const, value: contact.qrImage }
  if (contact.displayMode === "link" && contact.link) return { type: "link" as const, value: contact.link }
  if (contact.account) return { type: "account" as const, value: contact.account }
  if (contact.link) return { type: "link" as const, value: contact.link }
  if (contact.qrImage) return { type: "qr" as const, value: contact.qrImage }
  return null
}

function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: {
  title: string
  description: string
  actionLabel: string
  onAction: () => void
}) {
  return (
    <div className="rounded-[1.75rem] border border-dashed border-slate-300/80 bg-slate-50/80 p-8 text-center dark:border-white/15 dark:bg-white/5">
      <div className="text-lg font-semibold text-slate-900 dark:text-white">{title}</div>
      <p className="mt-2 text-sm text-slate-500 dark:text-white/60">{description}</p>
      <button className="mini-btn mt-5" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  )
}

export default function AdminDashboard({ initialContent }: AdminDashboardProps) {
  const router = useRouter()
  const [section, setSection] = useState<AdminSection>("profile")
  const [content, setContent] = useState(() => cloneContent(initialContent))
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [projectIndex, setProjectIndex] = useState(0)
  const [experienceIndex, setExperienceIndex] = useState(0)

  const project = content.projects[projectIndex] ?? null
  const experience = content.experiences[experienceIndex] ?? null

  const uploadAsset = async (kind: string, file: File, slug?: string) => {
    const formData = new FormData()
    formData.append("kind", kind)
    formData.append("file", file)
    if (slug) formData.append("slug", slug)

    const response = await fetch("/api/admin/upload", { method: "POST", body: formData })
    const data = (await response.json()) as { src?: string; message?: string }

    if (!response.ok || !data.src) {
      throw new Error(data.message || "上传失败")
    }

    return data.src
  }

  const save = async () => {
    setSaving(true)
    try {
      const response = await fetch("/api/admin/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })
      const data = (await response.json()) as { message?: string }
      if (!response.ok) throw new Error(data.message || "保存失败")
      toast.success("内容已保存")
      router.refresh()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "保存失败")
    } finally {
      setSaving(false)
    }
  }

  const logout = async () => {
    setLoggingOut(true)
    try {
      await fetch("/api/admin/logout", { method: "POST" })
      toast.success("已退出后台")
      router.refresh()
    } finally {
      setLoggingOut(false)
    }
  }

  const updateProfile = <K extends keyof SiteContent["profile"]>(key: K, value: SiteContent["profile"][K]) => {
    setContent((current) => ({
      ...current,
      profile: {
        ...current.profile,
        [key]: value,
      },
    }))
  }

  const updateContact = (channel: "wechat" | "qq", patch: Partial<SiteContactEntry>) => {
    setContent((current) => ({
      ...current,
      profile: {
        ...current.profile,
        contacts: {
          ...current.profile.contacts,
          [channel]: {
            ...current.profile.contacts[channel],
            ...patch,
          },
        },
      },
    }))
  }

  const updateProject = (patch: Partial<ProjectEntry>) => {
    if (!project) return
    setContent((current) => ({
      ...current,
      projects: current.projects.map((item, index) => (index === projectIndex ? { ...item, ...patch } : item)),
    }))
  }

  const updateExperience = (patch: Partial<ExperienceEntry>) => {
    if (!experience) return
    setContent((current) => ({
      ...current,
      experiences: current.experiences.map((item, index) =>
        index === experienceIndex ? { ...item, ...patch } : item
      ),
    }))
  }

  const addProject = () => {
    setContent((current) => {
      const nextProjects = [...current.projects, createProject()]
      setProjectIndex(nextProjects.length - 1)
      return { ...current, projects: nextProjects }
    })
  }

  const deleteProject = () => {
    if (!project) return
    if (!window.confirm(`确认删除项目“${project.title || project.slug}”吗？`)) return

    setContent((current) => {
      const nextProjects = current.projects.filter((_, index) => index !== projectIndex)
      setProjectIndex(nextProjects.length === 0 ? 0 : Math.min(projectIndex, nextProjects.length - 1))
      return { ...current, projects: nextProjects }
    })
  }

  const addExperience = () => {
    setContent((current) => {
      const nextExperiences = [...current.experiences, createExperience()]
      setExperienceIndex(nextExperiences.length - 1)
      return { ...current, experiences: nextExperiences }
    })
  }

  const deleteExperience = () => {
    if (!experience) return
    if (!window.confirm(`确认删除经历“${experience.title}”吗？`)) return

    setContent((current) => {
      const nextExperiences = current.experiences.filter((_, index) => index !== experienceIndex)
      setExperienceIndex(nextExperiences.length === 0 ? 0 : Math.min(experienceIndex, nextExperiences.length - 1))
      return { ...current, experiences: nextExperiences }
    })
  }

  const deleteSkill = (index: number) => {
    if (!window.confirm("确认删除这个技能吗？")) return

    setContent((current) => ({
      ...current,
      skills: current.skills.filter((_, skillIndex) => skillIndex !== index),
    }))
  }

  const onUpload = async (
    event: ChangeEvent<HTMLInputElement>,
    kind: string,
    onSuccess: (src: string) => void,
    slug?: string
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      const src = await uploadAsset(kind, file, slug)
      onSuccess(src)
      toast.success("上传成功")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "上传失败")
    } finally {
      event.target.value = ""
    }
  }

  const onMultiImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!project) return
    const files = event.target.files
    if (!files) return

    try {
      const uploadedImages = []
      for (const file of Array.from(files)) {
        const src = await uploadAsset("project-image", file, project.slug)
        uploadedImages.push({
          src,
          alt: `${project.title} 展示图`,
        })
      }
      updateProject({ galleryImages: [...project.galleryImages, ...uploadedImages] })
      toast.success("作品图已上传")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "作品图上传失败")
    } finally {
      event.target.value = ""
    }
  }

  const renderContact = (channel: "wechat" | "qq", label: string) => {
    const item = content.profile.contacts[channel]
    const preview = contactPreview(item)

    return (
      <div className="rounded-[1.5rem] border border-slate-200/80 p-4 dark:border-white/10">
        <div className="mb-4 flex items-center justify-between">
          <div className="font-semibold text-slate-900 dark:text-white">{label}</div>
          <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-white/70">
            <input
              type="checkbox"
              checked={item.enabled}
              onChange={(event) => updateContact(channel, { enabled: event.target.checked })}
            />
            启用
          </label>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <select
            className="field-input"
            value={item.displayMode}
            onChange={(event) => updateContact(channel, { displayMode: event.target.value as ContactDisplayMode })}
          >
            {contactModes.map((mode) => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
          <input
            className="field-input"
            placeholder="账号"
            value={item.account}
            onChange={(event) => updateContact(channel, { account: event.target.value })}
          />
        </div>

        <input
          className="field-input mt-4"
          placeholder="跳转链接"
          value={item.link}
          onChange={(event) => updateContact(channel, { link: event.target.value })}
        />

        <div className="mt-4 grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
          <input
            className="field-input"
            placeholder="二维码路径"
            value={item.qrImage}
            onChange={(event) => updateContact(channel, { qrImage: event.target.value })}
          />
          <label className="mini-btn mt-auto cursor-pointer">
            上传二维码
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event) => onUpload(event, "contact-qr", (src) => updateContact(channel, { qrImage: src }))}
            />
          </label>
        </div>

        <div className="mt-4 rounded-[1.25rem] bg-slate-50 p-4 dark:bg-white/5">
          {!preview ? <div className="text-sm text-slate-400">暂无预览内容</div> : null}
          {preview?.type === "qr" ? (
            <img src={preview.value} alt={`${label} qr`} className="h-32 w-32 rounded-2xl object-cover" />
          ) : null}
          {preview?.type === "account" ? (
            <div className="text-sm text-slate-700 dark:text-white/70">{preview.value}</div>
          ) : null}
          {preview?.type === "link" ? (
            <div className="break-all text-sm text-slate-700 dark:text-white/70">{preview.value}</div>
          ) : null}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6">
        <div className="sticky top-4 z-30 rounded-[1.75rem] border border-white/60 bg-white/80 p-4 shadow-[0_25px_80px_rgba(15,23,42,0.12)] backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">Portfolio Admin</p>
              <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white">作品集内容后台</h1>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={save}
                disabled={saving}
                className="rounded-2xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-slate-950"
              >
                {saving ? "保存中..." : "保存所有改动"}
              </button>
              <button
                onClick={logout}
                disabled={loggingOut}
                className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75"
              >
                {loggingOut ? "退出中..." : "退出后台"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[18rem_minmax(0,1fr)]">
          <aside className="rounded-[2rem] border border-white/60 bg-white/75 p-4 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
            <div className="grid gap-3">
              {sections.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`rounded-[1.5rem] border px-4 py-4 text-left ${
                    section === item.id
                      ? "border-slate-900 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                      : "border-transparent bg-slate-50 text-slate-700 dark:bg-white/5 dark:text-white/70"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </aside>

          <motion.main
            key={section}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[2rem] border border-white/60 bg-white/75 p-5 shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/60 sm:p-6"
          >
            {section === "profile" ? (
              <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
                <div className="space-y-5">
                  <input className="field-input" value={content.profile.name} onChange={(event) => updateProfile("name", event.target.value)} placeholder="姓名" />
                  <input className="field-input" value={content.profile.headline} onChange={(event) => updateProfile("headline", event.target.value)} placeholder="主标题" />

                  <div className="grid gap-4 sm:grid-cols-2">
                    {content.profile.roles.map((role, index) => (
                      <input
                        key={index}
                        className="field-input"
                        value={role}
                        placeholder={`角色 ${index + 1}`}
                        onChange={(event) => {
                          const nextRoles = [...content.profile.roles]
                          nextRoles[index] = event.target.value
                          updateProfile("roles", nextRoles)
                        }}
                      />
                    ))}
                  </div>

                  <textarea className="field-textarea" value={content.profile.shortIntro} onChange={(event) => updateProfile("shortIntro", event.target.value)} placeholder="短介绍" />
                  <textarea className="field-textarea" value={content.profile.focusLine} onChange={(event) => updateProfile("focusLine", event.target.value)} placeholder="聚焦说明" />

                  <div className="space-y-3">
                    {content.profile.about.map((paragraph, index) => (
                      <div key={index} className="rounded-2xl border border-slate-200/80 p-3 dark:border-white/10">
                        <textarea
                          className="field-textarea"
                          value={paragraph}
                          onChange={(event) => {
                            const nextAbout = [...content.profile.about]
                            nextAbout[index] = event.target.value
                            updateProfile("about", nextAbout)
                          }}
                        />
                        <div className="mt-3 flex gap-2">
                          <button className="mini-btn" onClick={() => updateProfile("about", moveItem(content.profile.about, index, -1))}>上移</button>
                          <button className="mini-btn" onClick={() => updateProfile("about", moveItem(content.profile.about, index, 1))}>下移</button>
                        </div>
                      </div>
                    ))}
                    <button className="mini-btn" onClick={() => updateProfile("about", [...content.profile.about, ""])}>新增段落</button>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <input className="field-input" value={content.profile.profileImage} onChange={(event) => updateProfile("profileImage", event.target.value)} placeholder="头像路径" />
                    <label className="mini-btn mt-auto cursor-pointer">
                      上传头像
                      <input type="file" accept="image/*" className="hidden" onChange={(event) => onUpload(event, "profile-image", (src) => updateProfile("profileImage", src))} />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                    <input className="field-input" value={content.profile.resume} onChange={(event) => updateProfile("resume", event.target.value)} placeholder="简历路径" />
                    <label className="mini-btn mt-auto cursor-pointer">
                      上传简历
                      <input type="file" accept=".pdf,application/pdf" className="hidden" onChange={(event) => onUpload(event, "resume", (src) => updateProfile("resume", src))} />
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                      <input type="checkbox" checked={content.profile.showResumeAction} onChange={(event) => updateProfile("showResumeAction", event.target.checked)} />
                      显示简历入口
                    </label>
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                      <input type="checkbox" checked={content.profile.showGithubAction} onChange={(event) => updateProfile("showGithubAction", event.target.checked)} />
                      显示 GitHub
                    </label>
                    <label className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                      <input type="checkbox" checked={content.profile.showBlogAction} onChange={(event) => updateProfile("showBlogAction", event.target.checked)} />
                      显示博客
                    </label>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <input
                      className="field-input"
                      value={content.profile.socialLinks.github}
                      onChange={(event) => updateProfile("socialLinks", { ...content.profile.socialLinks, github: event.target.value })}
                      placeholder="GitHub 链接"
                    />
                    <input
                      className="field-input"
                      value={content.profile.socialLinks.blog}
                      onChange={(event) => updateProfile("socialLinks", { ...content.profile.socialLinks, blog: event.target.value })}
                      placeholder="博客链接"
                    />
                  </div>

                  <div className="grid gap-4 xl:grid-cols-2">
                    {renderContact("wechat", "微信")}
                    {renderContact("qq", "QQ")}
                  </div>
                </div>

                <div className="space-y-4 rounded-[1.75rem] border border-white/60 bg-white/80 p-5 shadow-sm dark:border-white/10 dark:bg-white/5">
                  <div className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">即时预览</div>
                  <img src={content.profile.profileImage} alt={content.profile.name} className="h-44 w-full rounded-[1.5rem] object-cover" />
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">{content.profile.name}</div>
                  <div className="text-sm text-slate-500 dark:text-white/55">{content.profile.headline}</div>
                  <div className="space-y-2 text-sm text-slate-600 dark:text-white/70">
                    {content.profile.showResumeAction && content.profile.resume ? <div>简历入口已显示</div> : null}
                    {content.profile.showGithubAction && content.profile.socialLinks.github ? <div>GitHub 已显示</div> : null}
                    {content.profile.showBlogAction && content.profile.socialLinks.blog ? <div>博客已显示</div> : null}
                    {content.profile.contacts.wechat.enabled ? <div>微信已启用</div> : null}
                    {content.profile.contacts.qq.enabled ? <div>QQ 已启用</div> : null}
                  </div>
                </div>
              </div>
            ) : null}

            {section === "skills" ? (
              <div className="space-y-3">
                {content.skills.map((skill, index) => (
                  <div key={`${skill}-${index}`} className="grid gap-3 rounded-[1.5rem] border border-slate-200/80 bg-white/80 p-4 sm:grid-cols-[minmax(0,1fr)_auto] dark:border-white/10 dark:bg-white/5">
                    <input
                      className="field-input"
                      value={skill}
                      onChange={(event) => setContent((current) => ({ ...current, skills: current.skills.map((item, itemIndex) => (itemIndex === index ? event.target.value : item)) }))}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button className="mini-btn" onClick={() => setContent((current) => ({ ...current, skills: moveItem(current.skills, index, -1) }))}>上移</button>
                      <button className="mini-btn" onClick={() => setContent((current) => ({ ...current, skills: moveItem(current.skills, index, 1) }))}>下移</button>
                      <button className="mini-btn-danger" onClick={() => deleteSkill(index)}>删除</button>
                    </div>
                  </div>
                ))}
                <button className="mini-btn" onClick={() => setContent((current) => ({ ...current, skills: [...current.skills, ""] }))}>新增技能</button>
              </div>
            ) : null}

            {section === "projects" ? (
              content.projects.length === 0 ? (
                <EmptyState title="还没有项目" description="删除到空列表后，仍然可以继续新增项目内容。" actionLabel="新增项目" onAction={addProject} />
              ) : (
                <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
                  <div className="space-y-3">
                    {content.projects.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => setProjectIndex(index)}
                        className={`w-full rounded-[1.35rem] border px-4 py-4 text-left ${
                          index === projectIndex
                            ? "border-slate-900 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                            : "border-slate-200 bg-white/85 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                        }`}
                      >
                        <div className="font-semibold">{item.title || "未命名项目"}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.2em] opacity-60">/{item.slug}</div>
                      </button>
                    ))}
                    <button className="mini-btn" onClick={addProject}>新增项目</button>
                  </div>

                  {project ? (
                    <div className="space-y-5">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <input className="field-input" value={project.title} onChange={(event) => updateProject({ title: event.target.value })} placeholder="项目标题" />
                        <input className="field-input" value={project.slug} onChange={(event) => updateProject({ slug: event.target.value })} placeholder="项目 slug" />
                      </div>
                      <textarea className="field-textarea" value={project.summary} onChange={(event) => updateProject({ summary: event.target.value })} placeholder="项目摘要" />
                      <textarea className="field-textarea min-h-[220px] font-mono text-sm" value={project.descriptionMarkdown} onChange={(event) => updateProject({ descriptionMarkdown: event.target.value })} placeholder="Markdown 项目说明" />
                      <input className="field-input" value={project.tags.join(", ")} onChange={(event) => updateProject({ tags: event.target.value.split(",").map((item) => item.trim()).filter(Boolean) })} placeholder="标签，用逗号分隔" />

                      <div className="grid gap-4 sm:grid-cols-2">
                        <input className="field-input" value={project.projectUrl} onChange={(event) => updateProject({ projectUrl: event.target.value })} placeholder="源码链接" />
                        <input className="field-input" value={project.demoUrl} onChange={(event) => updateProject({ demoUrl: event.target.value })} placeholder="在线演示链接" />
                      </div>

                      <div className="grid gap-4 sm:grid-cols-3">
                        <label className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                          <input type="checkbox" checked={project.showSourceButton} onChange={(event) => updateProject({ showSourceButton: event.target.checked })} />
                          显示源码按钮
                        </label>
                        <label className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                          <input type="checkbox" checked={project.showDemoButton} onChange={(event) => updateProject({ showDemoButton: event.target.checked })} />
                          显示在线演示按钮
                        </label>
                        <label className="flex items-center gap-3 rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/75">
                          <input type="checkbox" checked={project.showDescriptionCard} onChange={(event) => updateProject({ showDescriptionCard: event.target.checked })} />
                          显示项目说明卡片
                        </label>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-[minmax(0,1fr)_auto]">
                        <input className="field-input" value={project.coverImage} onChange={(event) => updateProject({ coverImage: event.target.value })} placeholder="封面图路径" />
                        <label className="mini-btn mt-auto cursor-pointer">
                          上传封面
                          <input type="file" accept="image/*" className="hidden" onChange={(event) => onUpload(event, "project-image", (src) => updateProject({ coverImage: src }), project.slug)} />
                        </label>
                      </div>

                      {project.coverImage ? <img src={project.coverImage} alt={project.title} className="h-52 w-full rounded-[1.25rem] object-cover" /> : null}

                      <div className="space-y-4 rounded-[1.5rem] border border-slate-200/80 p-4 dark:border-white/10">
                        <div className="flex items-center justify-between">
                          <div className="field-label">作品图集</div>
                          <label className="mini-btn cursor-pointer">
                            批量上传
                            <input type="file" accept="image/*" multiple className="hidden" onChange={onMultiImageUpload} />
                          </label>
                        </div>

                        {project.galleryImages.map((image, index) => (
                          <div key={`${image.src}-${index}`} className="rounded-[1.25rem] border border-slate-200/80 p-4 dark:border-white/10">
                            <div className="grid gap-3 lg:grid-cols-[8rem_minmax(0,1fr)]">
                              <img src={image.src} alt={image.alt} className="h-28 w-full rounded-2xl object-cover" />
                              <div className="space-y-3">
                                <input
                                  className="field-input"
                                  value={image.src}
                                  onChange={(event) => {
                                    const nextImages = [...project.galleryImages]
                                    nextImages[index] = { ...nextImages[index], src: event.target.value }
                                    updateProject({ galleryImages: nextImages })
                                  }}
                                />
                                <input
                                  className="field-input"
                                  value={image.alt}
                                  onChange={(event) => {
                                    const nextImages = [...project.galleryImages]
                                    nextImages[index] = { ...nextImages[index], alt: event.target.value }
                                    updateProject({ galleryImages: nextImages })
                                  }}
                                />
                                <div className="flex flex-wrap gap-2">
                                  <button className="mini-btn" onClick={() => updateProject({ galleryImages: moveItem(project.galleryImages, index, -1) })}>上移</button>
                                  <button className="mini-btn" onClick={() => updateProject({ galleryImages: moveItem(project.galleryImages, index, 1) })}>下移</button>
                                  <button
                                    className="mini-btn-danger"
                                    onClick={() => {
                                      if (!window.confirm("确认删除这张作品图吗？")) return
                                      updateProject({ galleryImages: project.galleryImages.filter((_, imageIndex) => imageIndex !== index) })
                                    }}
                                  >
                                    删除
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}

                        <button className="mini-btn" onClick={() => updateProject({ galleryImages: [...project.galleryImages, { src: "", alt: `${project.title} 展示图` }] })}>新增图片项</button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <button className="mini-btn" onClick={() => setContent((current) => ({ ...current, projects: moveItem(current.projects, projectIndex, -1) }))}>项目上移</button>
                        <button className="mini-btn" onClick={() => setContent((current) => ({ ...current, projects: moveItem(current.projects, projectIndex, 1) }))}>项目下移</button>
                        <button className="mini-btn" onClick={addProject}>新增项目</button>
                        <button className="mini-btn-danger" onClick={deleteProject}>删除项目</button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            ) : null}

            {section === "experiences" ? (
              content.experiences.length === 0 ? (
                <EmptyState title="还没有经历" description="删除到空列表后，仍然可以继续新增经历内容。" actionLabel="新增经历" onAction={addExperience} />
              ) : (
                <div className="grid gap-6 xl:grid-cols-[18rem_minmax(0,1fr)]">
                  <div className="space-y-3">
                    {content.experiences.map((item, index) => (
                      <button
                        key={item.id}
                        onClick={() => setExperienceIndex(index)}
                        className={`w-full rounded-[1.35rem] border px-4 py-4 text-left ${
                          index === experienceIndex
                            ? "border-slate-900 bg-slate-950 text-white dark:border-white dark:bg-white dark:text-slate-950"
                            : "border-slate-200 bg-white/85 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-white/70"
                        }`}
                      >
                        <div className="font-semibold">{item.title || "未命名经历"}</div>
                        <div className="mt-1 text-xs uppercase tracking-[0.2em] opacity-60">{item.date}</div>
                      </button>
                    ))}
                    <button className="mini-btn" onClick={addExperience}>新增经历</button>
                  </div>

                  {experience ? (
                    <div className="space-y-4">
                      <input className="field-input" value={experience.title} onChange={(event) => updateExperience({ title: event.target.value })} placeholder="经历标题" />
                      <div className="grid gap-4 sm:grid-cols-3">
                        <input className="field-input" value={experience.location} onChange={(event) => updateExperience({ location: event.target.value })} placeholder="地点" />
                        <input className="field-input" value={experience.date} onChange={(event) => updateExperience({ date: event.target.value })} placeholder="时间" />
                        <select className="field-input" value={experience.iconKey} onChange={(event) => updateExperience({ iconKey: event.target.value as ExperienceIconKey })}>
                          {iconOptions.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      </div>
                      <textarea className="field-textarea min-h-[180px]" value={experience.description} onChange={(event) => updateExperience({ description: event.target.value })} placeholder="经历描述" />
                      <div className="flex flex-wrap gap-2">
                        <button className="mini-btn" onClick={() => setContent((current) => ({ ...current, experiences: moveItem(current.experiences, experienceIndex, -1) }))}>上移</button>
                        <button className="mini-btn" onClick={() => setContent((current) => ({ ...current, experiences: moveItem(current.experiences, experienceIndex, 1) }))}>下移</button>
                        <button className="mini-btn" onClick={addExperience}>新增经历</button>
                        <button className="mini-btn-danger" onClick={deleteExperience}>删除经历</button>
                      </div>
                    </div>
                  ) : null}
                </div>
              )
            ) : null}
          </motion.main>
        </div>
      </div>
    </div>
  )
}

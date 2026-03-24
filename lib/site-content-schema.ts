export type ExperienceIconKey = "graduation" | "react" | "vue"

export type ContactDisplayMode = "qr" | "account" | "link"

export type SiteContactEntry = {
  enabled: boolean
  displayMode: ContactDisplayMode
  account: string
  link: string
  qrImage: string
}

export type ProjectGalleryImage = {
  src: string
  alt: string
}

export type ProjectEntry = {
  id: string
  slug: string
  title: string
  summary: string
  descriptionMarkdown: string
  tags: string[]
  coverImage: string
  galleryImages: ProjectGalleryImage[]
  projectUrl: string
  demoUrl: string
  showSourceButton: boolean
  showDemoButton: boolean
  showDescriptionCard: boolean
}

export type ExperienceEntry = {
  id: string
  title: string
  location: string
  date: string
  description: string
  iconKey: ExperienceIconKey
}

export type SiteContent = {
  profile: {
    name: string
    headline: string
    roles: string[]
    shortIntro: string
    focusLine: string
    about: string[]
    profileImage: string
    resume: string
    showResumeAction: boolean
    showGithubAction: boolean
    showBlogAction: boolean
    socialLinks: {
      github: string
      blog: string
    }
    contacts: {
      wechat: SiteContactEntry
      qq: SiteContactEntry
    }
  }
  skills: string[]
  experiences: ExperienceEntry[]
  projects: ProjectEntry[]
}

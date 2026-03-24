import React from "react"
import { FaGithub, FaReact, FaVuejs } from "react-icons/fa"
import { LuGraduationCap, LuMessageCircle } from "react-icons/lu"
import { MdOutlineQrCode2 } from "react-icons/md"
import { RiArticleLine } from "react-icons/ri"
import type { ExperienceIconKey, SiteContent, SiteContactEntry } from "./site-content-schema"

export const links = [
  { name: "Home", hash: "#home" },
  { name: "About", hash: "#about" },
  { name: "Projects", hash: "#projects" },
  { name: "Skills", hash: "#skills" },
  { name: "Experiences", hash: "#experience" },
] as const

export const headerLanguageMap: Record<(typeof links)[number]["name"], string> = {
  Home: "首页",
  About: "关于我",
  Projects: "项目",
  Skills: "技能",
  Experiences: "经历",
}

export const sectionTitles = {
  en: {
    about: "About me",
    projects: "Featured Projects",
    allProjects: "All Projects",
    skills: "My Skills",
    experiences: "My Experiences",
    viewAllProjects: "View All Projects",
    codeLabel: "Code",
    demoLabel: "Live demo",
    backToHome: "Back to home",
    backToProjects: "Back to projects",
    caseStudy: "Case Study",
    previousProject: "Previous project",
    nextProject: "Next project",
    adminTitle: "Portfolio Admin",
    projectDescription: "Project Description",
    wechatLabel: "WeChat",
    qqLabel: "QQ",
    resumeLabel: "Resume",
    resumeCta: "Download Resume",
    blogLabel: "Blog",
    actionEyebrow: "Action",
    contactEyebrow: "Contact",
    visitLink: "Open Link",
  },
  zh: {
    about: "关于我",
    projects: "精选项目",
    allProjects: "全部项目",
    skills: "我的技能",
    experiences: "我的经历",
    viewAllProjects: "查看更多项目",
    codeLabel: "源码",
    demoLabel: "在线演示",
    backToHome: "返回首页",
    backToProjects: "返回项目列表",
    caseStudy: "项目展示",
    previousProject: "上一个项目",
    nextProject: "下一个项目",
    adminTitle: "作品集后台",
    projectDescription: "项目说明",
    wechatLabel: "微信",
    qqLabel: "QQ",
    resumeLabel: "简历",
    resumeCta: "下载简历",
    blogLabel: "博客",
    actionEyebrow: "入口",
    contactEyebrow: "联系",
    visitLink: "前往查看",
  },
} as const

export const introContent = {
  en: {
    greeting: "Hi, my name is",
    downloadCvLabel: "Download CV",
    blogLabel: "Blog",
    roleLead: "I'm a",
  },
  zh: {
    greeting: "你好，我是",
    downloadCvLabel: "下载简历",
    blogLabel: "博客",
    roleLead: "我是一名",
  },
} as const

export const englishFallbackContent = {
  profile: {
    name: "Joy Peng",
    roles: ["Frontend Developer", "Full Stack Developer"],
    shortIntro: "I enjoy building things for the web.",
    focusLine: "My focus is React (Next.js).",
    about: [
      "My journey into programming started during my undergraduate studies in Digital Publishing at Wuhan University.",
      "I enjoy solving product and engineering problems with React, Next.js, Vue, TypeScript, and modern web tooling.",
      "Outside of coding, I like learning new technologies, building side projects, and sharing my work.",
    ],
    profileImage: "/profile.png",
    resume: "/joy-fullstack-resume.pdf",
    showResumeAction: true,
    showGithubAction: true,
    showBlogAction: true,
    socialLinks: {
      github: "https://github.com/Codefreyy",
      blog: "https://blog-joy-peng.netlify.app",
    },
    contacts: {
      wechat: {
        enabled: false,
        displayMode: "account",
        account: "",
        link: "",
        qrImage: "",
      },
      qq: {
        enabled: false,
        displayMode: "account",
        account: "",
        link: "",
        qrImage: "",
      },
    },
  },
} as const

export function getExperienceIcon(iconKey: ExperienceIconKey) {
  switch (iconKey) {
    case "react":
      return React.createElement(FaReact)
    case "vue":
      return React.createElement(FaVuejs)
    default:
      return React.createElement(LuGraduationCap)
  }
}

export function getContactVisual(channel: "wechat" | "qq") {
  if (channel === "wechat") {
    return React.createElement(LuMessageCircle)
  }

  return React.createElement(MdOutlineQrCode2)
}

export function buildLocalizedProfile(content: SiteContent, locale: string) {
  if (locale === "en") {
    return {
      ...englishFallbackContent.profile,
      roles: [...englishFallbackContent.profile.roles],
      about: [...englishFallbackContent.profile.about],
      showResumeAction: englishFallbackContent.profile.showResumeAction,
      showGithubAction: englishFallbackContent.profile.showGithubAction,
      showBlogAction: englishFallbackContent.profile.showBlogAction,
      socialLinks: { ...englishFallbackContent.profile.socialLinks },
      contacts: {
        wechat: { ...englishFallbackContent.profile.contacts.wechat },
        qq: { ...englishFallbackContent.profile.contacts.qq },
      },
    }
  }

  return content.profile
}

export function buildLocalizedAbout(content: SiteContent, locale: string) {
  if (locale === "en") {
    return [...englishFallbackContent.profile.about]
  }

  return content.profile.about
}

export function shouldRenderContact(contact: SiteContactEntry) {
  return contact.enabled && (contact.qrImage || contact.account || contact.link)
}

export function getContactDisplayValue(contact: SiteContactEntry) {
  if (contact.displayMode === "qr" && contact.qrImage) {
    return { type: "qr" as const, value: contact.qrImage }
  }

  if (contact.displayMode === "link" && contact.link) {
    return { type: "link" as const, value: contact.link }
  }

  if (contact.account) {
    return { type: "account" as const, value: contact.account }
  }

  if (contact.link) {
    return { type: "link" as const, value: contact.link }
  }

  if (contact.qrImage) {
    return { type: "qr" as const, value: contact.qrImage }
  }

  return null
}

export const profileActionItems = {
  github: {
    icon: React.createElement(FaGithub),
  },
  blog: {
    icon: React.createElement(RiArticleLine),
  },
}

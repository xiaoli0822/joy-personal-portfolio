"use client"
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion"
import { HiDownload } from "react-icons/hi"
import { Source_Code_Pro } from "next/font/google"
import { useLocale } from "next-intl"
import { useSectionInView } from "@/lib/hooks"
import { TypeAnimation } from "react-type-animation"
import useSound from "use-sound"
import { introContent, profileActionItems } from "@/lib/data"
import ContactCards, { type ProfileActionEntry } from "./ContactCards"
import type { SiteContactEntry } from "@/lib/site-content-schema"

const sourceCodePro = Source_Code_Pro({ subsets: ["latin"], weight: "400" })

type IntroProps = {
  profile: {
    name: string
    roles: string[]
    shortIntro: string
    focusLine: string
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
}

export default function Intro({ profile }: IntroProps) {
  const { ref } = useSectionInView("Home")
  const activeLocale = useLocale()
  const [playHover] = useSound("/bubble.wav", { volume: 0.5 })
  const content = activeLocale === "zh" ? introContent.zh : introContent.en
  const actionEntries: ProfileActionEntry[] = [
    {
      id: "resume",
      label: content.downloadCvLabel,
      icon: <HiDownload className="text-2xl text-slate-700 dark:text-white/80" />,
      href: profile.resume,
      display: profile.showResumeAction && Boolean(profile.resume),
    },
    {
      id: "github",
      label: "GitHub",
      icon: profileActionItems.github.icon,
      href: profile.socialLinks.github,
      display: profile.showGithubAction && Boolean(profile.socialLinks.github),
    },
    {
      id: "blog",
      label: content.blogLabel,
      icon: profileActionItems.blog.icon,
      href: profile.socialLinks.blog,
      display: profile.showBlogAction && Boolean(profile.socialLinks.blog),
    },
  ]

  return (
    <section
      ref={ref}
      className="mb-10 flex max-w-[58rem] flex-col items-center text-center sm:mb-0 scroll-mt-28 pt-[7rem]"
      id="home"
    >
      <div className="flex items-center justify-center">
        <div className="relative">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "tween", duration: 0.2 }}
          >
            <img
              src={profile.profileImage}
              alt="developer portrait"
              className="h-28 w-28 rounded-full border-[0.35rem] border-white object-cover shadow-xl"
            />
          </motion.div>
          <motion.span
            onHoverStart={() => playHover()}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ rotate: 15, scale: 1.12 }}
            className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-2xl shadow-lg"
            transition={{
              type: "spring",
              duration: 0.7,
              delay: 0.1,
              stiffness: 125,
            }}
          >
            <span aria-hidden>*</span>
          </motion.span>
        </div>
      </div>

      <motion.div
        className="mb-10 mt-4 px-4"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className={`${sourceCodePro.className} text-sm tracking-[0.3em] text-slate-500`}>
          {content.greeting}
        </span>
        <h1 className="mt-3 text-center text-4xl font-bold tracking-tight sm:text-6xl">
          {profile.name}
        </h1>

        <div className="mt-5 text-center">
          <span className={`${sourceCodePro.className} text-sm tracking-[0.25em] text-slate-500`}>
            {content.roleLead}
          </span>
          <h2 className="mt-2 text-center text-2xl font-extrabold text-slate-900 sm:text-5xl dark:text-white">
            <TypeAnimation
              sequence={[
                profile.roles[0] ?? "",
                1000,
                profile.roles[1] ?? profile.roles[0] ?? "",
                1000,
              ]}
              wrapper="span"
              speed={50}
              repeat={Infinity}
            />
          </h2>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-700 dark:text-white/80">
          {profile.shortIntro}
        </p>
        <p className="mx-auto mt-3 max-w-2xl text-base font-medium text-slate-500 dark:text-white/60">
          {profile.focusLine}
        </p>
      </motion.div>
      <motion.div
        className="w-full"
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ContactCards contacts={profile.contacts} actions={actionEntries} />
      </motion.div>
    </section>
  )
}

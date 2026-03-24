"use client"

import { motion } from "framer-motion"
import SectionHeading from "./SectionHeading"
import { useSectionInView } from "@/lib/hooks"
import { useLocale } from "next-intl"
import { sectionTitles } from "@/lib/data"

type AboutProps = {
  paragraphs: string[]
}

export default function About({ paragraphs }: AboutProps) {
  const { ref } = useSectionInView("About")
  const activeLocale = useLocale()
  const title = activeLocale === "zh" ? sectionTitles.zh.about : sectionTitles.en.about

  return (
    <motion.section
      ref={ref}
      className="mb-28 max-w-[45rem] scroll-mt-28 text-start leading-8 sm:mb-40"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.175 }}
      id="about"
    >
      <SectionHeading>{title}</SectionHeading>
      <div className="space-y-4 rounded-[2rem] border border-white/60 bg-white/70 p-8 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-white/5">
        {paragraphs.map((paragraph) => (
          <p key={paragraph} className="text-slate-700 dark:text-white/75">
            {paragraph}
          </p>
        ))}
      </div>
    </motion.section>
  )
}

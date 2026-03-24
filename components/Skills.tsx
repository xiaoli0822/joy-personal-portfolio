"use client"

import { sectionTitles } from "@/lib/data"
import { useSectionInView } from "@/lib/hooks"
import { motion } from "framer-motion"
import SectionHeading from "./SectionHeading"
import { useLocale } from "next-intl"

const fadeInAnimationVariants = {
  initial: {
    opacity: 0,
    y: 32,
  },
  animate: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.04 * index,
      duration: 0.35,
    },
  }),
}

type SkillsProps = {
  skills: string[]
}

export default function Skills({ skills }: SkillsProps) {
  const { ref } = useSectionInView("Skills")
  const activeLocale = useLocale()
  const title = activeLocale === "zh" ? sectionTitles.zh.skills : sectionTitles.en.skills

  return (
    <section
      id="skills"
      ref={ref}
      className="mb-28 max-w-[60rem] scroll-mt-28 text-center"
    >
      <SectionHeading>{title}</SectionHeading>
      <ul className="flex flex-wrap justify-center gap-3 text-lg text-gray-800">
        {skills.map((skill, index) => (
          <motion.li
            className="rounded-2xl border border-white/70 bg-white/85 px-5 py-3 text-sm font-medium tracking-wide text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-1 hover:shadow-lg dark:border-white/10 dark:bg-white/10 dark:text-white/80"
            key={`${skill}-${index}`}
            variants={fadeInAnimationVariants}
            initial="initial"
            whileInView="animate"
            viewport={{
              once: true,
            }}
            custom={index}
          >
            {skill}
          </motion.li>
        ))}
      </ul>
    </section>
  )
}

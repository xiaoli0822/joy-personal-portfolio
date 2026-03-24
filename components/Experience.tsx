"use client"

import {
  VerticalTimeline,
  VerticalTimelineElement,
} from "react-vertical-timeline-component"
import "react-vertical-timeline-component/style.min.css"
import { sectionTitles, getExperienceIcon } from "@/lib/data"
import type { ExperienceEntry } from "@/lib/site-content-schema"
import SectionHeading from "./SectionHeading"
import { motion } from "framer-motion"
import { useTheme } from "@/context/theme-context"
import { ExperienceLabel } from "./ExperienceLabel"
import { useLocale } from "next-intl"

type ExperienceProps = {
  isMobile: boolean
  experiences: ExperienceEntry[]
}

export default function Experience({ isMobile, experiences }: ExperienceProps) {
  const { theme } = useTheme()
  const activeLocale = useLocale()
  const content = activeLocale === "zh" ? sectionTitles.zh : sectionTitles.en

  const variants = {
    left: {
      hidden: { x: -120, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { duration: 0.45 } },
    },
    right: {
      hidden: { x: 120, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { duration: 0.45 } },
    },
  }

  return (
    <section className="relative mb-20 sm:mb-40">
      <ExperienceLabel />
      <SectionHeading>{content.experiences}</SectionHeading>
      {!isMobile ? (
        <VerticalTimeline lineColor={theme === "light" ? "#d8dee9" : "#374151"}>
          {experiences.map((item, index) => (
            <motion.div
              key={item.id}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={variants[index % 2 === 0 ? "right" : "left"]}
              className="mb-20"
            >
              <VerticalTimelineElement
                position={index % 2 === 0 ? "left" : "right"}
                visible={true}
                contentStyle={{
                  background:
                    theme === "light" ? "rgba(255,255,255,0.9)" : "rgba(255, 255, 255, 0.06)",
                  boxShadow: "0 24px 80px rgba(15, 23, 42, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.25)",
                  borderRadius: "1.5rem",
                  textAlign: "left",
                  padding: "1.3rem 2rem",
                  backdropFilter: "blur(20px)",
                }}
                contentArrowStyle={{
                  borderRight:
                    theme === "light"
                      ? "0.4rem solid rgba(255,255,255,0.85)"
                      : "0.4rem solid rgba(255, 255, 255, 0.35)",
                }}
                date={item.date}
                icon={<>{getExperienceIcon(item.iconKey)}</>}
                iconStyle={{
                  background:
                    theme === "light" ? "rgba(255,255,255,0.95)" : "rgba(255, 255, 255, 0.12)",
                  fontSize: "1.5rem",
                  color: theme === "light" ? "#0f172a" : "#ffffff",
                }}
              >
                <h3 className="font-bold capitalize">{item.title}</h3>
                <p className="font-normal !mt-0">{item.location}</p>
                <p className="!mt-2 !font-normal leading-7 text-gray-700 dark:text-white/75">
                  {item.description}
                </p>
              </VerticalTimelineElement>
            </motion.div>
          ))}
        </VerticalTimeline>
      ) : (
        <div className="flex flex-col gap-6">
          {experiences.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 rounded-[1.75rem] border border-white/60 bg-white/80 p-6 pb-8 shadow-[0_20px_70px_rgba(15,23,42,0.07)] backdrop-blur dark:border-white/10 dark:bg-white/5"
            >
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-white">
                  {getExperienceIcon(item.iconKey)}
                </div>
                <div className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                  {item.date}
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="font-bold capitalize">{item.title}</h3>
                <p className="font-normal !mt-0">{item.location}</p>
                <p className="!mt-1 !font-normal text-gray-700 dark:text-white/75">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}

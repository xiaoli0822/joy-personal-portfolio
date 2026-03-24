"use client"
/* eslint-disable @next/next/no-img-element */

import { MouseEvent, useRef } from "react"
import type { ProjectEntry } from "@/lib/site-content-schema"
import { motion, useScroll, useTransform } from "framer-motion"
import { FaGithubSquare } from "react-icons/fa"
import Link from "next/link"
import { FiExternalLink } from "react-icons/fi"
import { useLocale } from "next-intl"
import { sectionTitles } from "@/lib/data"
import { useRouter } from "next/navigation"

type ProjectProps = {
  project: ProjectEntry
}

export default function Project({ project }: ProjectProps) {
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["0 1", "1.1 1"],
  })
  const scaleProgess = useTransform(scrollYProgress, [0, 1], [0.92, 1])
  const opacityProgess = useTransform(scrollYProgress, [0, 1], [0.5, 1])
  const activeLocale = useLocale()
  const content = activeLocale === "zh" ? sectionTitles.zh : sectionTitles.en
  const detailHref = `/${activeLocale}/projects/${project.slug}`

  const stopCardNavigation = (event: MouseEvent<HTMLAnchorElement>) => {
    event.stopPropagation()
  }

  return (
    <motion.div
      ref={ref}
      style={{ scale: scaleProgess, opacity: opacityProgess }}
      className="group mb-4 cursor-pointer sm:mb-8 last:mb-0"
      onClick={() => router.push(detailHref)}
      role="link"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault()
          router.push(detailHref)
        }
      }}
    >
      <section className="relative overflow-hidden rounded-[2rem] border border-white/60 bg-white/80 shadow-[0_30px_90px_rgba(15,23,42,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-[0_35px_100px_rgba(15,23,42,0.13)] dark:border-white/10 dark:bg-white/10">
        <div className="grid gap-8 p-5 sm:grid-cols-[minmax(0,1fr)_22rem] sm:p-8">
          <div className="flex flex-col items-start gap-4">
            <div className="flex flex-col gap-3">
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500 dark:bg-white/10 dark:text-white/50">
                {content.caseStudy}
              </span>
              <h3 className="text-2xl font-semibold text-slate-900 transition group-hover:text-rose-500 dark:text-white dark:group-hover:text-amber-300">
                <Link href={detailHref}>{project.title}</Link>
              </h3>
              <p className="leading-relaxed text-gray-700 dark:text-white/70">{project.summary}</p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm text-gray-500 dark:text-gray-300">
              {project.showSourceButton && project.projectUrl ? (
                <Link
                  href={project.projectUrl}
                  target="_blank"
                  onClick={stopCardNavigation}
                  className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 hover:border-slate-300 hover:shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                  <span className="break-keep">{content.codeLabel}</span>
                  <FaGithubSquare className="h-5 w-5" />
                </Link>
              ) : null}
              {project.showDemoButton && project.demoUrl ? (
                <Link
                  href={project.demoUrl}
                  target="_blank"
                  onClick={stopCardNavigation}
                  className="flex items-center gap-1 rounded-full border border-slate-200 bg-white px-4 py-2 hover:border-slate-300 hover:shadow-sm dark:border-white/10 dark:bg-white/5"
                >
                  <span className="break-keep min-w-[4.5rem]">{content.demoLabel}</span>
                  <FiExternalLink className="h-5 w-5" />
                </Link>
              ) : null}
            </div>

            <ul className="mt-auto flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <li
                  className="rounded-full bg-black/[0.78] px-3 py-1 text-[0.7rem] uppercase tracking-wider text-white dark:text-white/75"
                  key={`${tag}-${index}`}
                >
                  {tag}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden rounded-[1.5rem] border border-white/50 bg-slate-100/80 p-2 dark:border-white/10 dark:bg-slate-900/40">
            <img
              src={project.coverImage}
              alt={`${project.title} cover`}
              className="h-full min-h-[16rem] w-full rounded-[1.1rem] object-cover transition duration-500 group-hover:scale-[1.03]"
            />
          </div>
        </div>
      </section>
    </motion.div>
  )
}

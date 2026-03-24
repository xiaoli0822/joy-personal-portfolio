"use client"

import { sectionTitles } from "@/lib/data"
import { useSectionInView } from "@/lib/hooks"
import SectionHeading from "./SectionHeading"
import Project from "./Project"
import { useLocale } from "next-intl"
import Link from "next/link"
import { FaAngleRight } from "react-icons/fa6"
import type { ProjectEntry } from "@/lib/site-content-schema"

type ProjectsProps = {
  projects: ProjectEntry[]
}

export default function Projects({ projects }: ProjectsProps) {
  const { ref } = useSectionInView("Projects", 0.1)
  const activeLocale = useLocale()
  const content = activeLocale === "zh" ? sectionTitles.zh : sectionTitles.en

  return (
    <section ref={ref} id="projects" className="mb-28 scroll-mt-28">
      <SectionHeading>{content.projects}</SectionHeading>
      <div>
        {projects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </div>
      <Link
        className="group mt-10 flex w-full items-center justify-center gap-1 font-semibold tracking-wide text-slate-800 hover:underline hover:underline-offset-4 hover:decoration-rose-400 dark:text-slate-400"
        href={`/${activeLocale}/projects`}
      >
        {content.viewAllProjects}
        <FaAngleRight className="transition group-hover:translate-x-2" />
      </Link>
    </section>
  )
}

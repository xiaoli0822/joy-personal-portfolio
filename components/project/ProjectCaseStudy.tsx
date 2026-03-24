"use client"
/* eslint-disable @next/next/no-img-element */

import { motion } from "framer-motion"
import Link from "next/link"
import { FiArrowLeft, FiArrowRight, FiExternalLink } from "react-icons/fi"
import { FaGithubSquare } from "react-icons/fa"
import type { ProjectEntry } from "@/lib/site-content-schema"
import { sectionTitles } from "@/lib/data"

type ProjectCaseStudyProps = {
  locale: string
  project: ProjectEntry
  previousProject: ProjectEntry | null
  nextProject: ProjectEntry | null
  descriptionHtml: string
}

export default function ProjectCaseStudy({
  locale,
  project,
  previousProject,
  nextProject,
  descriptionHtml,
}: ProjectCaseStudyProps) {
  const content = locale === "zh" ? sectionTitles.zh : sectionTitles.en

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-4 pb-24 pt-8 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-white/80"
        >
          <FiArrowLeft />
          {content.backToHome}
        </Link>

        <Link
          href={`/${locale}#projects`}
          className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-white/80"
        >
          {content.backToProjects}
        </Link>
      </div>

      <section className="overflow-hidden rounded-[2.25rem] border border-white/60 bg-white/75 shadow-[0_30px_90px_rgba(15,23,42,0.1)] backdrop-blur dark:border-white/10 dark:bg-slate-950/60">
        <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,1fr)_30rem] lg:p-10">
          <div className="flex flex-col gap-6">
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
                {content.caseStudy}
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
                {project.title}
              </h1>
              <p className="max-w-2xl text-base leading-8 text-slate-600 dark:text-white/70">
                {project.summary}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag, index) => (
                <span
                  key={`${tag}-${index}`}
                  className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-white dark:bg-white dark:text-slate-950"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap gap-3">
              {project.showSourceButton && project.projectUrl ? (
                <Link
                  href={project.projectUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-white/80"
                >
                  {content.codeLabel}
                  <FaGithubSquare />
                </Link>
              ) : null}
              {project.showDemoButton && project.demoUrl ? (
                <Link
                  href={project.demoUrl}
                  target="_blank"
                  className="inline-flex items-center gap-2 rounded-full bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-slate-800 dark:bg-white dark:text-slate-950"
                >
                  {content.demoLabel}
                  <FiExternalLink />
                </Link>
              ) : null}
            </div>
          </div>

          <div className="rounded-[1.75rem] border border-white/50 bg-white/80 p-3 dark:border-white/10 dark:bg-white/5">
            <img
              src={project.coverImage}
              alt={`${project.title} cover`}
              className="h-full min-h-[18rem] w-full rounded-[1.25rem] object-cover"
            />
          </div>
        </div>
      </section>

      {project.showDescriptionCard && project.descriptionMarkdown ? (
        <section className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/45">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.35em] text-slate-400">
            {content.projectDescription}
          </p>
          <div
            className="markdown-body text-slate-700 dark:text-white/75"
            dangerouslySetInnerHTML={{ __html: descriptionHtml }}
          />
        </section>
      ) : null}

      <section className="overflow-hidden rounded-[2rem] border border-white/60 bg-white/75 p-2 shadow-[0_24px_80px_rgba(15,23,42,0.08)] backdrop-blur dark:border-white/10 dark:bg-slate-950/45">
        <div className="space-y-1">
          {project.galleryImages.map((image, index) => (
            <motion.div
              key={`${image.src}-${index}`}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.22 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden rounded-[1.25rem]"
            >
              <img src={image.src} alt={image.alt} className="w-full object-cover" />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 border-t border-black/5 pt-6 dark:border-white/10 sm:grid-cols-2">
        {previousProject ? (
          <Link
            href={`/${locale}/projects/${previousProject.slug}`}
            className="group rounded-[1.75rem] border border-white/60 bg-white/75 p-5 shadow-sm transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {content.previousProject}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {previousProject.title}
              </div>
              <FiArrowLeft className="transition group-hover:-translate-x-1" />
            </div>
          </Link>
        ) : (
          <div />
        )}

        {nextProject ? (
          <Link
            href={`/${locale}/projects/${nextProject.slug}`}
            className="group rounded-[1.75rem] border border-white/60 bg-white/75 p-5 text-right shadow-sm transition hover:-translate-y-1 dark:border-white/10 dark:bg-white/5"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
              {content.nextProject}
            </p>
            <div className="mt-3 flex items-center justify-between gap-3">
              <FiArrowRight className="order-2 transition group-hover:translate-x-1" />
              <div className="text-lg font-semibold text-slate-900 dark:text-white">
                {nextProject.title}
              </div>
            </div>
          </Link>
        ) : null}
      </section>
    </main>
  )
}

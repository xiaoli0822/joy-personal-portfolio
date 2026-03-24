import Link from "next/link"
import Project from "@/components/Project"
import SectionHeading from "@/components/SectionHeading"
import { readSiteContent } from "@/lib/site-content"
import { sectionTitles } from "@/lib/data"

export default async function ProjectsListPage({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const content = await readSiteContent()
  const labels = locale === "zh" ? sectionTitles.zh : sectionTitles.en

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pb-24 pt-8 sm:px-6">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
        <SectionHeading>{labels.allProjects}</SectionHeading>
        <Link
          href={`/${locale}`}
          className="inline-flex items-center rounded-full border border-white/60 bg-white/80 px-4 py-2 text-sm font-medium text-slate-700 shadow-sm backdrop-blur transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-white/5 dark:text-white/80"
        >
          {labels.backToHome}
        </Link>
      </div>

      <div>
        {content.projects.map((project) => (
          <Project key={project.id} project={project} />
        ))}
      </div>
    </main>
  )
}

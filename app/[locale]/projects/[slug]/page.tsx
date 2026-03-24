import { notFound } from "next/navigation"
import ProjectCaseStudy from "@/components/project/ProjectCaseStudy"
import { readSiteContent } from "@/lib/site-content"
import { renderMarkdown } from "@/lib/markdown"

export const dynamic = "force-dynamic"

export async function generateMetadata({
  params: { slug },
}: {
  params: { slug: string }
}) {
  const content = await readSiteContent()
  const project = content.projects.find((item) => item.slug === slug)

  if (!project) {
    return {}
  }

  return {
    title: `${project.title} | Joy Portfolio`,
    description: project.summary,
  }
}

export default async function ProjectDetailPage({
  params: { locale, slug },
}: {
  params: { locale: string; slug: string }
}) {
  const content = await readSiteContent()
  const projectIndex = content.projects.findIndex((item) => item.slug === slug)

  if (projectIndex === -1) {
    notFound()
  }

  const project = content.projects[projectIndex]
  const previousProject = projectIndex > 0 ? content.projects[projectIndex - 1] : null
  const nextProject =
    projectIndex < content.projects.length - 1 ? content.projects[projectIndex + 1] : null

  return (
    <ProjectCaseStudy
      locale={locale}
      project={project}
      previousProject={previousProject}
      nextProject={nextProject}
      descriptionHtml={renderMarkdown(project.descriptionMarkdown)}
    />
  )
}

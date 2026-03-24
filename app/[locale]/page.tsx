import Intro from "@/components/Intro"
import SectionDivider from "@/components/SectionDivider"
import About from "@/components/About"
import Projects from "@/components/Projects"
import Skills from "@/components/Skills"
import Experience from "@/components/Experience"
import { isMobileDevice } from "@/lib/utils"
import { buildLocalizedAbout, buildLocalizedProfile } from "@/lib/data"
import { readSiteContent } from "@/lib/site-content"

export const metadata = {
  title: "Joy | Personal Portfolio",
  description: "Joy is a full-stack developer with 2 years of experience.",
}

export default async function Home({
  params: { locale },
}: {
  params: { locale: string }
}) {
  const isMobile = isMobileDevice()
  const content = await readSiteContent()
  const profile = buildLocalizedProfile(content, locale)
  const aboutParagraphs = buildLocalizedAbout(content, locale)

  return (
    <main className="flex flex-col items-center justify-center overflow-x-hidden px-4">
      <Intro profile={profile} />
      <SectionDivider />
      <About paragraphs={aboutParagraphs} />
      <Projects projects={content.projects.slice(0, 3)} />
      <Skills skills={content.skills} />
      <Experience isMobile={isMobile} experiences={content.experiences} />
    </main>
  )
}

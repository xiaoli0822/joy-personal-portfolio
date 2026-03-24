import "./globals.css"
import { Inter } from "next/font/google"
import ThemeContextProvider from "@/context/theme-context"
import { ActionSectionContextProvider } from "@/context/action-section-context"
import { NextIntlClientProvider, useMessages } from "next-intl"
import AppShell from "@/components/AppShell"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode
  params: { locale: string }
}) {
  const messages = useMessages()

  return (
    <html lang={locale} className="!scroll-smooth">
      <body
        className={`${inter.className} relative bg-gray-50 text-gray-950 dark:bg-gray-900 dark:text-gray-50 dark:text-opacity-90`}
      >
        <div className="pointer-events-none absolute right-[11rem] top-[-6rem] -z-10 h-[31.25rem] w-[31.25rem] rounded-full bg-[#fbe2e3] blur-[10rem] sm:w-[68.75rem] dark:bg-[#5b3b3c]" />
        <div className="pointer-events-none absolute left-[-35rem] top-[-1rem] -z-10 h-[31.25rem] w-[50rem] rounded-full bg-[#dbd7fb] blur-[10rem] sm:w-[68.75rem] md:left-[-33rem] lg:left-[-28rem] xl:left-[-15rem] 2xl:left-[-5rem] dark:bg-[#433f68]" />

        <NextIntlClientProvider messages={messages}>
          <ThemeContextProvider>
            <ActionSectionContextProvider>
              <AppShell>{children}</AppShell>
            </ActionSectionContextProvider>
          </ThemeContextProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

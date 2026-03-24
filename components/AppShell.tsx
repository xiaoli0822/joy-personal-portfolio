"use client"

import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ThemeSwitch from "@/components/ThemeTwich"
import LanguageSwitch from "@/components/LanguageSwitch"
import WidgetWrapper from "@/components/WidgetWrapper"
import { Toaster } from "react-hot-toast"
import { usePathname } from "next/navigation"

export default function AppShell({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const isAdminRoute = pathname.includes("/admin")
  const isProjectDetailRoute = pathname.includes("/projects/")
  const showHeader = !isAdminRoute && !isProjectDetailRoute
  const showFooter = !isAdminRoute
  const showWidgets = !isAdminRoute

  return (
    <>
      {showHeader ? <Header /> : null}
      {children}
      {showFooter ? <Footer /> : null}
      {showWidgets ? (
        <WidgetWrapper>
          <ThemeSwitch />
          <LanguageSwitch />
        </WidgetWrapper>
      ) : null}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "rgba(15, 23, 42, 0.92)",
            color: "#fff",
            borderRadius: "16px",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />
    </>
  )
}

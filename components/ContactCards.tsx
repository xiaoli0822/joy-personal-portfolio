"use client"
/* eslint-disable @next/next/no-img-element */

import Link from "next/link"
import type { ReactNode } from "react"
import { motion } from "framer-motion"
import { useLocale } from "next-intl"
import {
  getContactDisplayValue,
  getContactVisual,
  sectionTitles,
  shouldRenderContact,
} from "@/lib/data"
import type { SiteContactEntry } from "@/lib/site-content-schema"

export type ProfileActionEntry = {
  id: string
  label: string
  icon: ReactNode
  href: string
  display: boolean
}

type ContactCardsProps = {
  contacts: {
    wechat: SiteContactEntry
    qq: SiteContactEntry
  }
  actions?: ProfileActionEntry[]
}

type ContactCard =
  | {
      id: string
      type: "contact"
      label: string
      icon: ReactNode
      contact: SiteContactEntry
    }
  | {
      id: string
      type: "action"
      label: string
      icon: ReactNode
      href: string
    }

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.08,
    },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 28, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1] as const,
    },
  },
}

const cardClassName =
  "group rounded-[1.75rem] border border-white/60 bg-white/80 p-4 text-left shadow-[0_20px_70px_rgba(15,23,42,0.08)] backdrop-blur transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_28px_90px_rgba(15,23,42,0.14)] dark:border-white/10 dark:bg-white/5"

const iconClassName =
  "flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-700 transition duration-300 group-hover:bg-slate-900 group-hover:text-white dark:bg-white/10 dark:text-white/75 dark:group-hover:bg-white dark:group-hover:text-slate-950"

const linkClassName =
  "inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition duration-300 hover:-translate-y-0.5 hover:border-slate-900 hover:text-slate-950 hover:shadow-sm dark:border-white/10 dark:bg-white/5 dark:text-white/75 dark:hover:border-white dark:hover:text-white"

export default function ContactCards({ contacts, actions }: ContactCardsProps) {
  const locale = useLocale()
  const labels = locale === "zh" ? sectionTitles.zh : sectionTitles.en

  const contactEntries: ContactCard[] = [
    {
      id: "wechat",
      type: "contact" as const,
      label: labels.wechatLabel,
      icon: getContactVisual("wechat"),
      contact: contacts.wechat,
    },
    {
      id: "qq",
      type: "contact" as const,
      label: labels.qqLabel,
      icon: getContactVisual("qq"),
      contact: contacts.qq,
    },
  ].filter((entry) => shouldRenderContact(entry.contact))

  const actionEntries: ContactCard[] = (actions ?? [])
    .filter((entry) => entry.display && entry.href)
    .map((entry) => ({
      id: entry.id,
      type: "action" as const,
      label: entry.label,
      icon: entry.icon,
      href: entry.href,
    }))

  const entries = [...actionEntries, ...contactEntries]

  if (!entries.length) {
    return null
  }

  return (
    <motion.div
      className="mt-6 grid w-full max-w-5xl gap-4 sm:grid-cols-2 xl:grid-cols-3"
      variants={listVariants}
      initial="hidden"
      animate="visible"
    >
      {entries.map((entry) => {
        if (entry.type === "action") {
          return (
            <motion.div key={entry.id} variants={cardVariants} whileHover={{ y: -6 }} className={cardClassName}>
              <div className="mb-3 flex items-center gap-3">
                <div className={iconClassName}>{entry.icon}</div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                    {labels.actionEyebrow}
                  </p>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{entry.label}</h3>
                </div>
              </div>
              <p className="break-all text-sm text-slate-500 dark:text-white/60">{entry.href}</p>
              <Link
                href={entry.href}
                target="_blank"
                rel="noreferrer"
                locale={false}
                className={`mt-3 w-full ${linkClassName}`}
              >
                {entry.id === "resume" ? labels.resumeCta : labels.visitLink}
              </Link>
            </motion.div>
          )
        }

        const display = getContactDisplayValue(entry.contact)
        if (!display) {
          return null
        }

        return (
          <motion.div key={entry.id} variants={cardVariants} whileHover={{ y: -4 }} className={cardClassName}>
            <div className="mb-3 flex items-center gap-3">
              <div className={iconClassName}>{entry.icon}</div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-400">
                  {labels.contactEyebrow}
                </p>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{entry.label}</h3>
              </div>
            </div>

            {display.type === "qr" ? (
              <div className="space-y-3">
                <motion.img
                  src={display.value}
                  alt={`${entry.label} QR`}
                  className="h-40 w-40 rounded-[1.25rem] object-cover"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
                {entry.contact.account ? (
                  <p className="text-sm text-slate-500 dark:text-white/60">{entry.contact.account}</p>
                ) : null}
              </div>
            ) : null}

            {display.type === "account" ? (
              <p className="text-base font-medium text-slate-700 dark:text-white/75">{display.value}</p>
            ) : null}

            {display.type === "link" ? (
              <Link href={display.value} target="_blank" rel="noreferrer" className={`${linkClassName} break-all`}>
                {display.value}
              </Link>
            ) : null}
          </motion.div>
        )
      })}
    </motion.div>
  )
}

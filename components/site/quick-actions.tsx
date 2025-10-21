"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

type Item = {
  href: string
  label: string
  icon: React.ReactNode
}

function IconGrid() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z" />
    </svg>
  )
}
function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M7 2h2v2h6V2h2v2h3v18H4V4h3V2zm13 7H6v11h14V9z" />
    </svg>
  )
}
function IconTimer() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M15 1H9v2h6V1zM12 8v5l4 2 .9-1.8-3.1-1.5V8h-1.8zM12 4a9 9 0 100 18 9 9 0 000-18z" />
    </svg>
  )
}
function IconChat() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M4 4h16v10H6l-2 2V4zm2 4h12V6H6v2zm0 3h9V9H6v2z" />
    </svg>
  )
}
function IconAnalytics() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="currentColor" d="M3 3h2v18H3V3zm4 7h2v11H7V10zm4 4h2v7h-2v-7zm4-8h2v15h-2V6zm4 10h2v5h-2v-5z" />
    </svg>
  )
}

export function QuickActions() {
  const pathname = usePathname()
  const items: Item[] = [
    { href: "/dashboard", label: "Scheduler", icon: <IconGrid /> },
    { href: "/calendar", label: "Calendar", icon: <IconCalendar /> },
    { href: "/pomodoro", label: "Pomodoro", icon: <IconTimer /> },
    { href: "/chat", label: "Chatbot", icon: <IconChat /> },
    { href: "/insights", label: "Insights", icon: <IconAnalytics /> },
  ]

  return (
    <nav aria-label="Quick actions" className="fixed right-4 top-1/2 -translate-y-1/2 z-40">
      <ul className="flex flex-col gap-3 rounded-2xl bg-[color:var(--brand-dark)]/30 backdrop-blur-md p-2 shadow-lg">
        {items.map((it) => {
          const active = pathname === it.href
          return (
            <li key={it.href}>
              <Link
                href={it.href}
                title={it.label}
                aria-label={it.label}
                className={cn(
                  "flex h-12 w-12 items-center justify-center rounded-xl border transition",
                  "text-[color:var(--ink)]/80 hover:text-[color:var(--ink)]",
                  "bg-white/60 hover:bg-white",
                  "border-black/10",
                  active && "ring-2 ring-[color:var(--brand)] text-[color:var(--brand-dark)] bg-white",
                )}
              >
                {it.icon}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Music2, BookOpen, FolderOpen, LayoutList,
  Settings, Layers, Monitor, Tv2, Megaphone, CalendarDays,
} from "lucide-react"

const NAV = [
  { href: "/control",      icon: Layers,        label: "Kontrol",      color: "var(--color-brand)" },
  { href: "/service",      icon: LayoutList,    label: "Alur Ibadah",  color: "var(--color-chorus)" },
  { href: "/schedule",     icon: CalendarDays,  label: "Jadwal",       color: "var(--color-info)" },
  { href: "/songs",        icon: Music2,         label: "Lagu",         color: "var(--color-brand)" },
  { href: "/bible",        icon: BookOpen,      label: "Alkitab",      color: "var(--color-chorus)" },
  { href: "/announcement", icon: Megaphone,     label: "Pengumuman",   color: "var(--color-tag)" },
  { href: "/media",        icon: FolderOpen,    label: "Media",        color: "var(--color-info)" },
]

const DISPLAYS = [
  { href: "/output", icon: Tv2,     label: "Output", desc: "Layar Jemaat" },
  { href: "/stage",  icon: Monitor, label: "Stage",  desc: "Stage Display" },
]

function Tip({ label, desc }: { label: string; desc?: string }) {
  return (
    <span className="absolute left-full ml-3 px-2.5 py-1.5 rounded-lg text-xs font-semibold
      whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all pointer-events-none z-50
      translate-x-1 group-hover:translate-x-0"
      style={{
        background: "var(--color-surface-4)",
        color: "var(--color-text-primary)",
        border: "1px solid var(--color-border)",
        boxShadow: "0 4px 16px rgba(0,0,0,0.4)",
      }}>
      {label}
      {desc && <span className="ml-1.5" style={{ color: "var(--color-text-muted)" }}>{desc}</span>}
    </span>
  )
}

export function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 h-full w-[52px] flex flex-col z-40 border-r"
      style={{ background: "var(--color-surface-1)", borderColor: "var(--color-border)" }}>

      {/* Logo */}
      <div className="h-12 flex items-center justify-center border-b shrink-0"
        style={{ borderColor: "var(--color-border)" }}>
        <Link href="/control">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center font-extrabold text-[11px] transition-all hover:scale-110"
            style={{ background: "linear-gradient(135deg,#7C6FFD,#5548c8)", color: "white", boxShadow: "0 2px 10px rgba(124,111,253,0.45)" }}>
            CP
          </div>
        </Link>
      </div>

      {/* Main nav */}
      <nav className="flex-1 flex flex-col items-center gap-0.5 py-2 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {NAV.map(({ href, icon: Icon, label, color }) => {
          const active = pathname === href || (href !== "/control" && pathname.startsWith(href))
          return (
            <Link key={href} href={href} title={label}
              className="group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
              style={{
                background: active ? `${color}18` : "transparent",
                color: active ? color : "var(--color-text-muted)",
              }}>
              <Icon className="w-[18px] h-[18px]" />
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                  style={{ background: color }} />
              )}
              <Tip label={label} />
            </Link>
          )
        })}
      </nav>

      {/* Display screens */}
      <div className="flex flex-col items-center gap-0.5 pb-1 pt-2 border-t" style={{ borderColor: "var(--color-border)" }}>
        {DISPLAYS.map(({ href, icon: Icon, label, desc }) => (
          <a key={href} href={href} target="_blank" rel="noopener noreferrer"
            className="group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
            style={{ color: "var(--color-text-muted)" }}>
            <Icon className="w-[18px] h-[18px]" />
            <Tip label={label} desc={desc} />
          </a>
        ))}
      </div>

      {/* Settings */}
      <div className="flex flex-col items-center pb-3 pt-1 border-t" style={{ borderColor: "var(--color-border)" }}>
        <Link href="/settings"
          className="group relative w-10 h-10 rounded-xl flex items-center justify-center transition-all"
          style={{ color: pathname === "/settings" ? "var(--color-brand)" : "var(--color-text-muted)" }}>
          <Settings className="w-[18px] h-[18px]" />
          <Tip label="Pengaturan" />
        </Link>
      </div>
    </aside>
  )
}

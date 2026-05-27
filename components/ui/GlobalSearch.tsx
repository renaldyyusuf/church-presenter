"use client"

import { useSongStore }          from "@/stores/songStore"
import { usePresentationStore }  from "@/stores/presentationStore"
import { lyricsToSlides }        from "@/lib/lyrics/parser"
import { searchBible }           from "@/lib/data/bible-search"
import { useRouter }             from "next/navigation"
import {
  Search, X, Music2, BookOpen, ArrowRight,
  Play, ChevronRight, Megaphone, Command,
} from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import type { Song } from "@/types"

interface Result {
  id: string
  type: "song" | "bible" | "nav" | "action"
  title: string
  subtitle?: string
  action: () => void
}

const NAV_SHORTCUTS = [
  { label: "Panel Kontrol",  href: "/control",      key: "G C" },
  { label: "Alur Ibadah",    href: "/service",       key: "G S" },
  { label: "Jadwal",         href: "/schedule",      key: "G J" },
  { label: "Lagu",           href: "/songs",         key: "G L" },
  { label: "Alkitab",        href: "/bible",         key: "G A" },
  { label: "Pengumuman",     href: "/announcement",  key: "G P" },
  { label: "Media",          href: "/media",         key: "G M" },
  { label: "Pengaturan",     href: "/settings",      key: "G T" },
]

export function GlobalSearch() {
  const [open,    setOpen]   = useState(false)
  const [query,   setQuery]  = useState("")
  const [selIdx,  setSelIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router   = useRouter()

  const { songs } = useSongStore()
  const { setQueue, setMode } = usePresentationStore()

  // Open on Cmd/Ctrl+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(o => !o)
        setQuery("")
        setSelIdx(0)
      }
      if (e.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [])

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 50)
  }, [open])

  // Build results
  const results: Result[] = []

  if (!query.trim()) {
    // Show nav shortcuts when no query
    NAV_SHORTCUTS.forEach(n => {
      results.push({
        id: `nav-${n.href}`, type: "nav",
        title: n.label, subtitle: n.key,
        action: () => { router.push(n.href); setOpen(false) },
      })
    })
  } else {
    const q = query.toLowerCase()

    // Song matches
    songs.filter(s =>
      s.title.toLowerCase().includes(q) ||
      (s.artist ?? "").toLowerCase().includes(q) ||
      s.tags.some(t => t.includes(q))
    ).slice(0, 5).forEach(song => {
      results.push({
        id: `song-${song.id}`, type: "song",
        title: song.title, subtitle: song.artist,
        action: () => {
          setQueue(lyricsToSlides(song.lyrics_raw, song.id), 0)
          setMode("live")
          setOpen(false)
        },
      })
    })

    // Bible matches
    const bibleRes = searchBible(query, "TB").slice(0, 4)
    bibleRes.forEach(v => {
      results.push({
        id: `bible-${v.id}`, type: "bible",
        title: `${v.book} ${v.chapter}:${v.verse}`,
        subtitle: v.content_tb.slice(0, 60) + "…",
        action: () => {
          setQueue([{
            id: `bible-${v.id}`,
            content: v.content_tb,
            section: `${v.book} ${v.chapter}:${v.verse}`,
            sourceType: "bible" as const,
            order: 0,
          }], 0)
          setMode("live")
          setOpen(false)
        },
      })
    })

    // Nav matches
    NAV_SHORTCUTS.filter(n => n.label.toLowerCase().includes(q)).forEach(n => {
      results.push({
        id: `nav-${n.href}`, type: "nav",
        title: n.label, subtitle: "Buka halaman",
        action: () => { router.push(n.href); setOpen(false) },
      })
    })
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setSelIdx(i => Math.min(i + 1, results.length - 1)) }
    if (e.key === "ArrowUp")   { e.preventDefault(); setSelIdx(i => Math.max(i - 1, 0)) }
    if (e.key === "Enter" && results[selIdx]) results[selIdx].action()
  }

  if (!open) return (
    <button
      onClick={() => { setOpen(true); setQuery("") }}
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs transition-all"
      style={{
        background: "var(--color-surface-3)",
        borderColor: "var(--color-border)",
        color: "var(--color-text-muted)",
        boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
      }}>
      <Search className="w-3.5 h-3.5" />
      <span>Cari…</span>
      <span className="flex items-center gap-0.5 ml-1 px-1.5 py-0.5 rounded text-[10px]"
        style={{ background: "var(--color-surface-4)", color: "var(--color-text-muted)" }}>
        <Command className="w-2.5 h-2.5" />K
      </span>
    </button>
  )

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-[200]" style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
        onClick={() => setOpen(false)} />

      {/* Modal */}
      <div className="fixed top-[20vh] left-1/2 -translate-x-1/2 z-[201] w-full max-w-xl animate-slide-up"
        style={{ padding: "0 16px" }}>
        <div className="rounded-2xl border overflow-hidden shadow-2xl"
          style={{
            background: "var(--color-surface-2)",
            borderColor: "var(--color-border)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.6)",
          }}>
          {/* Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b" style={{ borderColor: "var(--color-border)" }}>
            <Search className="w-5 h-5 shrink-0" style={{ color: "var(--color-text-muted)" }} />
            <input
              ref={inputRef}
              value={query}
              onChange={e => { setQuery(e.target.value); setSelIdx(0) }}
              onKeyDown={handleKey}
              placeholder="Cari lagu, ayat Alkitab, halaman…"
              className="flex-1 bg-transparent outline-none text-base"
              style={{ color: "var(--color-text-primary)" }}
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
              </button>
            )}
            <kbd className="text-[10px] px-2 py-1 rounded font-mono"
              style={{ background: "var(--color-surface-4)", color: "var(--color-text-muted)", border: "1px solid var(--color-border)" }}>
              Esc
            </kbd>
          </div>

          {/* Results */}
          <div className="max-h-[50vh] overflow-y-auto">
            {results.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>Tidak ada hasil ditemukan</p>
              </div>
            ) : (
              <div className="py-1.5">
                {/* Group headers */}
                {!query.trim() && (
                  <p className="text-[10px] font-bold uppercase tracking-wider px-4 py-2"
                    style={{ color: "var(--color-text-muted)" }}>Navigasi Cepat</p>
                )}
                {query && results.some(r => r.type === "song") && (
                  <p className="text-[10px] font-bold uppercase tracking-wider px-4 py-2 mt-1"
                    style={{ color: "var(--color-text-muted)" }}>Lagu</p>
                )}
                {results.map((r, i) => {
                  const Icon = r.type === "song" ? Music2 : r.type === "bible" ? BookOpen : r.type === "nav" ? ArrowRight : Play
                  const iconColor = r.type === "song" ? "var(--color-brand)" : r.type === "bible" ? "var(--color-chorus)" : "var(--color-text-muted)"
                  const isSel = i === selIdx
                  return (
                    <button key={r.id} onClick={r.action}
                      onMouseEnter={() => setSelIdx(i)}
                      className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all"
                      style={{ background: isSel ? "var(--color-brand-glow)" : "transparent" }}>
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ background: isSel ? `${iconColor}20` : "var(--color-surface-3)" }}>
                        <Icon className="w-4 h-4" style={{ color: iconColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate" style={{ color: "var(--color-text-primary)" }}>{r.title}</p>
                        {r.subtitle && (
                          <p className="text-xs truncate mt-0.5" style={{ color: "var(--color-text-muted)" }}>{r.subtitle}</p>
                        )}
                      </div>
                      {isSel && (
                        <div className="shrink-0 flex items-center gap-1.5">
                          {(r.type === "song" || r.type === "bible") && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded font-medium"
                              style={{ background: "var(--color-brand)", color: "white" }}>
                              {r.type === "song" ? "Sajikan" : "Tampilkan"}
                            </span>
                          )}
                          <ChevronRight className="w-4 h-4" style={{ color: "var(--color-brand)" }} />
                        </div>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center gap-4 px-4 py-3 border-t" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-1)" }}>
            {[["↑↓","Navigasi"],["↵","Pilih"],["Esc","Tutup"]].map(([key, desc]) => (
              <div key={key} className="flex items-center gap-1.5">
                <kbd className="text-[9px] px-1.5 py-0.5 rounded font-mono"
                  style={{ background: "var(--color-surface-4)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border)" }}>
                  {key}
                </kbd>
                <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}

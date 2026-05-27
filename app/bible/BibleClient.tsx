"use client"

import { AppShell } from "@/components/layout/AppShell"
import { usePresentationStore } from "@/stores/presentationStore"
import { searchBible, type VerseResult } from "@/lib/data/bible-search"
import {
  BookOpen, Search, Play, X, CheckSquare, Square,
  ChevronDown, ChevronRight, Loader2, Languages,
} from "lucide-react"
import { useEffect, useRef, useState, useCallback } from "react"
import { useSearchParams } from "next/navigation"

const QUICK_REFS = [
  { label: "Yohanes 3:16",      q: "Yohanes 3:16" },
  { label: "Mazmur 23",          q: "Mazmur 23" },
  { label: "Roma 8:28-39",       q: "Roma 8:28" },
  { label: "Filipi 4:6-13",      q: "Filipi 4:6" },
  { label: "Yesaya 40:28-31",    q: "Yesaya 40:28" },
  { label: "Matius 5:3-8",       q: "Matius 5:3" },
  { label: "Amsal 3:5-6",        q: "Amsal 3:5" },
  { label: "Yeremia 29:11",      q: "Yeremia 29:11" },
  { label: "Yosua 1:9",          q: "Yosua 1:9" },
  { label: "1 Korintus 13:4-13", q: "1 Korintus 13:4" },
  { label: "Yohanes 14:6",       q: "Yohanes 14:6" },
  { label: "Efesus 2:8",         q: "Efesus 2:8" },
]

type Translation = "TB" | "KJV"

export function BibleClient() {
  const sp = useSearchParams()
  const { setQueue, setMode } = usePresentationStore()

  const [query, setQuery]           = useState(sp.get("q") ?? "")
  const [results, setResults]       = useState<VerseResult[]>([])
  const [selected, setSelected]     = useState<Set<string>>(new Set())
  const [hasSearched, setHasSearched] = useState(false)
  const [searching, setSearching]   = useState(false)
  const [translation, setTranslation] = useState<Translation>("TB")
  const [showBoth, setShowBoth]     = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const q = sp.get("q")
    if (q) run(q)
    else inputRef.current?.focus()
  }, [])

  const run = useCallback((q: string) => {
    setQuery(q)
    setSearching(true)
    setSelected(new Set())
    setTimeout(() => {
      setResults(searchBible(q, translation))
      setHasSearched(true)
      setSearching(false)
    }, 80)
  }, [translation])

  // Re-search when translation changes (if already searched)
  useEffect(() => {
    if (hasSearched && query) run(query)
  }, [translation])

  const toggle = (id: string) =>
    setSelected(p => { const s = new Set(p); s.has(id) ? s.delete(id) : s.add(id); return s })

  const getContent = (v: VerseResult) =>
    translation === "TB" ? v.content_tb : v.content_kjv

  const handlePresent = () => {
    const toPresent = selected.size > 0
      ? results.filter(v => selected.has(v.id))
      : results
    const slides = toPresent.map((v, i) => ({
      id: `bible-${v.id}`,
      content: getContent(v),
      section: `${v.book} ${v.chapter}:${v.verse}`,
      sourceType: "bible" as const,
      order: i,
    }))
    setQueue(slides, 0)
    setMode("live")
  }

  const content = (v: VerseResult) => translation === "TB" ? v.content_tb : v.content_kjv

  return (
    <AppShell>
      <div className="p-6 space-y-5 max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>Alkitab</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              Cari dan sajikan ayat Alkitab
            </p>
          </div>
          <div className="flex items-center gap-2">
            {/* Translation toggle */}
            <div className="flex items-center rounded-lg p-0.5" style={{ background: "var(--color-surface-3)" }}>
              {(["TB", "KJV"] as Translation[]).map(t => (
                <button key={t} onClick={() => setTranslation(t)}
                  className="px-3 py-1.5 rounded-md text-xs font-bold transition-all"
                  style={{
                    background: translation === t ? "var(--color-brand)" : "transparent",
                    color: translation === t ? "#fff" : "var(--color-text-muted)",
                  }}>
                  {t}
                </button>
              ))}
            </div>
            {/* Show both toggle */}
            <button onClick={() => setShowBoth(b => !b)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all"
              style={{
                background: showBoth ? "var(--color-brand-glow)" : "var(--color-surface-3)",
                borderColor: showBoth ? "var(--color-brand)" : "var(--color-border)",
                color: showBoth ? "var(--color-brand)" : "var(--color-text-muted)",
              }}>
              <Languages className="w-3.5 h-3.5" /> Bilingual
            </button>
            {results.length > 0 && (
              <button onClick={handlePresent}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: "var(--color-brand)", color: "white" }}>
                <Play className="w-4 h-4" />
                Sajikan {selected.size > 0 ? `(${selected.size})` : `Semua ${results.length}`}
              </button>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: "var(--color-text-muted)" }} />
          <input ref={inputRef} value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && run(query)}
            placeholder="Yohanes 3:16  ·  Mazmur 23  ·  Roma 8:28-39  ·  kasih  ·  iman"
            className="w-full pl-12 pr-28 py-4 rounded-xl border outline-none transition-all"
            style={{
              background: "var(--color-surface-2)",
              borderColor: query ? "var(--color-border-active)" : "var(--color-border)",
              color: "var(--color-text-primary)", fontSize: 15,
            }} />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
            {query && (
              <button onClick={() => { setQuery(""); setResults([]); setHasSearched(false) }}
                className="w-6 h-6 flex items-center justify-center rounded">
                <X className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
              </button>
            )}
            <button onClick={() => run(query)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: "var(--color-brand)", color: "#fff" }}>
              Cari
            </button>
          </div>
        </div>

        {/* Quick refs */}
        {!hasSearched && (
          <div className="space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
              Ayat Populer
            </p>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_REFS.map(({ label, q }) => (
                <button key={label} onClick={() => run(q)}
                  className="flex items-center gap-2 px-3 py-3 rounded-xl text-left border transition-all group"
                  style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                  <BookOpen className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--color-chorus)" }} />
                  <span className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>{label}</span>
                  <ChevronRight className="w-3 h-3 ml-auto opacity-0 group-hover:opacity-100 shrink-0" style={{ color: "var(--color-text-muted)" }} />
                </button>
              ))}
            </div>
            <div className="rounded-xl border p-4 grid grid-cols-2 gap-x-8 gap-y-1.5"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
              <p className="col-span-2 text-xs font-semibold mb-1" style={{ color: "var(--color-text-muted)" }}>Tips pencarian</p>
              {[
                ["Yohanes 3:16", "satu ayat"],
                ["Mazmur 23", "satu pasal"],
                ["Matius 5:3-8", "rentang ayat"],
                ["kasih pengharapan", "kata kunci"],
                ["John 3:16", "nama Inggris juga bisa"],
                ["1 Kor 13:4", "singkatan"],
              ].map(([ex, desc]) => (
                <div key={ex} className="flex items-center gap-2 text-xs">
                  <button onClick={() => run(ex)}
                    className="px-1.5 py-0.5 rounded font-mono font-semibold hover:opacity-80"
                    style={{ background: "var(--color-surface-4)", color: "var(--color-brand)" }}>
                    {ex}
                  </button>
                  <span style={{ color: "var(--color-text-muted)" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Searching */}
        {searching && (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--color-brand)" }} />
            <span className="ml-2 text-sm" style={{ color: "var(--color-text-muted)" }}>Mencari...</span>
          </div>
        )}

        {/* No results */}
        {hasSearched && !searching && results.length === 0 && (
          <div className="text-center py-16 rounded-xl border"
            style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}>
            <BookOpen className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--color-text-muted)" }} />
            <p className="font-medium" style={{ color: "var(--color-text-secondary)" }}>Ayat tidak ditemukan</p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              Coba "Yohanes 3:16", "Mazmur 23", atau kata kunci seperti "kasih"
            </p>
          </div>
        )}

        {/* Results */}
        {!searching && results.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold" style={{ color: "var(--color-text-muted)" }}>
                {results.length} ayat ditemukan
                {selected.size > 0 && <span style={{ color: "var(--color-brand)" }}> · {selected.size} dipilih</span>}
              </p>
              <button
                onClick={() => selected.size === results.length
                  ? setSelected(new Set())
                  : setSelected(new Set(results.map(r => r.id)))}
                className="flex items-center gap-1.5 text-xs"
                style={{ color: "var(--color-text-muted)" }}>
                {selected.size === results.length
                  ? <><CheckSquare className="w-3.5 h-3.5" /> Batalkan semua</>
                  : <><Square className="w-3.5 h-3.5" /> Pilih semua</>}
              </button>
            </div>

            <div className="space-y-2">
              {results.map(v => {
                const isSel = selected.has(v.id)
                return (
                  <div key={v.id} onClick={() => toggle(v.id)}
                    className="rounded-xl border p-5 cursor-pointer transition-all"
                    style={{
                      background: isSel ? "var(--color-brand-glow)" : "var(--color-surface-2)",
                      borderColor: isSel ? "var(--color-border-active)" : "var(--color-border)",
                    }}>
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 shrink-0">
                        {isSel
                          ? <CheckSquare className="w-4 h-4" style={{ color: "var(--color-brand)" }} />
                          : <Square className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} />}
                      </div>
                      <div className="flex-1 space-y-2">
                        {/* Reference */}
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-bold uppercase tracking-wider"
                            style={{ color: "var(--color-chorus)" }}>
                            {v.book} {v.chapter}:{v.verse}
                          </p>
                          <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold"
                            style={{ background: "var(--color-surface-4)", color: "var(--color-text-muted)" }}>
                            {translation}
                          </span>
                        </div>
                        {/* Primary translation */}
                        <p className="text-base leading-relaxed"
                          style={{
                            color: "var(--color-text-primary)",
                            fontFamily: "Georgia, 'Times New Roman', serif",
                            fontStyle: "italic",
                          }}>
                          {content(v)}
                        </p>
                        {/* Secondary translation (bilingual mode) */}
                        {showBoth && (
                          <p className="text-sm leading-relaxed border-t pt-2"
                            style={{
                              color: "var(--color-text-secondary)",
                              fontFamily: "Georgia, serif",
                              fontStyle: "italic",
                              borderColor: "var(--color-border)",
                            }}>
                            <span className="text-[10px] font-bold not-italic mr-2"
                              style={{ color: "var(--color-text-muted)" }}>
                              {translation === "TB" ? "KJV" : "TB"}
                            </span>
                            {translation === "TB" ? v.content_kjv : v.content_tb}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Present button at bottom */}
            <button onClick={handlePresent}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "var(--color-brand)", color: "white" }}>
              <Play className="w-4 h-4" />
              Sajikan {selected.size > 0
                ? `${selected.size} ayat terpilih`
                : `semua ${results.length} ayat`}
            </button>
          </div>
        )}
      </div>
    </AppShell>
  )
}

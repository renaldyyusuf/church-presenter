"use client"

import { AppShell } from "@/components/layout/AppShell"
import { useSongsInit } from "@/hooks/useSongs"
import { parseLyrics, lyricsToSlides, SECTION_COLORS } from "@/lib/lyrics/parser"
import { usePresentationStore } from "@/stores/presentationStore"
import { ArrowLeft, Save, Plus, X, Music2, Eye, EyeOff, Play, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import type { SectionType } from "@/types"

const SECTION_INSERTS = ["VERSE 1", "VERSE 2", "PRE-CHORUS", "CHORUS", "BRIDGE", "TAG", "OUTRO"]

const INITIAL_LYRICS = `VERSE 1
Tulis lirik lagumu di sini
Baris demi baris
Terus tambahkan lebih banyak

CHORUS
Bagian refrain di sini
Luar biasa dan penuh kuasa
Ulangi sesuai kebutuhan

VERSE 2
Lirik bait kedua
Lanjutkan ceritanya

BRIDGE
Bagian bridge di sini`

export default function NewSongPage() {
  const { saveSong } = useSongsInit()
  const { setQueue, setMode } = usePresentationStore()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [artist, setArtist] = useState("")
  const [category, setCategory] = useState("Kontemporer")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [lyricsRaw, setLyricsRaw] = useState(INITIAL_LYRICS)
  const [showPreview, setShowPreview] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const sections = parseLyrics(lyricsRaw)
  const slideCount = sections.reduce((acc, s) => acc + Math.ceil(s.lines.length / 4), 0)

  const addTag = () => {
    const t = tagInput.trim().toLowerCase().replace(/\s+/g, "-")
    if (t && !tags.includes(t)) setTags([...tags, t])
    setTagInput("")
  }

  const handleSave = async () => {
    if (!title.trim()) return
    setIsSaving(true)
    await saveSong({ title: title.trim(), artist: artist.trim() || undefined, lyrics_raw: lyricsRaw, tags, category, favorite: false })
    setIsSaving(false)
    router.push("/songs")
  }

  const handlePreview = () => {
    const slides = lyricsToSlides(lyricsRaw, "preview")
    setQueue(slides, 0)
    setMode("live")
  }

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/songs" className="w-8 h-8 rounded-lg flex items-center justify-center border"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>Tambah Lagu Baru</h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>{sections.length} seksi · {slideCount} slide</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(!showPreview)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border"
              style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />} Pratinjau
            </button>
            <button onClick={handlePreview}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border"
              style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              <Play className="w-3.5 h-3.5" fill="currentColor" /> Coba Sajikan
            </button>
            <button onClick={handleSave} disabled={!title.trim() || isSaving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 transition-all"
              style={{ background: "var(--color-brand)", color: "white" }}>
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {isSaving ? "Menyimpan..." : "Simpan Lagu"}
            </button>
          </div>
        </div>

        <div className={`grid gap-6 ${showPreview ? "grid-cols-5" : "grid-cols-3"}`}>
          {/* Detail */}
          <div className="col-span-2 space-y-4">
            <div className="rounded-xl border p-5 space-y-4" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
              <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>Detail Lagu</h2>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>Judul *</label>
                <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Kasih Yang Ajaib"
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                  style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>Artis / Penulis</label>
                <input value={artist} onChange={e => setArtist(e.target.value)} placeholder="Hillsong Worship"
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                  style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>Kategori</label>
                <select value={category} onChange={e => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                  style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}>
                  {["Kontemporer", "Himne", "Gospel", "Anak-Anak", "Natal", "Lainnya"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>Tag</label>
                <div className="flex gap-2">
                  <input value={tagInput} onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag() } }}
                    placeholder="pujian, penyembahan..."
                    className="flex-1 px-3 py-2 rounded-lg text-sm border outline-none"
                    style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
                  <button onClick={addTag} className="px-3 py-2 rounded-lg text-sm"
                    style={{ background: "var(--color-surface-4)", color: "var(--color-text-secondary)" }}>
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map(t => (
                      <span key={t} className="flex items-center gap-1 text-xs px-2 py-1 rounded-full"
                        style={{ background: "var(--color-brand-glow)", color: "var(--color-brand)" }}>
                        {t}
                        <button onClick={() => setTags(tags.filter(x => x !== t))}><X className="w-3 h-3" /></button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>Tambah Seksi</p>
              <div className="flex flex-wrap gap-1.5">
                {SECTION_INSERTS.map(s => (
                  <button key={s} onClick={() => setLyricsRaw(prev => prev + `\n\n${s}\nLirik di sini...`)}
                    className="text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-all"
                    style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                    + {s}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Editor */}
          <div className="col-span-2">
            <div className="rounded-xl border flex flex-col overflow-hidden"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-2">
                  <Music2 className="w-4 h-4" style={{ color: "var(--color-brand)" }} />
                  <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Editor Lirik</span>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: "var(--color-surface-4)", color: "var(--color-text-muted)" }}>
                  VERSE 1 · CHORUS · BRIDGE · PRE-CHORUS
                </span>
              </div>
              <textarea value={lyricsRaw} onChange={e => setLyricsRaw(e.target.value)}
                className="flex-1 p-4 text-sm outline-none resize-none leading-relaxed"
                rows={22}
                style={{ background: "var(--color-surface-1)", color: "var(--color-text-primary)", fontFamily: "var(--font-mono)", minHeight: 460 }} />
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="col-span-1">
              <div className="rounded-xl border p-4 space-y-2" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>
                  Pratinjau Slide · {slideCount}
                </p>
                {sections.map((section, i) => (
                  <div key={i} className="rounded-lg p-3 border" style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: SECTION_COLORS[section.type as SectionType] ?? "#888" }} />
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: SECTION_COLORS[section.type as SectionType] ?? "#888" }}>
                        {section.label}
                      </p>
                      <span className="ml-auto text-[9px]" style={{ color: "var(--color-text-muted)" }}>
                        {Math.ceil(section.lines.length / 4)} slide
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: "var(--color-text-secondary)" }}>
                      {section.lines.slice(0, 4).join("\n")}{section.lines.length > 4 ? "\n…" : ""}
                    </p>
                  </div>
                ))}
                {sections.length === 0 && (
                  <p className="text-xs text-center py-4" style={{ color: "var(--color-text-muted)" }}>
                    Tambahkan header seperti VERSE 1, CHORUS, BRIDGE
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

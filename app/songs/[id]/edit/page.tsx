"use client"

import { AppShell } from "@/components/layout/AppShell"
import { useSongStore } from "@/stores/songStore"
import { useSongsInit } from "@/hooks/useSongs"
import { usePresentationStore } from "@/stores/presentationStore"
import { parseLyrics, lyricsToSlides, SECTION_COLORS } from "@/lib/lyrics/parser"
import { ArrowLeft, Save, Trash2, Play, Eye, EyeOff, Star, Loader2 } from "lucide-react"
import Link from "next/link"
import { useRouter, useParams } from "next/navigation"
import { useState, useEffect } from "react"
import type { SectionType } from "@/types"

const SECTION_INSERTS = ["VERSE 1", "VERSE 2", "PRE-CHORUS", "CHORUS", "BRIDGE", "TAG", "OUTRO"]

export default function EditSongPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { songs } = useSongStore()
  const { editSong, removeSong } = useSongsInit()
  const { setQueue, setMode } = usePresentationStore()

  const song = songs.find(s => s.id === id)

  const [title, setTitle]     = useState("")
  const [artist, setArtist]   = useState("")
  const [category, setCat]    = useState("Kontemporer")
  const [tagsRaw, setTagsRaw] = useState("")
  const [lyricsRaw, setLyrics] = useState("")
  const [showPreview, setShowPreview] = useState(true)
  const [saving, setSaving]   = useState(false)
  const [saved, setSaved]     = useState(false)
  const [inited, setInited]   = useState(false)

  useEffect(() => {
    if (song && !inited) {
      setTitle(song.title)
      setArtist(song.artist ?? "")
      setCat(song.category ?? "Kontemporer")
      setTagsRaw(song.tags.join(", "))
      setLyrics(song.lyrics_raw)
      setInited(true)
    }
  }, [song?.id, inited])

  if (!song) return (
    <AppShell>
      <div className="p-6 flex items-center gap-3">
        <Link href="/songs" className="w-8 h-8 rounded-lg flex items-center justify-center border"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <p className="text-sm" style={{ color: "var(--color-text-muted)" }}>
          Lagu tidak ditemukan. <Link href="/songs" style={{ color: "var(--color-brand)" }}>Kembali ke perpustakaan</Link>
        </p>
      </div>
    </AppShell>
  )

  const sections = parseLyrics(lyricsRaw)
  const slideCount = sections.reduce((a, s) => a + Math.ceil(s.lines.length / 4), 0)
  const tags = tagsRaw.split(",").map(t => t.trim().toLowerCase()).filter(Boolean)

  const handleSave = async () => {
    setSaving(true)
    await editSong(id, { title, artist: artist || undefined, category, tags, lyrics_raw: lyricsRaw })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleDelete = async () => {
    if (!confirm(`Hapus "${song.title}"? Tindakan ini tidak dapat dibatalkan.`)) return
    await removeSong(id)
    router.push("/songs")
  }

  const handlePresent = () => {
    setQueue(lyricsToSlides(lyricsRaw, id), 0)
    setMode("live")
  }

  return (
    <AppShell>
      <div className="p-6 max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/songs" className="w-8 h-8 rounded-lg flex items-center justify-center border"
              style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>
                {title || "Edit Lagu"}
              </h1>
              <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
                {sections.length} seksi · {slideCount} slide
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowPreview(v => !v)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs border"
              style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />} Pratinjau
            </button>
            <button onClick={handlePresent}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold border"
              style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              <Play className="w-3.5 h-3.5" fill="currentColor" /> Sajikan
            </button>
            <button onClick={handleDelete}
              className="w-8 h-8 rounded-lg flex items-center justify-center border"
              style={{ background: "var(--color-danger-dim)", borderColor: "var(--color-danger)", color: "var(--color-danger)" }}>
              <Trash2 className="w-4 h-4" />
            </button>
            <button onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold disabled:opacity-60 transition-all"
              style={{ background: saved ? "var(--color-live)" : "var(--color-brand)", color: "white" }}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              {saving ? "Menyimpan…" : saved ? "Tersimpan ✓" : "Simpan"}
            </button>
          </div>
        </div>

        <div className={`grid gap-6 ${showPreview ? "grid-cols-5" : "grid-cols-3"}`}>
          {/* Details */}
          <div className="col-span-2 space-y-4">
            <div className="rounded-xl border p-5 space-y-4"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold" style={{ color: "var(--color-text-secondary)" }}>Detail Lagu</h2>
                {song.favorite && <Star className="w-4 h-4" style={{ color: "var(--color-warn)" }} fill="currentColor" />}
              </div>
              {[
                { lbl: "Judul *", val: title, set: setTitle, ph: "Kasih Yang Ajaib" },
                { lbl: "Artis / Penulis", val: artist, set: setArtist, ph: "Hillsong Worship" },
              ].map(({ lbl, val, set, ph }) => (
                <div key={lbl}>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>{lbl}</label>
                  <input value={val} onChange={e => set(e.target.value)} placeholder={ph}
                    className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                    style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
                </div>
              ))}
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>Kategori</label>
                <select value={category} onChange={e => setCat(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                  style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }}>
                  {["Kontemporer","Himne","Gospel","Anak-Anak","Natal","Lainnya"].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>
                  Tag <span className="font-normal">(pisah dengan koma)</span>
                </label>
                <input value={tagsRaw} onChange={e => setTagsRaw(e.target.value)}
                  placeholder="pujian, penyembahan, kasih"
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                  style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-2">
                    {tags.map(t => (
                      <span key={t} className="text-[10px] px-2 py-0.5 rounded-full font-medium"
                        style={{ background: "var(--color-brand-glow)", color: "var(--color-brand)" }}>{t}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-xl border p-4" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>Tambah Seksi</p>
              <div className="flex flex-wrap gap-1.5">
                {SECTION_INSERTS.map(s => (
                  <button key={s} onClick={() => setLyrics(p => p + `\n\n${s}\nLirik di sini...`)}
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
                <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Editor Lirik</span>
                <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: "var(--color-surface-4)", color: "var(--color-text-muted)" }}>
                  VERSE 1 · CHORUS · BRIDGE · PRE-CHORUS
                </span>
              </div>
              <textarea value={lyricsRaw} onChange={e => setLyrics(e.target.value)}
                className="flex-1 p-4 text-sm outline-none resize-none leading-relaxed"
                rows={24}
                style={{ background: "var(--color-surface-1)", color: "var(--color-text-primary)", fontFamily: "var(--font-mono)", minHeight: 460 }} />
            </div>
          </div>

          {/* Preview */}
          {showPreview && (
            <div className="col-span-1">
              <div className="rounded-xl border p-4 space-y-2" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                <p className="text-[10px] font-bold uppercase tracking-wider mb-3" style={{ color: "var(--color-text-muted)" }}>
                  Pratinjau · {slideCount} slide
                </p>
                {sections.map((s, i) => (
                  <div key={i} className="rounded-lg p-3 border" style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)" }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ background: SECTION_COLORS[s.type as SectionType] ?? "#888" }} />
                      <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: SECTION_COLORS[s.type as SectionType] ?? "#888" }}>
                        {s.label}
                      </p>
                      <span className="ml-auto text-[9px]" style={{ color: "var(--color-text-muted)" }}>
                        {Math.ceil(s.lines.length / 4)}s
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed whitespace-pre-line" style={{ color: "var(--color-text-secondary)" }}>
                      {s.lines.slice(0, 4).join("\n")}{s.lines.length > 4 ? "\n…" : ""}
                    </p>
                  </div>
                ))}
                {sections.length === 0 && (
                  <p className="text-xs text-center py-4" style={{ color: "var(--color-text-muted)" }}>
                    Tidak ada seksi terdeteksi
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

"use client"

import { AppShell } from "@/components/layout/AppShell"
import { usePresentationStore } from "@/stores/presentationStore"
import { uploadMedia, fetchMedia, deleteMedia } from "@/lib/supabase/media"
import {
  Image as ImageIcon, Video, Film, Search, Upload,
  Play, Trash2, X, Loader2, CheckCircle2, AlertCircle,
} from "lucide-react"
import { useState, useEffect, useRef, useCallback } from "react"
import type { Media } from "@/types"

const DEMO_MEDIA: Media[] = [
  { id: "m1", name: "Worship Loop — Cahaya Biru", type: "loop", path: "", url: undefined, tags: ["background", "worship"], size_bytes: 12_000_000, created_at: new Date().toISOString() },
  { id: "m2", name: "Salib Matahari Terbenam", type: "image", path: "", url: undefined, tags: ["background", "salib"], size_bytes: 2_400_000, created_at: new Date().toISOString() },
  { id: "m3", name: "Logo Gereja Putih", type: "image", path: "", url: undefined, tags: ["logo"], size_bytes: 800_000, created_at: new Date().toISOString() },
  { id: "m4", name: "Hitung Mundur 5 Menit", type: "countdown", path: "", url: undefined, tags: ["timer", "pra-ibadah"], size_bytes: 45_000_000, created_at: new Date().toISOString() },
  { id: "m5", name: "Loop Alam Pegunungan", type: "loop", path: "", url: undefined, tags: ["background", "alam"], size_bytes: 28_000_000, created_at: new Date().toISOString() },
  { id: "m6", name: "Berkas Sinar Cahaya", type: "video", path: "", url: undefined, tags: ["background", "cahaya"], size_bytes: 18_000_000, created_at: new Date().toISOString() },
  { id: "m7", name: "Matahari Terbit Gunung", type: "image", path: "", url: undefined, tags: ["background", "alam"], size_bytes: 3_100_000, created_at: new Date().toISOString() },
  { id: "m8", name: "Loop Bokeh Gelap", type: "loop", path: "", url: undefined, tags: ["background", "gelap"], size_bytes: 22_000_000, created_at: new Date().toISOString() },
]

const TYPE_META: Record<string, { icon: React.ElementType; color: string; label: string; thumb: string }> = {
  image:     { icon: ImageIcon, color: "#06B6D4", label: "Gambar",  thumb: "#0a1a2a" },
  video:     { icon: Video,     color: "#F59E0B", label: "Video",   thumb: "#1a1000" },
  loop:      { icon: Film,      color: "#22C55E", label: "Loop",    thumb: "#001a0a" },
  countdown: { icon: Film,      color: "#EC4899", label: "Hitung Mundur", thumb: "#1a001a" },
}

function formatBytes(b: number | null | undefined) {
  if (!b) return "—"
  if (b > 1_000_000) return `${(b / 1_000_000).toFixed(1)} MB`
  return `${(b / 1_000).toFixed(0)} KB`
}

type UploadStatus = { name: string; progress: "uploading" | "done" | "error" }

const hasSupabase = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxx")

export default function MediaPage() {
  const { setBackground } = usePresentationStore()
  const [items, setItems] = useState<Media[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState("")
  const [filterType, setFilterType] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [uploads, setUploads] = useState<UploadStatus[]>([])
  const [tagInputs, setTagInputs] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const load = async () => {
      if (hasSupabase()) {
        const data = await fetchMedia()
        setItems(data.length > 0 ? data : DEMO_MEDIA)
      } else {
        setItems(DEMO_MEDIA)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleFiles = useCallback(async (files: FileList | null) => {
    if (!files || files.length === 0) return
    const arr = Array.from(files).filter(f => f.type.startsWith("image") || f.type.startsWith("video"))
    if (!arr.length) return

    setUploads(arr.map(f => ({ name: f.name, progress: "uploading" })))

    for (const file of arr) {
      if (!hasSupabase()) {
        // Local preview fallback
        const url = URL.createObjectURL(file)
        const fake: Media = {
          id: `local-${Date.now()}`,
          name: file.name.replace(/\.[^/.]+$/, ""),
          type: file.type.startsWith("video") ? "video" : "image",
          path: url, url,
          size_bytes: file.size,
          tags: [],
          created_at: new Date().toISOString(),
        }
        setItems(prev => [fake, ...prev])
        setUploads(prev => prev.map(u => u.name === file.name ? { ...u, progress: "done" } : u))
      } else {
        const result = await uploadMedia(file)
        if (result) {
          setItems(prev => [result, ...prev])
          setUploads(prev => prev.map(u => u.name === file.name ? { ...u, progress: "done" } : u))
        } else {
          setUploads(prev => prev.map(u => u.name === file.name ? { ...u, progress: "error" } : u))
        }
      }
    }
    setTimeout(() => setUploads([]), 3000)
  }, [])

  const handleDelete = async (item: Media) => {
    if (!confirm(`Hapus "${item.name}"?`)) return
    setItems(prev => prev.filter(m => m.id !== item.id))
    if (hasSupabase() && item.path) await deleteMedia(item.id, item.path)
  }

  const handleSetBackground = (item: Media) => {
    setBackground(item)
    setSelectedId(item.id)
  }

  const filtered = items.filter(m => {
    const q = query.toLowerCase()
    return (!q || m.name.toLowerCase().includes(q) || m.tags.some(t => t.includes(q)))
      && (!filterType || m.type === filterType)
  })

  return (
    <AppShell>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>Perpustakaan Media</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {loading ? "Memuat..." : `${items.length} aset`}
            </p>
          </div>
          <button onClick={() => fileRef.current?.click()}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={{ background: "var(--color-brand)", color: "white" }}>
            <Upload className="w-4 h-4" /> Upload
          </button>
          <input ref={fileRef} type="file" multiple accept="image/*,video/*" className="hidden"
            onChange={e => handleFiles(e.target.files)} />
        </div>

        {/* Upload status */}
        {uploads.length > 0 && (
          <div className="space-y-2">
            {uploads.map(u => (
              <div key={u.name} className="flex items-center gap-3 px-4 py-2.5 rounded-xl border"
                style={{
                  background: u.progress === "error" ? "var(--color-danger-dim)" : "var(--color-surface-2)",
                  borderColor: u.progress === "done" ? "var(--color-live)" : u.progress === "error" ? "var(--color-danger)" : "var(--color-border)",
                }}>
                {u.progress === "uploading" && <Loader2 className="w-4 h-4 animate-spin shrink-0" style={{ color: "var(--color-brand)" }} />}
                {u.progress === "done" && <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--color-live)" }} />}
                {u.progress === "error" && <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "var(--color-danger)" }} />}
                <span className="text-sm truncate" style={{ color: "var(--color-text-secondary)" }}>{u.name}</span>
                <span className="text-xs ml-auto shrink-0" style={{ color: "var(--color-text-muted)" }}>
                  {u.progress === "uploading" ? "Mengupload..." : u.progress === "done" ? "Selesai" : "Gagal"}
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Drop zone */}
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={e => { e.preventDefault(); setIsDragging(false); handleFiles(e.dataTransfer.files) }}
          onClick={() => fileRef.current?.click()}
          className="border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer"
          style={{
            borderColor: isDragging ? "var(--color-brand)" : "var(--color-border)",
            background: isDragging ? "var(--color-brand-glow)" : "var(--color-surface-2)",
          }}>
          <Upload className="w-8 h-8 mx-auto mb-2" style={{ color: isDragging ? "var(--color-brand)" : "var(--color-text-muted)" }} />
          <p className="font-medium text-sm" style={{ color: isDragging ? "var(--color-brand)" : "var(--color-text-secondary)" }}>
            {isDragging ? "Lepaskan untuk upload" : "Seret gambar/video ke sini, atau klik untuk pilih file"}
          </p>
          <p className="text-xs mt-1" style={{ color: "var(--color-text-muted)" }}>JPG, PNG, MP4, MOV, WEBM hingga 500MB</p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
            <input value={query} onChange={e => setQuery(e.target.value)}
              placeholder="Cari media..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border outline-none"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
          </div>
          <button onClick={() => setFilterType(null)}
            className="px-3 py-2.5 rounded-lg text-sm border transition-all"
            style={{
              background: !filterType ? "var(--color-brand-glow)" : "var(--color-surface-2)",
              borderColor: !filterType ? "var(--color-brand)" : "var(--color-border)",
              color: !filterType ? "var(--color-brand)" : "var(--color-text-secondary)",
            }}>Semua</button>
          {Object.entries(TYPE_META).map(([type, { label, color }]) => (
            <button key={type} onClick={() => setFilterType(filterType === type ? null : type)}
              className="px-3 py-2.5 rounded-lg text-sm border transition-all"
              style={{
                background: filterType === type ? `${color}15` : "var(--color-surface-2)",
                borderColor: filterType === type ? color : "var(--color-border)",
                color: filterType === type ? color : "var(--color-text-secondary)",
              }}>
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--color-brand)" }} />
            <span className="ml-3 text-sm" style={{ color: "var(--color-text-muted)" }}>Memuat media...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map(m => {
              const { icon: Icon, color, label, thumb } = TYPE_META[m.type] ?? TYPE_META.image
              const isSel = selectedId === m.id
              return (
                <div key={m.id}
                  className="group rounded-xl border overflow-hidden transition-all"
                  style={{
                    background: isSel ? "var(--color-brand-glow)" : "var(--color-surface-2)",
                    borderColor: isSel ? "var(--color-border-active)" : "var(--color-border)",
                  }}>
                  {/* Thumbnail */}
                  <div className="aspect-video relative overflow-hidden flex items-center justify-center"
                    style={{ background: thumb }}>
                    {m.url && m.type === "image" ? (
                      <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                    ) : m.url && m.type === "video" ? (
                      <video src={m.url} className="w-full h-full object-cover" muted playsInline />
                    ) : (
                      <Icon className="w-10 h-10 opacity-25" style={{ color }} />
                    )}

                    {/* Overlay actions */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2"
                      style={{ background: "rgba(0,0,0,0.55)" }}>
                      <button onClick={() => handleSetBackground(m)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: "var(--color-brand)", color: "white" }} title="Jadikan background">
                        <Play className="w-3 h-3" fill="currentColor" /> Background
                      </button>
                      <button onClick={() => handleDelete(m)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ background: "var(--color-danger-dim)", color: "var(--color-danger)" }} title="Hapus">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Type badge */}
                    <span className="absolute top-2 left-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded"
                      style={{ background: `${color}25`, color }}>
                      {label}
                    </span>

                    {isSel && (
                      <span className="absolute top-2 right-2 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded animate-pulse-live"
                        style={{ background: "var(--color-live-dim)", color: "var(--color-live)" }}>
                        BG AKTIF
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2.5">
                    <p className="text-xs font-medium truncate mb-1" style={{ color: "var(--color-text-primary)" }}>{m.name}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1 flex-wrap">
                        {m.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="text-[9px] px-1 py-0.5 rounded"
                            style={{ background: "var(--color-surface-4)", color: "var(--color-text-muted)" }}>
                            {tag}
                          </span>
                        ))}
                      </div>
                      <span className="text-[9px]" style={{ color: "var(--color-text-muted)" }}>{formatBytes(m.size_bytes)}</span>
                    </div>
                  </div>
                </div>
              )
            })}

            {filtered.length === 0 && !loading && (
              <div className="col-span-4 text-center py-16 rounded-xl border"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}>
                <ImageIcon className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--color-text-muted)" }} />
                <p style={{ color: "var(--color-text-secondary)" }}>Tidak ada media ditemukan</p>
                <button onClick={() => fileRef.current?.click()}
                  className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: "var(--color-brand)", color: "white" }}>
                  Upload Pertama
                </button>
              </div>
            )}
          </div>
        )}

        {/* Supabase note */}
        {!hasSupabase() && (
          <p className="text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
            Media tersimpan sementara di browser. Hubungkan Supabase untuk menyimpan permanen.
          </p>
        )}
      </div>
    </AppShell>
  )
}

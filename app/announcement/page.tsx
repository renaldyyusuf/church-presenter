"use client"

import { AppShell } from "@/components/layout/AppShell"
import { usePresentationStore } from "@/stores/presentationStore"
import {
  Megaphone, Plus, Play, Trash2, Edit2, Save, X,
  Clock, ChevronUp, ChevronDown,
} from "lucide-react"
import { useState } from "react"
import type { Slide } from "@/types"

interface Announcement {
  id: string
  title: string
  content: string
  color: string
  createdAt: string
}

const COLORS = ["#7C6FFD", "#22C55E", "#F59E0B", "#06B6D4", "#EC4899", "#EF4444"]

const DEMO: Announcement[] = [
  {
    id: "a1",
    title: "Persekutuan Doa",
    content: "Persekutuan Doa Gereja\nSetiap Rabu Malam\nPukul 19:00 WIB\nGedung Gereja Lantai 2",
    color: "#7C6FFD",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a2",
    title: "Selamat Datang",
    content: "Selamat Datang di Kebaktian Minggu!\nKami bersukacita atas kehadiran Anda.\nTuhan Memberkati",
    color: "#22C55E",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a3",
    title: "Kelas Baptisan",
    content: "Kelas Persiapan Baptisan\nMulai 15 Juni 2025\nHubungi sekretariat gereja\nuntuk pendaftaran",
    color: "#F59E0B",
    createdAt: new Date().toISOString(),
  },
  {
    id: "a4",
    title: "Persembahan",
    content: "Persembahan dapat diserahkan\nmelalui amplop yang tersedia\natau transfer ke rekening gereja\nBCA: 123-456-7890",
    color: "#06B6D4",
    createdAt: new Date().toISOString(),
  },
]

interface AnnouncementCardProps {
  ann: Announcement
  onEdit: (ann: Announcement) => void
  onDelete: (id: string) => void
  onPresent: (ann: Announcement) => void
  onMoveUp: (id: string) => void
  onMoveDown: (id: string) => void
  isFirst: boolean
  isLast: boolean
  isActive: boolean
}

function AnnouncementCard({ ann, onEdit, onDelete, onPresent, onMoveUp, onMoveDown, isFirst, isLast, isActive }: AnnouncementCardProps) {
  return (
    <div className="group rounded-xl border overflow-hidden transition-all"
      style={{
        background: isActive ? "var(--color-brand-glow)" : "var(--color-surface-2)",
        borderColor: isActive ? "var(--color-border-active)" : "var(--color-border)",
        borderLeft: `3px solid ${ann.color}`,
      }}>
      <div className="flex items-start gap-3 px-4 py-4">
        {/* Color dot + order controls */}
        <div className="flex flex-col items-center gap-1 shrink-0 pt-0.5">
          <div className="w-3 h-3 rounded-full" style={{ background: ann.color }} />
          <button onClick={() => onMoveUp(ann.id)} disabled={isFirst}
            className="w-5 h-5 rounded flex items-center justify-center disabled:opacity-20 transition-all"
            style={{ color: "var(--color-text-muted)" }}>
            <ChevronUp className="w-3 h-3" />
          </button>
          <button onClick={() => onMoveDown(ann.id)} disabled={isLast}
            className="w-5 h-5 rounded flex items-center justify-center disabled:opacity-20 transition-all"
            style={{ color: "var(--color-text-muted)" }}>
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
              {ann.title}
            </p>
            {isActive && (
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse-live"
                style={{ background: "var(--color-live-dim)", color: "var(--color-live)" }}>
                LIVE
              </span>
            )}
          </div>
          {/* Preview of content */}
          <div className="rounded-lg px-3 py-2.5 mt-2"
            style={{ background: "var(--color-surface-1)", border: "1px solid var(--color-border)" }}>
            <p className="text-sm leading-relaxed whitespace-pre-line"
              style={{ color: "var(--color-text-secondary)" }}>
              {ann.content}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-1.5 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onPresent(ann)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: "var(--color-brand)", color: "white" }}>
            <Play className="w-3 h-3" fill="currentColor" /> Sajikan
          </button>
          <button onClick={() => onEdit(ann)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border justify-center"
            style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
            <Edit2 className="w-3 h-3" /> Edit
          </button>
          <button onClick={() => onDelete(ann.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs justify-center"
            style={{ color: "var(--color-danger)" }}>
            <Trash2 className="w-3 h-3" /> Hapus
          </button>
        </div>
      </div>
    </div>
  )
}

interface EditFormProps {
  initial: Partial<Announcement>
  onSave: (ann: Omit<Announcement, "id" | "createdAt">) => void
  onCancel: () => void
}

function EditForm({ initial, onSave, onCancel }: EditFormProps) {
  const [title, setTitle] = useState(initial.title ?? "")
  const [content, setContent] = useState(initial.content ?? "")
  const [color, setColor] = useState(initial.color ?? COLORS[0])

  return (
    <div className="rounded-xl border p-5 space-y-4"
      style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border-active)" }}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
          {initial.id ? "Edit Pengumuman" : "Pengumuman Baru"}
        </p>
        <button onClick={onCancel}><X className="w-4 h-4" style={{ color: "var(--color-text-muted)" }} /></button>
      </div>

      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>Judul</label>
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Persekutuan Doa"
          className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
          style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
      </div>

      <div>
        <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>
          Isi Pengumuman
          <span className="ml-2 font-normal" style={{ color: "var(--color-text-muted)" }}>(baris baru = baris baru di layar)</span>
        </label>
        <textarea value={content} onChange={e => setContent(e.target.value)}
          rows={5}
          placeholder={"Setiap Rabu Malam\nPukul 19:00 WIB\nGedung Gereja Lantai 2"}
          className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none resize-none"
          style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)", fontFamily: "var(--font-mono)" }} />
      </div>

      <div>
        <label className="text-xs font-medium mb-2 block" style={{ color: "var(--color-text-muted)" }}>Warna Aksen</label>
        <div className="flex items-center gap-2">
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)}
              className="w-7 h-7 rounded-lg transition-all"
              style={{
                background: c,
                outline: color === c ? `2px solid ${c}` : "none",
                outlineOffset: 2,
                transform: color === c ? "scale(1.15)" : "scale(1)",
              }} />
          ))}
          <div className="ml-2 w-7 h-7 rounded-lg border flex items-center justify-center overflow-hidden"
            style={{ borderColor: "var(--color-border)" }}>
            <input type="color" value={color} onChange={e => setColor(e.target.value)}
              className="w-10 h-10 border-0 p-0 cursor-pointer scale-125" />
          </div>
        </div>
      </div>

      {/* Live preview */}
      <div>
        <label className="text-xs font-medium mb-2 block" style={{ color: "var(--color-text-muted)" }}>Pratinjau Layar</label>
        <div className="rounded-lg overflow-hidden aspect-video flex items-center justify-center relative"
          style={{ background: "radial-gradient(ellipse at 25% 35%, #0f0530 0%, #050510 45%, #030a06 100%)" }}>
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)" }} />
          <div style={{ position: "relative", zIndex: 1, textAlign: "center", padding: "0 10%" }}>
            <p style={{
              color: color, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
              textTransform: "uppercase", marginBottom: 10, opacity: 0.8,
              textShadow: "0 2px 8px rgba(0,0,0,0.9)",
            }}>{title || "JUDUL PENGUMUMAN"}</p>
            <p style={{
              color: "#fff", fontSize: 14, fontWeight: 600, lineHeight: 1.5,
              whiteSpace: "pre-line", textShadow: "0 2px 12px rgba(0,0,0,0.95)",
            }}>{content || "Isi pengumuman\nakan tampil di sini"}</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 pt-1">
        <button onClick={onCancel}
          className="flex-1 py-2.5 rounded-lg text-sm border font-medium"
          style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
          Batal
        </button>
        <button onClick={() => { if (title.trim() && content.trim()) onSave({ title, content, color }) }}
          disabled={!title.trim() || !content.trim()}
          className="flex-1 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 disabled:opacity-40"
          style={{ background: "var(--color-brand)", color: "white" }}>
          <Save className="w-4 h-4" /> Simpan
        </button>
      </div>
    </div>
  )
}

export default function AnnouncementPage() {
  const { setQueue, setMode, currentSlide } = usePresentationStore()
  const [items, setItems] = useState<Announcement[]>(DEMO)
  const [editing, setEditing] = useState<Announcement | null | "new">(null)
  const [activeId, setActiveId] = useState<string | null>(null)

  const handlePresent = (ann: Announcement) => {
    setActiveId(ann.id)
    const slide: Slide = {
      id: `ann-${ann.id}`,
      content: ann.content,
      section: ann.title,
      sourceType: "announcement",
      order: 0,
    }
    setQueue([slide], 0)
    setMode("live")
  }

  const handlePresentAll = () => {
    const slides: Slide[] = items.map((ann, i) => ({
      id: `ann-${ann.id}`,
      content: ann.content,
      section: ann.title,
      sourceType: "announcement",
      order: i,
    }))
    setQueue(slides, 0)
    setMode("live")
  }

  const handleSave = (data: Omit<Announcement, "id" | "createdAt">) => {
    if (editing === "new") {
      setItems(prev => [...prev, { ...data, id: `a-${Date.now()}`, createdAt: new Date().toISOString() }])
    } else if (editing) {
      setItems(prev => prev.map(a => a.id === editing.id ? { ...a, ...data } : a))
    }
    setEditing(null)
  }

  const handleDelete = (id: string) => {
    if (!confirm("Hapus pengumuman ini?")) return
    setItems(prev => prev.filter(a => a.id !== id))
    if (activeId === id) setActiveId(null)
  }

  const moveItem = (id: string, dir: "up" | "down") => {
    setItems(prev => {
      const arr = [...prev]
      const i = arr.findIndex(a => a.id === id)
      const j = dir === "up" ? i - 1 : i + 1
      if (j < 0 || j >= arr.length) return arr
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
      return arr
    })
  }

  return (
    <AppShell>
      <div className="p-6 max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>Pengumuman</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {items.length} pengumuman siap disajikan
            </p>
          </div>
          <div className="flex items-center gap-2">
            {items.length > 1 && (
              <button onClick={handlePresentAll}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border"
                style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                <Play className="w-3.5 h-3.5" fill="currentColor" /> Sajikan Semua
              </button>
            )}
            <button onClick={() => setEditing("new")}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ background: "var(--color-brand)", color: "white" }}>
              <Plus className="w-4 h-4" /> Tambah
            </button>
          </div>
        </div>

        {/* New/edit form */}
        {editing !== null && (
          <EditForm
            initial={editing === "new" ? {} : editing}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
          />
        )}

        {/* Items */}
        <div className="space-y-3">
          {items.map((ann, i) => (
            <AnnouncementCard
              key={ann.id}
              ann={ann}
              isFirst={i === 0}
              isLast={i === items.length - 1}
              isActive={activeId === ann.id}
              onEdit={setEditing}
              onDelete={handleDelete}
              onPresent={handlePresent}
              onMoveUp={(id) => moveItem(id, "up")}
              onMoveDown={(id) => moveItem(id, "down")}
            />
          ))}
          {items.length === 0 && (
            <div className="text-center py-16 rounded-xl border"
              style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}>
              <Megaphone className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--color-text-muted)" }} />
              <p style={{ color: "var(--color-text-secondary)" }}>Belum ada pengumuman</p>
              <button onClick={() => setEditing("new")}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: "var(--color-brand)", color: "white" }}>
                Buat Pengumuman Pertama
              </button>
            </div>
          )}
        </div>
      </div>
    </AppShell>
  )
}

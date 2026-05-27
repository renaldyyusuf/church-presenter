"use client"

import { AppShell } from "@/components/layout/AppShell"
import { useServiceStore } from "@/stores/serviceStore"
import { useSongStore } from "@/stores/songStore"
import { useSongsInit } from "@/hooks/useSongs"
import { usePresentationStore } from "@/stores/presentationStore"
import { lyricsToSlides } from "@/lib/lyrics/parser"
import { DEMO_SONGS } from "@/lib/data/demo"
import { fetchOrCreateTodayService, fetchServiceItems, upsertServiceItems, deleteServiceItem } from "@/lib/supabase/services"
import {
  Music2, BookOpen, Video, Image, Megaphone, Plus, GripVertical,
  Play, Trash2, Clock, ChevronDown, LayoutList, Edit2, Save, Loader2,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"
import type { ServiceItem, ServiceItemType, Service } from "@/types"

const ITEM_META: Record<ServiceItemType, { icon: React.ElementType; color: string; label: string }> = {
  song:         { icon: Music2,    color: "#7C6FFD", label: "Lagu" },
  bible:        { icon: BookOpen,  color: "#22C55E", label: "Alkitab" },
  video:        { icon: Video,     color: "#F59E0B", label: "Video" },
  image:        { icon: Image,     color: "#06B6D4", label: "Gambar" },
  announcement: { icon: Megaphone, color: "#EC4899", label: "Pengumuman" },
}

const DEMO_ITEMS: ServiceItem[] = [
  { id: "si-1", service_id: "local", type: "song", label: "Betapa Baiknya Tuhan", notes: "Pembukaan ibadah", item_order: 1, metadata: { songId: "demo-2" } },
  { id: "si-2", service_id: "local", type: "announcement", label: "Sambutan & Pengumuman", notes: "", item_order: 2, metadata: {} },
  { id: "si-3", service_id: "local", type: "song", label: "Kasih Yang Ajaib", notes: "Pujian jemaat", item_order: 3, metadata: { songId: "demo-1" } },
  { id: "si-4", service_id: "local", type: "bible", label: "Yohanes 3:16 — Pembacaan Alkitab", notes: "Pendeta baca", item_order: 4, metadata: {} },
  { id: "si-5", service_id: "local", type: "song", label: "Betapa Indah NamaMu", notes: "Set penyembahan", item_order: 5, metadata: { songId: "demo-3" } },
  { id: "si-6", service_id: "local", type: "announcement", label: "Persembahan", notes: "", item_order: 6, metadata: {} },
  { id: "si-7", service_id: "local", type: "song", label: "10.000 Alasan", notes: "Lagu penutup", item_order: 7, metadata: { songId: "demo-5" } },
]

const hasSupabase = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxx")

export default function ServicePage() {
  const { items, setItems, activeItemId, setActiveItem, addItem, removeItem, updateItem } = useServiceStore()
  const { songs } = useSongStore()
  const { loading: songsLoading } = useSongsInit()
  const { setQueue, setMode } = usePresentationStore()

  const [service, setService] = useState<Service | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [dragging, setDragging] = useState<string | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [showAddMenu, setShowAddMenu] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editLabel, setEditLabel] = useState("")
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const serviceItems = items.length > 0 ? items : DEMO_ITEMS

  useEffect(() => {
    const load = async () => {
      if (hasSupabase()) {
        const svc = await fetchOrCreateTodayService()
        setService(svc)
        const its = await fetchServiceItems(svc.id)
        setItems(its.length > 0 ? its : DEMO_ITEMS.map(i => ({ ...i, service_id: svc.id })))
      } else {
        setItems(DEMO_ITEMS)
      }
      setLoading(false)
    }
    load()
  }, [])

  // Auto-save debounced
  const autoSave = (newItems: ServiceItem[]) => {
    if (!hasSupabase() || !service) return
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    saveTimeoutRef.current = setTimeout(async () => {
      setSaving(true)
      await upsertServiceItems(newItems)
      setSaving(false)
    }, 1200)
  }

  const handleDragStart = (id: string) => setDragging(id)
  const handleDragOver = (e: React.DragEvent, id: string) => { e.preventDefault(); setDragOver(id) }
  const handleDrop = (targetId: string) => {
    if (!dragging || dragging === targetId) { setDragging(null); setDragOver(null); return }
    const arr = [...serviceItems]
    const from = arr.findIndex(i => i.id === dragging)
    const to = arr.findIndex(i => i.id === targetId)
    const [item] = arr.splice(from, 1)
    arr.splice(to, 0, item)
    const reordered = arr.map((i, idx) => ({ ...i, item_order: idx + 1 }))
    setItems(reordered)
    autoSave(reordered)
    setDragging(null); setDragOver(null)
  }

  const handleGoLive = (item: ServiceItem) => {
    setActiveItem(item.id)
    if (item.type === "song") {
      const songId = item.metadata?.songId as string | undefined
      const song = songId
        ? songs.find(s => s.id === songId)
        : songs.find(s => s.title === item.label || item.label.includes(s.title))
      if (song) { setQueue(lyricsToSlides(song.lyrics_raw, song.id), 0); setMode("live") }
    }
  }

  const handleAdd = (type: ServiceItemType) => {
    const label = `${ITEM_META[type].label} Baru`
    const newItem: ServiceItem = {
      id: `si-${Date.now()}`,
      service_id: service?.id ?? "local",
      type, label,
      notes: "",
      item_order: serviceItems.length + 1,
      metadata: {},
    }
    const next = [...serviceItems, newItem]
    setItems(next)
    autoSave(next)
    setShowAddMenu(false)
    setEditingId(newItem.id)
    setEditLabel(label)
  }

  const handleRemove = async (id: string) => {
    const next = serviceItems.filter(i => i.id !== id)
    setItems(next)
    if (hasSupabase()) await deleteServiceItem(id)
  }

  const saveEdit = (id: string) => {
    updateItem(id, { label: editLabel })
    const next = serviceItems.map(i => i.id === id ? { ...i, label: editLabel } : i)
    autoSave(next)
    setEditingId(null)
  }

  return (
    <AppShell>
      <div className="p-6 max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>Alur Ibadah</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {service?.name ?? new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {saving && (
              <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--color-text-muted)" }}>
                <Loader2 className="w-3 h-3 animate-spin" /> Menyimpan...
              </div>
            )}
            <div className="relative">
              <button onClick={() => setShowAddMenu(!showAddMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold border"
                style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                <Plus className="w-4 h-4" /> Tambah <ChevronDown className="w-3.5 h-3.5" />
              </button>
              {showAddMenu && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setShowAddMenu(false)} />
                  <div className="absolute right-0 top-full mt-1 rounded-xl border shadow-xl z-50 py-1.5 min-w-[180px]"
                    style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)" }}>
                    {(Object.entries(ITEM_META) as [ServiceItemType, typeof ITEM_META[ServiceItemType]][]).map(([type, { icon: Icon, color, label }]) => (
                      <button key={type} onClick={() => handleAdd(type)}
                        className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-all text-left hover:bg-white/5"
                        style={{ color: "var(--color-text-secondary)" }}>
                        <Icon className="w-4 h-4 shrink-0" style={{ color }} />{label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-4 px-4 py-3 rounded-xl border flex-wrap"
          style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
          <div className="flex items-center gap-2"><LayoutList className="w-3.5 h-3.5" style={{ color: "var(--color-text-secondary)" }} /><span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{serviceItems.length} item</span></div>
          <div className="flex items-center gap-2"><Music2 className="w-3.5 h-3.5" style={{ color: "var(--color-brand)" }} /><span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{serviceItems.filter(i => i.type === "song").length} lagu</span></div>
          <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5" style={{ color: "var(--color-text-secondary)" }} /><span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>~{serviceItems.length * 5} menit</span></div>
          <div className="ml-auto text-[10px]" style={{ color: "var(--color-text-muted)" }}>
            Seret untuk ubah urutan · Klik "Sajikan" untuk tampil
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--color-brand)" }} />
          </div>
        )}

        {/* Items */}
        {!loading && (
          <div className="space-y-1.5">
            {serviceItems.map((item, idx) => {
              const { icon: Icon, color, label: typeLabel } = ITEM_META[item.type] ?? ITEM_META.announcement
              const isActive = activeItemId === item.id
              const isDO = dragOver === item.id

              return (
                <div key={item.id}
                  draggable
                  onDragStart={() => handleDragStart(item.id)}
                  onDragOver={e => handleDragOver(e, item.id)}
                  onDrop={() => handleDrop(item.id)}
                  onDragEnd={() => { setDragging(null); setDragOver(null) }}
                  className="group rounded-xl border transition-all"
                  style={{
                    background: isActive ? "var(--color-brand-glow)" : isDO ? "var(--color-surface-4)" : "var(--color-surface-2)",
                    borderColor: isActive ? "var(--color-border-active)" : isDO ? "var(--color-brand)" : "var(--color-border)",
                    borderLeft: `3px solid ${isActive ? "var(--color-brand)" : color + "50"}`,
                    opacity: dragging === item.id ? 0.4 : 1,
                    cursor: "grab",
                  }}>
                  <div className="flex items-center gap-3 px-3 py-3.5">
                    <div className="flex items-center gap-1.5 shrink-0">
                      <GripVertical className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity" style={{ color: "var(--color-text-muted)" }} />
                      <span className="text-xs font-mono w-4 text-right" style={{ color: "var(--color-text-muted)" }}>{idx + 1}</span>
                    </div>

                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: `${color}12`, border: `1px solid ${color}22` }}>
                      <Icon className="w-4 h-4" style={{ color }} />
                    </div>

                    <div className="flex-1 min-w-0">
                      {editingId === item.id ? (
                        <div className="flex items-center gap-2">
                          <input autoFocus value={editLabel} onChange={e => setEditLabel(e.target.value)}
                            onBlur={() => saveEdit(item.id)}
                            onKeyDown={e => { if (e.key === "Enter") saveEdit(item.id); if (e.key === "Escape") setEditingId(null) }}
                            className="flex-1 text-sm font-medium bg-transparent outline-none border-b pb-0.5"
                            style={{ borderColor: "var(--color-brand)", color: "var(--color-text-primary)" }} />
                          <button onClick={() => saveEdit(item.id)}><Save className="w-3.5 h-3.5" style={{ color: "var(--color-brand)" }} /></button>
                        </div>
                      ) : (
                        <p className="text-sm font-medium truncate" style={{ color: "var(--color-text-primary)" }}>{item.label}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-semibold uppercase tracking-wide" style={{ color }}>{typeLabel}</span>
                        {item.notes && <span className="text-[10px] truncate" style={{ color: "var(--color-text-muted)" }}>· {item.notes}</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                      <button onClick={() => { setEditingId(item.id); setEditLabel(item.label) }}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ color: "var(--color-text-muted)" }}>
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleRemove(item.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center"
                        style={{ color: "var(--color-text-muted)" }}>
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleGoLive(item)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ml-1"
                        style={{ background: isActive ? "var(--color-live)" : "var(--color-brand)", color: "white" }}>
                        <Play className="w-3 h-3" fill="currentColor" />
                        {isActive ? "Live" : "Sajikan"}
                      </button>
                    </div>

                    {isActive && (
                      <span className="flex items-center gap-1.5 text-[10px] font-bold px-2 py-1 rounded-full shrink-0 animate-pulse-live"
                        style={{ background: "var(--color-live-dim)", color: "var(--color-live)" }}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current" /> LIVE
                      </span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </AppShell>
  )
}

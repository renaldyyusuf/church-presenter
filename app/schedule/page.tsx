"use client"

import { AppShell }              from "@/components/layout/AppShell"
import { useSongStore }          from "@/stores/songStore"
import { useSongsInit }          from "@/hooks/useSongs"
import { useServiceStore }       from "@/stores/serviceStore"
import { toast }                 from "@/components/ui/Toast"
import {
  Calendar, Plus, ChevronLeft, ChevronRight,
  Music2, BookOpen, Megaphone, Video, Image as ImageIcon,
  LayoutList, Edit2, Copy, Trash2, Clock, Check,
} from "lucide-react"
import { useState } from "react"
import type { ServiceItem, ServiceItemType } from "@/types"

function weekDays(base: Date): Date[] {
  const sunday = new Date(base)
  sunday.setDate(base.getDate() - base.getDay())
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(sunday); d.setDate(sunday.getDate() + i); return d
  })
}
function isoDate(d: Date) { return d.toISOString().split("T")[0] }
function makeId() { return `si-${Date.now()}-${Math.random().toString(36).slice(2)}` }
function planId() { return `plan-${Date.now()}` }

interface ServicePlan { id: string; name: string; date: string; items: ServiceItem[]; notes: string }

const ITEM_META: Record<ServiceItemType, { icon: React.ElementType; color: string; label: string }> = {
  song:         { icon: Music2,     color: "#7C6FFD", label: "Lagu" },
  bible:        { icon: BookOpen,   color: "#22C55E", label: "Alkitab" },
  video:        { icon: Video,      color: "#F59E0B", label: "Video" },
  image:        { icon: ImageIcon,  color: "#06B6D4", label: "Gambar" },
  announcement: { icon: Megaphone,  color: "#EC4899", label: "Pengumuman" },
}

const TEMPLATES: Omit<ServiceItem, "id" | "service_id">[] = [
  { type: "song",         label: "Pujian Pembukaan",    notes: "", item_order: 1, metadata: {} },
  { type: "announcement", label: "Sambutan & Doa Buka", notes: "", item_order: 2, metadata: {} },
  { type: "song",         label: "Pujian Jemaat",       notes: "", item_order: 3, metadata: {} },
  { type: "bible",        label: "Pembacaan Alkitab",   notes: "", item_order: 4, metadata: {} },
  { type: "song",         label: "Penyembahan",         notes: "", item_order: 5, metadata: {} },
  { type: "announcement", label: "Persembahan",         notes: "", item_order: 6, metadata: {} },
  { type: "song",         label: "Lagu Penutup",        notes: "", item_order: 7, metadata: {} },
]

const DAY_NAMES = ["Min","Sen","Sel","Rab","Kam","Jum","Sab"]

export default function SchedulePage() {
  useSongsInit()
  const { setItems, setActiveItem } = useServiceStore()

  const today   = new Date()
  const [anchor, setAnchor]   = useState(new Date())
  const [plans,  setPlans]    = useState<ServicePlan[]>([])
  const [selDate,setSelDate]  = useState(isoDate(today))
  const [creating,setCreating]= useState(false)
  const [newName, setNewName] = useState("")
  const [newNotes,setNewNotes]= useState("")
  const [editingPlan, setEditingPlan] = useState<string|null>(null)
  const [dragging,setDragging]= useState<string|null>(null)
  const [dragOver,setDragOver]= useState<string|null>(null)

  const days     = weekDays(anchor)
  const dayPlans = plans.filter(p => p.date === selDate)

  const createPlan = () => {
    const id = planId()
    const plan: ServicePlan = {
      id, name: newName.trim() || "Ibadah Minggu",
      date: selDate, notes: newNotes.trim(),
      items: TEMPLATES.map(t => ({ ...t, id: makeId(), service_id: id })),
    }
    setPlans(p => [...p, plan])
    setCreating(false); setNewName(""); setNewNotes("")
    toast.success("Rencana dibuat", plan.name)
  }

  const deletePlan = (id: string) => {
    if (!confirm("Hapus rencana ini?")) return
    setPlans(p => p.filter(x => x.id !== id))
    toast.success("Rencana dihapus")
  }

  const duplicatePlan = (plan: ServicePlan) => {
    const clone: ServicePlan = { ...plan, id: planId(), name: `${plan.name} (salinan)`, items: plan.items.map(i => ({ ...i, id: makeId() })) }
    setPlans(p => [...p, clone])
    toast.success("Rencana disalin", clone.name)
  }

  const sendToService = (plan: ServicePlan) => {
    setItems(plan.items); setActiveItem(null)
    toast.success("Dikirim ke Alur Ibadah", plan.name)
  }

  const reorderItem = (planId: string, from: string, to: string) => {
    setPlans(prev => prev.map(p => {
      if (p.id !== planId) return p
      const arr = [...p.items]
      const fi = arr.findIndex(i => i.id === from)
      const ti = arr.findIndex(i => i.id === to)
      const [item] = arr.splice(fi, 1); arr.splice(ti, 0, item)
      return { ...p, items: arr.map((i, idx) => ({ ...i, item_order: idx + 1 })) }
    }))
  }

  const addItem = (planId: string, type: ServiceItemType) => {
    const { label } = ITEM_META[type]
    setPlans(prev => prev.map(p => p.id !== planId ? p : {
      ...p, items: [...p.items, { id: makeId(), service_id: planId, type, label: `${label} Baru`, notes: "", item_order: p.items.length + 1, metadata: {} }]
    }))
  }

  const removeItem = (planId: string, itemId: string) => {
    setPlans(prev => prev.map(p => p.id !== planId ? p : { ...p, items: p.items.filter(i => i.id !== itemId) }))
  }

  const updateLabel = (planId: string, itemId: string, label: string) => {
    setPlans(prev => prev.map(p => p.id !== planId ? p : { ...p, items: p.items.map(i => i.id === itemId ? { ...i, label } : i) }))
  }

  return (
    <AppShell>
      <div className="p-6 space-y-5 max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>Jadwal Ibadah</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>Rencanakan alur ibadah minggu ini</p>
          </div>
          <button onClick={() => setCreating(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--color-brand)", color: "white" }}>
            <Plus className="w-4 h-4" /> Rencana Baru
          </button>
        </div>

        {/* Week strip */}
        <div className="rounded-xl border overflow-hidden" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
          <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "var(--color-border)" }}>
            <button onClick={() => setAnchor(d => { const n=new Date(d); n.setDate(d.getDate()-7); return n })}
              className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: "var(--color-text-secondary)" }}>
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
              {days[0].toLocaleDateString("id-ID", { month: "long", year: "numeric" })}
            </span>
            <button onClick={() => setAnchor(d => { const n=new Date(d); n.setDate(d.getDate()+7); return n })}
              className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: "var(--color-text-secondary)" }}>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-7">
            {days.map((day, i) => {
              const iso     = isoDate(day)
              const isToday = iso === isoDate(today)
              const isSel   = iso === selDate
              const count   = plans.filter(p => p.date === iso).length
              return (
                <button key={iso} onClick={() => setSelDate(iso)}
                  className="flex flex-col items-center py-3 px-1 transition-all border-r last:border-0"
                  style={{
                    borderColor: "var(--color-border)",
                    background: isSel ? "var(--color-brand-glow)" : "transparent",
                    borderBottom: isSel ? "2px solid var(--color-brand)" : "2px solid transparent",
                  }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: isSel ? "var(--color-brand)" : "var(--color-text-muted)" }}>
                    {DAY_NAMES[i]}
                  </span>
                  <span className="text-lg font-bold"
                    style={{ color: isSel ? "var(--color-brand)" : isToday ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                    {day.getDate()}
                  </span>
                  <div className="flex gap-0.5 mt-1 h-2 items-center">
                    {count > 0 && Array.from({ length: Math.min(count, 3) }).map((_, j) => (
                      <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-brand)" }} />
                    ))}
                    {isToday && count === 0 && <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--color-live)" }} />}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Date label */}
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4" style={{ color: "var(--color-brand)" }} />
          <span className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>
            {new Date(selDate + "T12:00").toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
          </span>
          {selDate === isoDate(today) && (
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: "var(--color-live-dim)", color: "var(--color-live)" }}>HARI INI</span>
          )}
        </div>

        {/* Create form */}
        {creating && (
          <div className="rounded-xl border p-5 space-y-4" style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border-active)" }}>
            <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>Rencana Ibadah Baru</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>Nama</label>
                <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Ibadah Minggu Pagi"
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                  style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: "var(--color-text-muted)" }}>Catatan</label>
                <input value={newNotes} onChange={e => setNewNotes(e.target.value)} placeholder="Tema, pembicara, dll."
                  className="w-full px-3 py-2.5 rounded-lg text-sm border outline-none"
                  style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setCreating(false)}
                className="flex-1 py-2.5 rounded-lg text-sm border font-medium"
                style={{ borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>Batal</button>
              <button onClick={createPlan}
                className="flex-1 py-2.5 rounded-lg text-sm font-semibold"
                style={{ background: "var(--color-brand)", color: "white" }}>
                Buat dengan Template Standar
              </button>
            </div>
          </div>
        )}

        {/* Plans */}
        {dayPlans.length === 0 && !creating ? (
          <div className="text-center py-16 rounded-xl border" style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}>
            <LayoutList className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--color-text-muted)" }} />
            <p className="font-medium" style={{ color: "var(--color-text-secondary)" }}>Belum ada rencana ibadah</p>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>Buat rencana untuk hari ini atau hari lainnya</p>
            <button onClick={() => setCreating(true)}
              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold mx-auto"
              style={{ background: "var(--color-brand)", color: "white" }}>
              <Plus className="w-4 h-4" /> Buat Rencana
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            {dayPlans.map(plan => (
              <div key={plan.id} className="rounded-xl border overflow-hidden"
                style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                {/* Plan header */}
                <div className="flex items-center justify-between px-4 py-3 border-b"
                  style={{ borderColor: "var(--color-border)", background: "var(--color-surface-1)" }}>
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <LayoutList className="w-4 h-4 shrink-0" style={{ color: "var(--color-brand)" }} />
                    {editingPlan === plan.id ? (
                      <input defaultValue={plan.name} autoFocus
                        onBlur={e => { setPlans(p => p.map(x => x.id===plan.id ? {...x,name:e.target.value}:x)); setEditingPlan(null) }}
                        onKeyDown={e => e.key==="Enter" && (e.target as HTMLInputElement).blur()}
                        className="text-sm font-semibold bg-transparent outline-none border-b flex-1"
                        style={{ borderColor: "var(--color-brand)", color: "var(--color-text-primary)" }} />
                    ) : (
                      <span className="text-sm font-semibold truncate" style={{ color: "var(--color-text-primary)" }}>{plan.name}</span>
                    )}
                    {plan.notes && <span className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>· {plan.notes}</span>}
                    <div className="flex items-center gap-1 ml-2 text-xs shrink-0" style={{ color: "var(--color-text-muted)" }}>
                      <Clock className="w-3 h-3" /> ~{plan.items.length * 5} mnt
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0 ml-2">
                    <button onClick={() => setEditingPlan(plan.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: "var(--color-text-muted)" }}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => duplicatePlan(plan)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: "var(--color-text-muted)" }}>
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => deletePlan(plan.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ color: "var(--color-danger)" }}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => sendToService(plan)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold ml-1"
                      style={{ background: "var(--color-brand)", color: "white" }}>
                      <Check className="w-3 h-3" /> Gunakan Sekarang
                    </button>
                  </div>
                </div>

                {/* Items */}
                <div className="divide-y" style={{ borderColor: "var(--color-border)" }}>
                  {plan.items.map((item, idx) => {
                    const { icon: Icon, color, label } = ITEM_META[item.type]
                    return (
                      <div key={item.id} draggable
                        onDragStart={() => setDragging(item.id)}
                        onDragOver={e => { e.preventDefault(); setDragOver(item.id) }}
                        onDrop={() => { if (dragging && dragging!==item.id) reorderItem(plan.id, dragging, item.id); setDragging(null); setDragOver(null) }}
                        onDragEnd={() => { setDragging(null); setDragOver(null) }}
                        className="flex items-center gap-3 px-4 py-2.5 group transition-all"
                        style={{
                          background: dragOver===item.id ? "var(--color-surface-4)" : "transparent",
                          opacity: dragging===item.id ? 0.4 : 1,
                          cursor: "grab",
                          borderLeft: `2px solid ${color}35`,
                        }}>
                        <span className="text-xs font-mono w-4 shrink-0 text-right" style={{ color: "var(--color-text-muted)" }}>{idx+1}</span>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}12` }}>
                          <Icon className="w-3.5 h-3.5" style={{ color }} />
                        </div>
                        <input value={item.label} onChange={e => updateLabel(plan.id, item.id, e.target.value)}
                          className="flex-1 bg-transparent text-sm outline-none"
                          style={{ color: "var(--color-text-primary)" }} />
                        <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0"
                          style={{ background: `${color}12`, color }}>{label}</span>
                        <button onClick={() => removeItem(plan.id, item.id)}
                          className="w-6 h-6 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shrink-0"
                          style={{ color: "var(--color-danger)" }}>
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    )
                  })}
                </div>

                {/* Add item */}
                <div className="flex items-center gap-2 px-4 py-3 border-t flex-wrap"
                  style={{ borderColor: "var(--color-border)" }}>
                  <span className="text-[10px] font-bold uppercase tracking-wider mr-1" style={{ color: "var(--color-text-muted)" }}>+ Tambah</span>
                  {(Object.entries(ITEM_META) as [ServiceItemType, typeof ITEM_META[ServiceItemType]][]).map(([type, { icon: Icon, color, label }]) => (
                    <button key={type} onClick={() => addItem(plan.id, type)}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border transition-all"
                      style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                      <Icon className="w-3 h-3" style={{ color }} /> {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  )
}

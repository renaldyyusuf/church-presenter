"use client"

import { create } from "zustand"
import { useEffect } from "react"
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from "lucide-react"

type ToastType = "success" | "error" | "warning" | "info"

interface Toast {
  id: string
  type: ToastType
  title: string
  message?: string
  duration?: number
}

interface ToastStore {
  toasts: Toast[]
  add: (toast: Omit<Toast, "id">) => void
  remove: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  add: (toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    set((s) => ({ toasts: [...s.toasts, { ...toast, id }] }))
    const duration = toast.duration ?? 3500
    if (duration > 0) setTimeout(() => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })), duration)
  },
  remove: (id) => set((s) => ({ toasts: s.toasts.filter(t => t.id !== id) })),
}))

// Convenience helpers
export const toast = {
  success: (title: string, message?: string) => useToastStore.getState().add({ type: "success", title, message }),
  error:   (title: string, message?: string) => useToastStore.getState().add({ type: "error",   title, message, duration: 5000 }),
  warning: (title: string, message?: string) => useToastStore.getState().add({ type: "warning", title, message }),
  info:    (title: string, message?: string) => useToastStore.getState().add({ type: "info",    title, message }),
}

const ICONS: Record<ToastType, React.ElementType> = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

const COLORS: Record<ToastType, { bg: string; border: string; icon: string }> = {
  success: { bg: "var(--color-live-dim)",    border: "var(--color-live)",    icon: "var(--color-live)" },
  error:   { bg: "var(--color-danger-dim)",  border: "var(--color-danger)",  icon: "var(--color-danger)" },
  warning: { bg: "var(--color-warn-dim)",    border: "var(--color-warn)",    icon: "var(--color-warn)" },
  info:    { bg: "var(--color-brand-glow)",  border: "var(--color-brand)",   icon: "var(--color-brand)" },
}

export function ToastContainer() {
  const { toasts, remove } = useToastStore()
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-16 left-1/2 -translate-x-1/2 z-[100] flex flex-col gap-2 items-center pointer-events-none"
      style={{ minWidth: 280, maxWidth: 420 }}>
      {toasts.map(t => {
        const Icon = ICONS[t.type]
        const c = COLORS[t.type]
        return (
          <div key={t.id}
            className="flex items-start gap-3 px-4 py-3 rounded-xl border shadow-2xl pointer-events-auto animate-slide-up w-full"
            style={{ background: "var(--color-surface-3)", borderColor: c.border, boxShadow: `0 4px 20px rgba(0,0,0,0.4), 0 0 0 1px ${c.border}30` }}>
            <Icon className="w-4 h-4 shrink-0 mt-0.5" style={{ color: c.icon }} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold" style={{ color: "var(--color-text-primary)" }}>{t.title}</p>
              {t.message && <p className="text-xs mt-0.5" style={{ color: "var(--color-text-secondary)" }}>{t.message}</p>}
            </div>
            <button onClick={() => remove(t.id)} className="shrink-0">
              <X className="w-3.5 h-3.5" style={{ color: "var(--color-text-muted)" }} />
            </button>
          </div>
        )
      })}
    </div>
  )
}

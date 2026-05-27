"use client"

import { usePresentationStore } from "@/stores/presentationStore"
import { useStageStore } from "@/stores/stageStore"
import { useKeyboardShortcuts } from "@/hooks/usePresentation"
import { usePresentationBroadcast, useStageBroadcast } from "@/hooks/useStageSync"
import { useGlobalTimer } from "@/hooks/useTimer"
import { ChevronLeft, ChevronRight, Moon, Square, Image, Keyboard } from "lucide-react"
import { useState, useEffect } from "react"

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

export function BottomBar() {
  const { mode, setMode, goNext, goPrev, currentSlide, queue, queueIndex } = usePresentationStore()
  const { remaining, timerRunning } = useStageStore()
  const [time, setTime] = useState("")
  const [showKeys, setShowKeys] = useState(false)

  useKeyboardShortcuts()
  usePresentationBroadcast()
  useStageBroadcast()
  useGlobalTimer()

  useEffect(() => {
    const tick = () => setTime(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }))
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const ModeBtn = ({ m, label, activeColor }: { m: string; label: string; activeColor: string }) => {
    const isActive = mode === m
    return (
      <button
        onClick={() => setMode(isActive ? "live" : m as never)}
        className="px-3 py-1.5 rounded-lg text-xs font-bold tracking-wide transition-all border"
        style={{
          background: isActive ? `${activeColor}18` : "transparent",
          borderColor: isActive ? activeColor : "transparent",
          color: isActive ? activeColor : "var(--color-text-muted)",
        }}>
        {label}
      </button>
    )
  }

  return (
    <>
      <div
        className="fixed bottom-0 left-[52px] right-0 h-12 flex items-center px-4 border-t z-30 gap-3"
        style={{ background: "var(--color-surface-1)", borderColor: "var(--color-border)" }}>

        {/* Slide nav */}
        <div className="flex items-center gap-1">
          <button onClick={goPrev} disabled={queueIndex === 0}
            className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-25 transition-all"
            style={{ color: "var(--color-text-secondary)" }} title="Prev (←)">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs tabular-nums w-16 text-center font-mono"
            style={{ color: "var(--color-text-muted)" }}>
            {queue.length > 0 ? `${queueIndex + 1} / ${queue.length}` : "— / —"}
          </span>
          <button onClick={goNext} disabled={queueIndex >= queue.length - 1}
            className="w-7 h-7 rounded-lg flex items-center justify-center disabled:opacity-25 transition-all"
            style={{ color: "var(--color-text-secondary)" }} title="Next (→ / Spasi)">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="w-px h-5 shrink-0" style={{ background: "var(--color-border)" }} />

        {/* Mode buttons */}
        <div className="flex items-center gap-0.5">
          <ModeBtn m="clear" label="CLEAR"  activeColor="var(--color-text-secondary)" />
          <ModeBtn m="black" label="HITAM"  activeColor="#999" />
          <ModeBtn m="logo"  label="LOGO"   activeColor="var(--color-brand)" />
        </div>

        <div className="w-px h-5 shrink-0" style={{ background: "var(--color-border)" }} />

        {/* Live pulse */}
        {mode === "live" && queue.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full animate-pulse-live" style={{ background: "var(--color-live)" }} />
            <span className="text-xs font-bold" style={{ color: "var(--color-live)" }}>LIVE</span>
          </div>
        )}

        {/* Current slide text */}
        {currentSlide && (
          <div className="flex items-center gap-2 flex-1 min-w-0 mx-2">
            {currentSlide.section && (
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 uppercase tracking-wide"
                style={{ background: "var(--color-surface-4)", color: "var(--color-brand)" }}>
                {currentSlide.section}
              </span>
            )}
            <span className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>
              {currentSlide.content.split("\n")[0].slice(0, 80)}
            </span>
          </div>
        )}
        {!currentSlide && <div className="flex-1" />}

        {/* Timer chip — shows when running */}
        {timerRunning && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg shrink-0"
            style={{
              background: remaining < 60 ? "var(--color-danger-dim)" : "var(--color-warn-dim)",
              border: `1px solid ${remaining < 60 ? "var(--color-danger)" : "var(--color-warn)"}`,
            }}>
            <span className="text-xs font-mono font-bold tabular-nums"
              style={{ color: remaining < 60 ? "var(--color-danger)" : "var(--color-warn)" }}>
              ⏱ {fmt(remaining)}
            </span>
          </div>
        )}

        {/* Keyboard hint + clock */}
        <div className="flex items-center gap-3 shrink-0">
          <button onClick={() => setShowKeys(k => !k)}
            className="flex items-center gap-1 text-xs transition-all"
            style={{ color: showKeys ? "var(--color-brand)" : "var(--color-text-muted)" }}>
            <Keyboard className="w-3.5 h-3.5" />
          </button>
          <span className="text-xs font-mono tabular-nums" style={{ color: "var(--color-text-muted)" }}>{time}</span>
        </div>
      </div>

      {/* Keyboard shortcuts popup */}
      {showKeys && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowKeys(false)} />
          <div className="fixed bottom-14 right-4 z-50 rounded-xl border p-4 shadow-2xl"
            style={{
              background: "var(--color-surface-3)",
              borderColor: "var(--color-border)",
              minWidth: 240,
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
            }}>
            <p className="text-[10px] font-bold uppercase tracking-wider mb-3"
              style={{ color: "var(--color-text-muted)" }}>
              Pintasan Keyboard
            </p>
            <div className="space-y-2">
              {[
                ["Spasi / →",    "Slide berikutnya"],
                ["←",           "Slide sebelumnya"],
                ["B",           "Layar hitam"],
                ["L",           "Tampilkan logo"],
                ["Esc",         "Bersihkan layar"],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between gap-8">
                  <kbd className="text-[10px] px-2 py-0.5 rounded font-mono font-semibold"
                    style={{
                      background: "var(--color-surface-5)",
                      color: "var(--color-text-secondary)",
                      border: "1px solid var(--color-border)",
                    }}>
                    {key}
                  </kbd>
                  <span className="text-xs" style={{ color: "var(--color-text-secondary)" }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )
}

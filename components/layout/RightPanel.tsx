"use client"

import { usePresentationStore } from "@/stores/presentationStore"
import { Monitor, ChevronRight, Radio } from "lucide-react"

function SlideThumb({ slide, label, active }: {
  slide: { content: string; section?: string; sourceType?: string } | null
  label: string
  active?: boolean
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center gap-1.5">
        {active && <span className="w-1.5 h-1.5 rounded-full animate-pulse-live" style={{ background: "var(--color-live)" }} />}
        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: active ? "var(--color-live)" : "var(--color-text-muted)" }}>
          {label}
        </p>
      </div>
      <div className="relative rounded-lg overflow-hidden border"
        style={{
          background: "linear-gradient(135deg, #0d0620 0%, #05050f 60%, #051005 100%)",
          borderColor: active ? "var(--color-border-active)" : "var(--color-border)",
          aspectRatio: "16/9",
        }}>
        {slide ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-3 text-center">
            {slide.section && (
              <p className="text-[8px] font-bold uppercase tracking-wider mb-1 opacity-50" style={{ color: "#fff" }}>
                {slide.section}
              </p>
            )}
            <p className="text-[11px] leading-snug whitespace-pre-line font-semibold" style={{ color: "#fff" }}>
              {slide.content.split("\n").slice(0, 3).join("\n")}
              {slide.content.split("\n").length > 3 ? "\n…" : ""}
            </p>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <Monitor className="w-5 h-5 opacity-20" style={{ color: "#fff" }} />
          </div>
        )}
      </div>
    </div>
  )
}

export function RightPanel() {
  const { currentSlide, nextSlide, queue, queueIndex, goToSlide, mode } = usePresentationStore()

  return (
    <div className="w-[210px] shrink-0 flex flex-col border-l overflow-hidden"
      style={{ background: "var(--color-surface-1)", borderColor: "var(--color-border)" }}>

      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5 border-b"
        style={{ borderColor: "var(--color-border)" }}>
        <div className="flex items-center gap-2">
          <Monitor className="w-3.5 h-3.5" style={{ color: "var(--color-brand)" }} />
          <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>Output</span>
        </div>
        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${mode === "live" ? "animate-pulse-live" : ""}`}
          style={{
            background: mode === "live" ? "var(--color-live-dim)" : "var(--color-surface-4)",
            color: mode === "live" ? "var(--color-live)" : mode === "black" ? "#aaa" : mode === "logo" ? "var(--color-brand)" : "var(--color-text-muted)",
          }}>
          {mode === "live" ? "● LIVE" : mode.toUpperCase()}
        </span>
      </div>

      {/* Slide previews */}
      <div className="p-3 space-y-3 border-b" style={{ borderColor: "var(--color-border)" }}>
        <SlideThumb slide={currentSlide} label="Sekarang" active={mode === "live"} />
        <SlideThumb slide={nextSlide} label="Berikutnya" />
      </div>

      {/* Queue */}
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center justify-between px-3 pt-3 pb-2">
          <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "var(--color-text-muted)" }}>
            Antrian
          </p>
          {queue.length > 0 && (
            <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>
              {queueIndex + 1}/{queue.length}
            </span>
          )}
        </div>
        <div className="space-y-px px-2 pb-2">
          {queue.map((slide, i) => (
            <button key={slide.id} onClick={() => goToSlide(i)}
              className="w-full text-left px-2 py-2 rounded-lg transition-all"
              style={{
                background: i === queueIndex ? "var(--color-brand-glow)" : "transparent",
                borderLeft: `2px solid ${i === queueIndex ? "var(--color-brand)" : "transparent"}`,
              }}>
              <div className="flex items-start gap-2">
                <span className="text-[9px] font-mono mt-0.5 w-4 shrink-0 text-right tabular-nums"
                  style={{ color: "var(--color-text-muted)" }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  {slide.section && (
                    <p className="text-[9px] font-bold uppercase mb-0.5 truncate"
                      style={{ color: "var(--color-brand)" }}>{slide.section}</p>
                  )}
                  <p className="text-[11px] leading-snug truncate"
                    style={{ color: i === queueIndex ? "var(--color-text-primary)" : "var(--color-text-secondary)" }}>
                    {slide.content.split("\n")[0]}
                  </p>
                </div>
                {i === queueIndex && <ChevronRight className="w-3 h-3 shrink-0 mt-0.5" style={{ color: "var(--color-brand)" }} />}
              </div>
            </button>
          ))}
          {queue.length === 0 && (
            <div className="text-center py-6 px-2">
              <Radio className="w-5 h-5 mx-auto mb-2 opacity-30" style={{ color: "var(--color-text-muted)" }} />
              <p className="text-[10px] leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                Pilih lagu atau ayat Alkitab untuk mulai
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

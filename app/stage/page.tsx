"use client"

import { usePresentationStore } from "@/stores/presentationStore"
import { useStageStore } from "@/stores/stageStore"
import { useReceiveBroadcast, useReceiveStageBroadcast } from "@/hooks/useStageSync"
import { useGlobalTimer } from "@/hooks/useTimer"
import { useEffect, useState } from "react"

function Clock() {
  const [t, setT] = useState({ time: "", date: "" })
  useEffect(() => {
    const tick = () => setT({
      time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
      date: new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" }),
    })
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])
  return (
    <div>
      <p style={{ fontSize: 48, fontWeight: 700, color: "#fff", fontFamily: "monospace", lineHeight: 1, letterSpacing: "-0.02em" }}>
        {t.time}
      </p>
      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.3)", marginTop: 8, fontFamily: "sans-serif", letterSpacing: "0.02em" }}>
        {t.date}
      </p>
    </div>
  )
}

function Timer({ remaining, running }: { remaining: number; running: boolean }) {
  const mm = String(Math.floor(remaining / 60)).padStart(2, "0")
  const ss = String(remaining % 60).padStart(2, "0")
  const pct = Math.min(1, Math.max(0, remaining / 300))
  const color = remaining > 120 ? "#22C55E" : remaining > 30 ? "#F59E0B" : "#EF4444"
  const isUrgent = running && remaining <= 30

  return (
    <div>
      <p style={{
        fontSize: 48, fontWeight: 700, fontFamily: "monospace", lineHeight: 1,
        color: running ? color : "rgba(255,255,255,0.2)",
        letterSpacing: "-0.02em",
        animation: isUrgent ? "urgentPulse 0.5s ease-in-out infinite alternate" : "none",
      }}>
        {mm}:{ss}
      </p>
      {/* Progress bar */}
      <div style={{ marginTop: 10, height: 3, background: "rgba(255,255,255,0.08)", borderRadius: 2, overflow: "hidden" }}>
        <div style={{
          height: "100%", width: `${pct * 100}%`,
          background: running ? color : "rgba(255,255,255,0.1)",
          transition: "width 1s linear, background 0.5s ease",
          borderRadius: 2,
        }} />
      </div>
      <p style={{ fontSize: 10, color: running ? color : "rgba(255,255,255,0.2)", marginTop: 6, fontWeight: 600, letterSpacing: "0.1em" }}>
        {running ? (remaining <= 0 ? "WAKTU HABIS" : "▶ BERJALAN") : "— BERHENTI"}
      </p>
    </div>
  )
}

function SlidePanel({ slide, label, accent, large }: {
  slide: { content: string; section?: string; sourceType?: string } | null
  label: string; accent: string; large?: boolean
}) {
  return (
    <div style={{
      flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 16,
      border: `1px solid ${accent}22`, padding: "24px 28px",
      display: "flex", flexDirection: "column", gap: 14, minHeight: 200,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div style={{ width: 8, height: 8, borderRadius: "50%", background: accent }} />
        <span style={{ color: accent, fontSize: 11, fontWeight: 700, letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "sans-serif" }}>
          {label}
        </span>
        {large && slide?.sourceType && (
          <span style={{ marginLeft: "auto", fontSize: 9, color: "rgba(255,255,255,0.2)", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase" }}>
            {slide.sourceType}
          </span>
        )}
      </div>
      {slide ? (
        <div style={{ flex: 1 }}>
          {slide.section && (
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 12, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 12 }}>
              {slide.section}
            </p>
          )}
          <p style={{
            color: "#fff", fontFamily: "DM Sans, sans-serif",
            fontSize: large ? 36 : 22,
            fontWeight: large ? 700 : 500,
            lineHeight: 1.4, whiteSpace: "pre-line",
          }}>{slide.content}</p>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "rgba(255,255,255,0.12)", fontSize: 14, fontFamily: "sans-serif" }}>Tidak ada slide</p>
        </div>
      )}
    </div>
  )
}

export default function StagePage() {
  const { currentSlide, nextSlide, mode } = usePresentationStore()
  const { message, remaining, timerRunning } = useStageStore()

  useReceiveBroadcast()
  useReceiveStageBroadcast()
  useGlobalTimer()

  return (
    <div style={{
      minHeight: "100vh", background: "#060610", color: "#fff",
      fontFamily: "DM Sans, sans-serif", display: "flex", flexDirection: "column",
      padding: 20, gap: 16, boxSizing: "border-box",
    }}>
      <style>{`
        @keyframes urgentPulse { from { opacity: 1; } to { opacity: 0.4; } }
      `}</style>

      {/* Top bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 18px", background: "rgba(255,255,255,0.04)",
        borderRadius: 12, border: "1px solid rgba(255,255,255,0.07)", shrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 28, height: 28,
            background: "linear-gradient(135deg,#7C6FFD,#5548c8)",
            borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 10, fontWeight: 800, color: "#fff",
          }}>CP</div>
          <span style={{ fontSize: 11, color: "rgba(255,255,255,0.35)", fontWeight: 700, letterSpacing: "0.15em" }}>
            STAGE DISPLAY
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {message && (
            <div style={{
              background: "rgba(124,111,253,0.15)", border: "1px solid rgba(124,111,253,0.3)",
              borderRadius: 8, padding: "4px 12px",
            }}>
              <span style={{ fontSize: 12, color: "#b8b0ff" }}>📢 {message}</span>
            </div>
          )}
          <div style={{ width: 7, height: 7, borderRadius: "50%", background: mode === "live" ? "#22C55E" : "#333", boxShadow: mode === "live" ? "0 0 10px #22C55E" : "none" }} />
          <span style={{ fontSize: 11, fontWeight: 700, color: mode === "live" ? "#22C55E" : "rgba(255,255,255,0.2)", letterSpacing: "0.12em" }}>
            {mode.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Slides */}
      <div style={{ display: "flex", gap: 14, flex: 1, minHeight: 0 }}>
        <SlidePanel slide={currentSlide} label="Sekarang" accent="#7C6FFD" large />
        <div style={{ width: 1, background: "rgba(255,255,255,0.06)", margin: "0 2px" }} />
        <SlidePanel slide={nextSlide} label="Berikutnya" accent="#2a2a4a" />
      </div>

      {/* Bottom widgets */}
      <div style={{ display: "flex", gap: 14, flexShrink: 0 }}>
        {/* Clock */}
        <div style={{
          flex: 1.4, background: "rgba(255,255,255,0.03)", borderRadius: 14,
          border: "1px solid rgba(255,255,255,0.06)", padding: "18px 24px",
        }}>
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontWeight: 700, letterSpacing: "0.2em", marginBottom: 12 }}>JAM</p>
          <Clock />
        </div>

        {/* Timer */}
        <div style={{
          flex: 1, background: "rgba(255,255,255,0.03)", borderRadius: 14,
          border: `1px solid ${timerRunning ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)"}`,
          padding: "18px 24px",
        }}>
          <p style={{ fontSize: 9, color: timerRunning ? "#F59E0B" : "rgba(255,255,255,0.2)", fontWeight: 700, letterSpacing: "0.2em", marginBottom: 12 }}>
            HITUNG MUNDUR
          </p>
          <Timer remaining={remaining} running={timerRunning} />
        </div>

        {/* Message */}
        <div style={{
          flex: 2,
          background: message ? "rgba(124,111,253,0.07)" : "rgba(255,255,255,0.03)",
          borderRadius: 14,
          border: `1px solid ${message ? "rgba(124,111,253,0.2)" : "rgba(255,255,255,0.06)"}`,
          padding: "18px 28px",
          display: "flex", flexDirection: "column", justifyContent: "center",
        }}>
          <p style={{ fontSize: 9, color: "rgba(255,255,255,0.2)", fontWeight: 700, letterSpacing: "0.2em", marginBottom: 12 }}>PESAN OPERATOR</p>
          {message
            ? <p style={{ fontSize: 26, fontWeight: 600, color: "#fff", lineHeight: 1.35 }}>{message}</p>
            : <p style={{ fontSize: 14, color: "rgba(255,255,255,0.12)", fontFamily: "sans-serif" }}>Belum ada pesan dari operator</p>
          }
        </div>
      </div>
    </div>
  )
}

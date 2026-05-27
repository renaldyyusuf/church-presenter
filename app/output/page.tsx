"use client"

import { usePresentationStore } from "@/stores/presentationStore"
import { useReceiveBroadcast }  from "@/hooks/useStageSync"
import { useEffect, useRef, useState, useCallback } from "react"

type RenderMode = "fade" | "slide-up" | "none"

export default function OutputPage() {
  const { currentSlide, mode, activeTheme, backgroundMedia } = usePresentationStore()
  const [visible,  setVisible]  = useState(true)
  const [content,  setContent]  = useState(currentSlide)
  const [transition, setTrans]  = useState<RenderMode>("fade")
  const videoRef  = useRef<HTMLVideoElement>(null)
  const prevIdRef = useRef<string | null>(null)

  useReceiveBroadcast()

  // Smooth transition on slide change
  useEffect(() => {
    if (currentSlide?.id === prevIdRef.current) return
    prevIdRef.current = currentSlide?.id ?? null

    setVisible(false)
    const t = setTimeout(() => {
      setContent(currentSlide)
      setVisible(true)
    }, 150)
    return () => clearTimeout(t)
  }, [currentSlide?.id])

  // Auto-play/loop video background
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [backgroundMedia?.id])

  const t = {
    font_family: "DM Sans, sans-serif",
    font_size:   56,
    font_weight: 700,
    text_align:  "center" as const,
    text_color:  "#FFFFFF",
    shadow:      true,
    shadow_blur: 24,
    stroke:      false,
    stroke_color:"#000000",
    stroke_width: 2,
    bg_opacity:  0.35,
    position:    "center" as const,
    ...activeTheme,
  }

  const cursorNone: React.CSSProperties = { cursor: "none" }

  // ── Black ────────────────────────────────────────────────
  if (mode === "black") return (
    <div style={{ position: "fixed", inset: 0, background: "#000", ...cursorNone }} />
  )

  // ── Logo ─────────────────────────────────────────────────
  if (mode === "logo") return (
    <div style={{ position: "fixed", inset: 0, background: "radial-gradient(ellipse at center, #0c0420 0%, #04040e 100%)", display: "flex", alignItems: "center", justifyContent: "center", ...cursorNone }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: 140, height: 140, margin: "0 auto 28px",
          background: "linear-gradient(135deg, #7C6FFD 0%, #5548c8 100%)",
          borderRadius: 36, display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 0 100px rgba(124,111,253,0.5), 0 0 40px rgba(124,111,253,0.3)",
        }}>
          <span style={{ color: "#fff", fontSize: 52, fontWeight: 900, fontFamily: "DM Sans, sans-serif", letterSpacing: "-0.04em" }}>CP</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 16, letterSpacing: "0.45em", fontFamily: "DM Sans, sans-serif", textTransform: "uppercase" }}>
          ChurchPresent
        </p>
      </div>
    </div>
  )

  // ── Clear / empty ────────────────────────────────────────
  if (mode === "clear" || !content) return (
    <div style={{ position: "fixed", inset: 0, background: "#000", ...cursorNone }} />
  )

  const isBible = content.sourceType === "bible"
  const bg = backgroundMedia

  const jc  = t.position === "top" ? "flex-start" : t.position === "bottom" ? "flex-end" : "center"
  const ai  = t.text_align === "left" ? "flex-start" : t.text_align === "right" ? "flex-end" : "center"
  const pad = t.position === "top" ? "8vh 12vw 0" : t.position === "bottom" ? "0 12vw 8vh" : "0 12vw"

  return (
    <div style={{ position: "fixed", inset: 0, overflow: "hidden", background: "#000", ...cursorNone }}>

      {/* ── Background ── */}
      {bg ? (
        bg.type === "image" ? (
          <img key={bg.id} src={bg.url ?? bg.path} alt=""
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <video key={bg.id} ref={videoRef} src={bg.url ?? bg.path} autoPlay loop muted playsInline
            style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        )
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 28% 38%, #10052e 0%, #050510 50%, #030a05 100%)" }} />
      )}

      {/* ── Dark overlay ── */}
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${t.bg_opacity})` }} />

      {/* ── Vignette ── */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at center, transparent 38%, rgba(0,0,0,0.6) 100%)",
        pointerEvents: "none",
      }} />

      {/* ── Content with transition ── */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        justifyContent: jc, alignItems: ai, padding: pad,
        opacity:   visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(24px)",
        transition: "opacity 0.3s cubic-bezier(0.4,0,0.2,1), transform 0.3s cubic-bezier(0.4,0,0.2,1)",
        willChange: "opacity, transform",
      }}>

        {/* Bible reference (above) */}
        {isBible && content.section && (
          <p style={{
            color: "rgba(255,255,255,0.52)",
            fontSize: Math.round(t.font_size * 0.33),
            fontFamily: t.font_family, fontWeight: 500,
            letterSpacing: "0.13em", textTransform: "uppercase",
            marginBottom: "1.8rem",
            textAlign: t.text_align,
            textShadow: "0 2px 16px rgba(0,0,0,1)",
          }}>{content.section}</p>
        )}

        {/* Announcement title (above) */}
        {content.sourceType === "announcement" && content.section && (
          <p style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: Math.round(t.font_size * 0.36),
            fontFamily: t.font_family, fontWeight: 700,
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: "1.4rem",
            textAlign: t.text_align,
            textShadow: "0 2px 16px rgba(0,0,0,1)",
          }}>{content.section}</p>
        )}

        {/* Main text */}
        <p style={{
          color: t.text_color,
          fontSize: t.font_size,
          fontFamily: t.font_family,
          fontWeight: t.font_weight,
          lineHeight: 1.28,
          whiteSpace: "pre-line",
          textAlign: t.text_align,
          textShadow: t.shadow
            ? `0 2px ${t.shadow_blur}px rgba(0,0,0,0.98), 0 0 60px rgba(0,0,0,0.55)`
            : "none",
          WebkitTextStroke: t.stroke ? `${t.stroke_width}px ${t.stroke_color}` : undefined,
          fontStyle: isBible ? "italic" : "normal",
          maxWidth: "100%",
          letterSpacing: isBible ? "0.01em" : "normal",
        }}>{content.content}</p>

        {/* Song section label (below) */}
        {content.sourceType === "song" && content.section && (
          <p style={{
            color: "rgba(255,255,255,0.14)",
            fontSize: Math.round(t.font_size * 0.23),
            fontFamily: t.font_family, fontWeight: 500,
            letterSpacing: "0.24em", textTransform: "uppercase",
            marginTop: "2.5rem", textAlign: t.text_align,
          }}>{content.section}</p>
        )}
      </div>

      {/* ── Subtle LIVE indicator ── */}
      {mode === "live" && (
        <div style={{ position: "absolute", top: 20, right: 24, display: "flex", alignItems: "center", gap: 5, opacity: 0.2 }}>
          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#22C55E" }} />
          <span style={{ color: "#22C55E", fontSize: 9, fontWeight: 900, letterSpacing: "0.2em", fontFamily: "sans-serif" }}>LIVE</span>
        </div>
      )}
    </div>
  )
}

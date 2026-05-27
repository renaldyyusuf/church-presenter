"use client"

import type { Slide, Theme, PresentationMode, Media } from "@/types"

interface SlideRendererProps {
  slide:           Slide | null
  theme:           Partial<Theme> | null
  mode:            PresentationMode
  backgroundMedia?: Media | null
  className?:      string
}

export function SlideRenderer({ slide, theme, mode, backgroundMedia, className = "" }: SlideRendererProps) {
  const t = {
    font_family: "DM Sans, sans-serif",
    font_size:   52,
    font_weight: 700,
    text_align:  "center" as const,
    text_color:  "#FFFFFF",
    shadow:      true,
    shadow_blur: 20,
    stroke:      false,
    stroke_color: "#000000",
    stroke_width: 2,
    bg_opacity:  0.35,
    position:    "center" as const,
    ...theme,
  }

  const base: React.CSSProperties = {
    width: "100%", height: "100%", position: "relative",
    overflow: "hidden", background: "#000",
  }

  // ── Black ─────────────────────────────────────────────────
  if (mode === "black") return <div className={className} style={{ ...base, background: "#000" }} />

  // ── Logo ──────────────────────────────────────────────────
  if (mode === "logo") return (
    <div className={className} style={{ ...base, background: "#04040e", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ width: 56, height: 56, background: "linear-gradient(135deg,#7C6FFD,#5548c8)", borderRadius: 14, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ color: "#fff", fontSize: 20, fontWeight: 800 }}>CP</span>
        </div>
        <p style={{ color: "rgba(255,255,255,0.2)", fontSize: 9, letterSpacing: "0.35em", textTransform: "uppercase" }}>ChurchPresent</p>
      </div>
    </div>
  )

  // ── Clear / no slide ──────────────────────────────────────
  if (mode === "clear" || !slide) return (
    <div className={className} style={{ ...base, background: "#080812" }}>
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 25% 35%, #0f0530 0%, #050510 45%, #030a06 100%)" }} />
    </div>
  )

  const isBible = slide.sourceType === "bible"
  const bg      = backgroundMedia
  const jc = t.position === "top" ? "flex-start" : t.position === "bottom" ? "flex-end" : "center"
  const ai = t.text_align === "left" ? "flex-start" : t.text_align === "right" ? "flex-end" : "center"
  const pad = t.position === "top" ? "8% 10% 0" : t.position === "bottom" ? "0 10% 8%" : "0 10%"

  return (
    <div className={className} style={base}>
      {/* Background */}
      {bg ? (
        bg.type === "image"
          ? <img   src={bg.url ?? bg.path} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          : <video src={bg.url ?? bg.path} autoPlay loop muted playsInline style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 25% 35%, #0f0530 0%, #050510 45%, #030a06 100%)" }} />
      )}

      {/* Overlay */}
      <div style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${t.bg_opacity})` }} />
      {/* Vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)", pointerEvents: "none" }} />

      {/* Content */}
      <div style={{
        position: "absolute", inset: 0,
        display: "flex", flexDirection: "column",
        justifyContent: jc, alignItems: ai, padding: pad,
      }}>
        {isBible && slide.section && (
          <p style={{
            color: "rgba(255,255,255,0.45)",
            fontSize: Math.round(t.font_size * 0.32),
            fontFamily: t.font_family, fontWeight: 500,
            letterSpacing: "0.1em", textTransform: "uppercase",
            marginBottom: "1.4rem",
            textAlign: t.text_align,
            textShadow: "0 2px 12px rgba(0,0,0,1)",
          }}>{slide.section}</p>
        )}

        <p style={{
          color: t.text_color,
          fontSize: t.font_size,
          fontFamily: t.font_family,
          fontWeight: t.font_weight,
          lineHeight: 1.3,
          whiteSpace: "pre-line",
          textAlign: t.text_align,
          textShadow: t.shadow ? `0 2px ${t.shadow_blur}px rgba(0,0,0,0.98), 0 0 50px rgba(0,0,0,0.5)` : "none",
          WebkitTextStroke: t.stroke ? `${t.stroke_width}px ${t.stroke_color}` : undefined,
          fontStyle: isBible ? "italic" : "normal",
          maxWidth: "100%",
        }}>{slide.content}</p>

        {!isBible && slide.section && (
          <p style={{
            color: "rgba(255,255,255,0.14)",
            fontSize: Math.round(t.font_size * 0.22),
            fontFamily: t.font_family, fontWeight: 500,
            letterSpacing: "0.22em", textTransform: "uppercase",
            marginTop: "2rem", textAlign: t.text_align,
          }}>{slide.section}</p>
        )}
      </div>
    </div>
  )
}

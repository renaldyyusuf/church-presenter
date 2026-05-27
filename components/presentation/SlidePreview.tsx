"use client"

import { cn } from "@/lib/utils"
import type { Slide, Theme } from "@/types"

interface SlidePreviewProps {
  slide: Slide | null
  theme?: Theme | null
  dim?: boolean
  onClick?: () => void
  selected?: boolean
}

export function SlidePreview({
  slide,
  theme,
  dim,
  onClick,
  selected,
}: SlidePreviewProps) {
  const fontSize = theme ? Math.max(theme.font_size * 0.18, 10) : 11
  const fontFamily = theme?.font_family ?? "Inter"
  const textAlign = theme?.text_align ?? "center"
  const textColor = theme?.text_color ?? "#ffffff"
  const shadow = theme?.shadow
    ? `0 2px ${(theme.shadow_blur ?? 4) * 0.2}px rgba(0,0,0,0.8)`
    : undefined

  return (
    <div
      onClick={onClick}
      className={cn(
        "slide-canvas w-full rounded-md overflow-hidden cursor-pointer border transition-all",
        selected
          ? "border-[hsl(var(--primary))] ring-1 ring-[hsl(var(--primary))]"
          : "border-[hsl(var(--border))] hover:border-zinc-500",
        dim && "opacity-50"
      )}
      style={{ aspectRatio: "16/9", background: "#000" }}
    >
      {slide ? (
        <div
          className="w-full h-full flex items-center justify-center p-3"
          style={{ fontFamily, textAlign }}
        >
          {slide.mediaUrl && slide.mediaType === "image" && (
            <img
              src={slide.mediaUrl}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-70"
            />
          )}
          <p
            className="relative z-10 leading-tight whitespace-pre-line font-semibold"
            style={{
              fontSize,
              color: textColor,
              textShadow: shadow,
            }}
          >
            {slide.content}
          </p>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-[9px] text-zinc-600 uppercase tracking-widest">
            Empty
          </span>
        </div>
      )}

      {slide?.section && (
        <div className="absolute bottom-1 left-1 right-1 flex justify-between items-end pointer-events-none">
          <span className="text-[7px] bg-black/60 text-[hsl(var(--primary))] px-1 py-0.5 rounded">
            {slide.section}
          </span>
        </div>
      )}
    </div>
  )
}

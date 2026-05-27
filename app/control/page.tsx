"use client"

import { AppShell } from "@/components/layout/AppShell"
import { usePresentationStore } from "@/stores/presentationStore"
import { useSongStore } from "@/stores/songStore"
import { useStageStore } from "@/stores/stageStore"
import { useSongsInit } from "@/hooks/useSongs"
import { usePresentationBroadcast, useStageBroadcast } from "@/hooks/useStageSync"
import { useKeyboardShortcuts } from "@/hooks/usePresentation"
import { lyricsToSlides } from "@/lib/lyrics/parser"
import {
  Music2, BookOpen, LayoutList, Star, ArrowRight,
  Tv2, Monitor, ChevronLeft, ChevronRight,
  Play, Pause, Send, RotateCcw, Megaphone, X,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`
}

export default function ControlPage() {
  const {
    currentSlide, nextSlide, mode, setMode,
    queue, queueIndex, goNext, goPrev, goToSlide,
  } = usePresentationStore()
  const { songs } = useSongStore()
  const { loading } = useSongsInit()
  const {
    message, setMessage, clearMessage,
    timerSeconds, remaining, timerRunning,
    setTimer, startTimer, stopTimer, resetTimer,
  } = useStageStore()

  const [msgDraft, setMsgDraft] = useState("")
  const [timerMin, setTimerMin] = useState("5")

  usePresentationBroadcast()
  useStageBroadcast()
  useKeyboardShortcuts()

  const handlePlay = (song: typeof songs[0]) => {
    useSongStore.getState().selectSong(song)
    usePresentationStore.getState().setQueue(lyricsToSlides(song.lyrics_raw, song.id), 0)
    setMode("live")
  }

  const handleSendMsg = () => {
    if (msgDraft.trim()) { setMessage(msgDraft.trim()); setMsgDraft("") }
  }

  const handleStartTimer = () => {
    const mins = Math.max(1, parseInt(timerMin) || 5)
    setTimer(mins * 60)
    startTimer()
  }

  const favSongs = songs.filter(s => s.favorite)
  const displaySongs = (favSongs.length > 0 ? favSongs : songs).slice(0, 6)

  // Timer color
  const timerColor = remaining > 120 ? "var(--color-live)" : remaining > 30 ? "var(--color-warn)" : "var(--color-danger)"

  return (
    <AppShell>
      <div className="flex flex-col h-full overflow-hidden">

        {/* Top bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b shrink-0"
          style={{ borderColor: "var(--color-border)" }}>
          <div>
            <h1 className="text-base font-semibold" style={{ color: "var(--color-text-primary)" }}>Panel Kontrol</h1>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {new Date().toLocaleDateString("id-ID", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <a href="/output" target="_blank"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border"
              style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              <Tv2 className="w-3 h-3" /> Output ↗
            </a>
            <a href="/stage" target="_blank"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs border"
              style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
              <Monitor className="w-3 h-3" /> Stage ↗
            </a>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">

          {/* ── Mode buttons ── */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { m: "live",  label: "● LIVE",   bg: "var(--color-live-dim)",    border: "var(--color-live)",    text: "var(--color-live)" },
              { m: "black", label: "■ HITAM",  bg: "rgba(255,255,255,0.05)",   border: "rgba(255,255,255,0.15)", text: "#bbb" },
              { m: "logo",  label: "◆ LOGO",   bg: "var(--color-brand-glow)",  border: "var(--color-brand)",   text: "var(--color-brand)" },
              { m: "clear", label: "○ CLEAR",  bg: "transparent",              border: "var(--color-border)",   text: "var(--color-text-muted)" },
            ].map(({ m, label, bg, border, text }) => (
              <button key={m} onClick={() => setMode(m as never)}
                className="px-4 py-2 rounded-xl text-xs font-bold tracking-wide transition-all border"
                style={{
                  background: mode === m ? bg : "var(--color-surface-2)",
                  borderColor: mode === m ? border : "var(--color-border)",
                  color: mode === m ? text : "var(--color-text-muted)",
                  boxShadow: mode === m ? `0 0 20px ${bg}` : "none",
                }}>
                {label}
              </button>
            ))}
          </div>

          {/* ── Slide preview ── */}
          <div className="rounded-xl border overflow-hidden"
            style={{
              background: "var(--color-surface-2)",
              borderColor: mode === "live" ? "var(--color-border-active)" : "var(--color-border)",
            }}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b"
              style={{ borderColor: "var(--color-border)" }}>
              <div className="flex items-center gap-2">
                {mode === "live" && <span className="w-2 h-2 rounded-full animate-pulse-live" style={{ background: "var(--color-live)" }} />}
                <span className="text-xs font-semibold"
                  style={{ color: mode === "live" ? "var(--color-live)" : "var(--color-text-muted)" }}>
                  {mode === "live" ? "MENYAJIKAN" : mode === "black" ? "LAYAR HITAM" : mode === "logo" ? "LOGO" : "TIDAK AKTIF"}
                </span>
                {currentSlide?.section && (
                  <span className="text-[10px] px-2 py-0.5 rounded font-semibold"
                    style={{ background: "var(--color-surface-4)", color: "var(--color-brand)" }}>
                    {currentSlide.section}
                  </span>
                )}
              </div>
              <span className="text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                {queue.length > 0 ? `${queueIndex + 1} / ${queue.length}` : "—"}
              </span>
            </div>

            {/* 16:9 canvas */}
            <div className="relative w-full" style={{ paddingTop: "56.25%" }}>
              <div className="absolute inset-0 flex items-center justify-center"
                style={{
                  background: mode === "black" ? "#000"
                    : mode === "logo" ? "#04040e"
                    : "radial-gradient(ellipse at 25% 35%, #0f0530 0%, #050510 45%, #030a06 100%)",
                }}>
                {mode === "logo" ? (
                  <div style={{ textAlign: "center" }}>
                    <div style={{ width: 44, height: 44, background: "linear-gradient(135deg,#7C6FFD,#5548c8)", borderRadius: 11, margin: "0 auto 8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ color: "#fff", fontSize: 15, fontWeight: 800 }}>CP</span>
                    </div>
                    <p style={{ color: "rgba(255,255,255,0.25)", fontSize: 9, letterSpacing: "0.3em" }}>CHURCHPRESENT</p>
                  </div>
                ) : mode === "black" ? null
                : !currentSlide ? (
                  <p style={{ color: "rgba(255,255,255,0.12)", fontSize: 13 }}>Pilih lagu atau ayat untuk mulai</p>
                ) : (
                  <div style={{ textAlign: "center", padding: "0 8%", width: "100%" }}>
                    {currentSlide.section && (
                      <p style={{ color: "rgba(255,255,255,0.28)", fontSize: 10, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8 }}>
                        {currentSlide.section}
                      </p>
                    )}
                    <p style={{ color: "#fff", fontSize: 17, fontWeight: 700, lineHeight: 1.4, whiteSpace: "pre-line", textShadow: "0 2px 16px rgba(0,0,0,1)" }}>
                      {currentSlide.content.split("\n").slice(0, 4).join("\n")}
                      {currentSlide.content.split("\n").length > 4 ? "\n…" : ""}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Navigation strip */}
            <div className="flex items-center gap-2 px-3 py-2.5 border-t"
              style={{ borderColor: "var(--color-border)" }}>
              <button onClick={goPrev} disabled={queueIndex === 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border disabled:opacity-30 transition-all shrink-0"
                style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </button>
              <div className="flex flex-1 gap-1 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
                {queue.slice(Math.max(0, queueIndex - 1), queueIndex + 7).map((s, i) => {
                  const abs = Math.max(0, queueIndex - 1) + i
                  return (
                    <button key={s.id} onClick={() => goToSlide(abs)}
                      className="shrink-0 px-2 py-1 rounded text-[10px] font-medium transition-all max-w-[80px] truncate"
                      style={{
                        background: abs === queueIndex ? "var(--color-brand)" : "var(--color-surface-4)",
                        color: abs === queueIndex ? "#fff" : "var(--color-text-muted)",
                      }}>
                      {s.content.split("\n")[0].slice(0, 14)}
                    </button>
                  )
                })}
              </div>
              <button onClick={goNext} disabled={queueIndex >= queue.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs border disabled:opacity-30 transition-all shrink-0"
                style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-secondary)" }}>
                Next <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Next slide strip */}
          {nextSlide && (
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl border"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
              <span className="text-[10px] font-bold uppercase tracking-wider shrink-0"
                style={{ color: "var(--color-text-muted)" }}>BERIKUTNYA</span>
              {nextSlide.section && (
                <span className="text-[10px] px-1.5 py-0.5 rounded font-semibold shrink-0"
                  style={{ background: "var(--color-surface-4)", color: "var(--color-brand)" }}>
                  {nextSlide.section}
                </span>
              )}
              <p className="text-xs truncate" style={{ color: "var(--color-text-secondary)" }}>
                {nextSlide.content.split("\n")[0]}
              </p>
            </div>
          )}

          {/* Two column: songs + stage */}
          <div className="grid grid-cols-2 gap-4">
            {/* Songs */}
            <div className="rounded-xl border overflow-hidden"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
              <div className="flex items-center justify-between px-4 py-2.5 border-b"
                style={{ borderColor: "var(--color-border)" }}>
                <div className="flex items-center gap-2">
                  <Music2 className="w-3.5 h-3.5" style={{ color: "var(--color-brand)" }} />
                  <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>Lagu</span>
                  {favSongs.length > 0 && (
                    <span className="text-[9px] px-1.5 py-0.5 rounded font-bold"
                      style={{ background: "var(--color-warn-dim)", color: "var(--color-warn)" }}>
                      ★ Favorit
                    </span>
                  )}
                </div>
                <Link href="/songs" className="flex items-center gap-1 text-[10px]"
                  style={{ color: "var(--color-text-muted)" }}>
                  Semua <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
              <div>
                {displaySongs.map(song => {
                  const isPlaying = useSongStore.getState().selectedSong?.id === song.id
                  return (
                    <button key={song.id} onClick={() => handlePlay(song)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all border-b last:border-0 group"
                      style={{
                        borderColor: "var(--color-border)",
                        background: isPlaying ? "var(--color-brand-glow)" : "transparent",
                      }}>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-medium truncate"
                            style={{ color: "var(--color-text-primary)" }}>{song.title}</span>
                          {song.favorite && <Star className="w-2.5 h-2.5 shrink-0" style={{ color: "var(--color-warn)" }} fill="currentColor" />}
                        </div>
                        {song.artist && (
                          <p className="text-[10px] truncate" style={{ color: "var(--color-text-muted)" }}>{song.artist}</p>
                        )}
                      </div>
                      {isPlaying
                        ? <span className="text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse-live shrink-0"
                            style={{ background: "var(--color-live-dim)", color: "var(--color-live)" }}>LIVE</span>
                        : <Play className="w-3 h-3 opacity-0 group-hover:opacity-100 shrink-0 transition-opacity" style={{ color: "var(--color-brand)" }} />
                      }
                    </button>
                  )
                })}
                {songs.length === 0 && (
                  <p className="px-4 py-4 text-xs text-center" style={{ color: "var(--color-text-muted)" }}>
                    <Link href="/songs/new" style={{ color: "var(--color-brand)" }}>+ Tambah lagu</Link>
                  </p>
                )}
              </div>
            </div>

            {/* Stage controls */}
            <div className="rounded-xl border overflow-hidden"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
              <div className="flex items-center gap-2 px-4 py-2.5 border-b"
                style={{ borderColor: "var(--color-border)" }}>
                <Monitor className="w-3.5 h-3.5" style={{ color: "var(--color-chorus)" }} />
                <span className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>Kontrol Stage</span>
                {timerRunning && (
                  <span className="ml-auto text-xs font-mono font-bold tabular-nums"
                    style={{ color: timerColor }}>
                    ⏱ {fmt(remaining)}
                  </span>
                )}
              </div>
              <div className="p-4 space-y-4">
                {/* Message */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: "var(--color-text-muted)" }}>Pesan ke Stage</p>
                  <div className="flex gap-2">
                    <input value={msgDraft} onChange={e => setMsgDraft(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSendMsg()}
                      placeholder="Pesan untuk worship team..."
                      className="flex-1 px-3 py-2 rounded-lg text-xs border outline-none"
                      style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
                    <button onClick={handleSendMsg}
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all"
                      style={{ background: "var(--color-brand)", color: "#fff" }}>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {message && (
                    <div className="flex items-center justify-between mt-1.5 px-3 py-2 rounded-lg"
                      style={{ background: "var(--color-brand-glow)", border: "1px solid var(--color-border-active)" }}>
                      <span className="text-[11px] truncate" style={{ color: "var(--color-text-secondary)" }}>
                        📢 {message}
                      </span>
                      <button onClick={clearMessage} className="ml-2 shrink-0">
                        <X className="w-3 h-3" style={{ color: "var(--color-text-muted)" }} />
                      </button>
                    </div>
                  )}
                </div>

                {/* Timer */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider mb-2"
                    style={{ color: "var(--color-text-muted)" }}>Hitung Mundur</p>

                  {/* Timer display when running */}
                  {timerRunning && (
                    <div className="mb-2 px-3 py-2 rounded-lg flex items-center gap-2"
                      style={{ background: remaining < 60 ? "var(--color-danger-dim)" : "var(--color-warn-dim)" }}>
                      <span className="text-lg font-mono font-bold tabular-nums" style={{ color: timerColor }}>
                        {fmt(remaining)}
                      </span>
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)" }}>
                        <div className="h-full rounded-full transition-all" style={{
                          width: `${(remaining / timerSeconds) * 100}%`,
                          background: timerColor,
                          transition: "width 1s linear",
                        }} />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <input value={timerMin} onChange={e => setTimerMin(e.target.value)}
                        type="number" min="1" max="120" disabled={timerRunning}
                        className="w-14 px-2 py-1.5 rounded-lg text-xs border outline-none text-center disabled:opacity-50"
                        style={{ background: "var(--color-surface-3)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
                      <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>mnt</span>
                    </div>
                    <div className="flex gap-1">
                      {/* Quick presets */}
                      {["3","5","10","15"].map(n => (
                        <button key={n} onClick={() => { setTimerMin(n); if (!timerRunning) { setTimer(parseInt(n) * 60) } }}
                          className="px-2 py-1 rounded text-[10px] font-semibold transition-all"
                          style={{
                            background: timerMin === n ? "var(--color-surface-5)" : "var(--color-surface-4)",
                            color: "var(--color-text-muted)",
                          }}>
                          {n}m
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={timerRunning ? stopTimer : handleStartTimer}
                      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all"
                      style={{
                        background: timerRunning ? "var(--color-warn-dim)" : "var(--color-surface-4)",
                        color: timerRunning ? "var(--color-warn)" : "var(--color-text-secondary)",
                      }}>
                      {timerRunning ? <><Pause className="w-3 h-3" /> Stop</> : <><Play className="w-3 h-3" /> Mulai</>}
                    </button>
                    <button onClick={resetTimer}
                      className="w-7 h-7 rounded-lg flex items-center justify-center transition-all"
                      style={{ background: "var(--color-surface-4)", color: "var(--color-text-muted)" }}
                      title="Reset">
                      <RotateCcw className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick nav */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { href: "/bible",        icon: BookOpen,   label: "Alkitab",      color: "var(--color-chorus)", desc: "Cari & sajikan ayat" },
              { href: "/service",      icon: LayoutList, label: "Alur Ibadah",  color: "var(--color-brand)",  desc: "Atur urutan ibadah" },
              { href: "/announcement", icon: Megaphone,  label: "Pengumuman",   color: "var(--color-tag)",    desc: "Kelola & sajikan" },
            ].map(({ href, icon: Icon, label, color, desc }) => (
              <Link key={href} href={href}
                className="flex items-center gap-3 px-4 py-3.5 rounded-xl border transition-all group"
                style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${color}15` }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold" style={{ color: "var(--color-text-primary)" }}>{label}</p>
                  <p className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{desc}</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5 ml-auto opacity-0 group-hover:opacity-100 shrink-0 transition-opacity"
                  style={{ color: "var(--color-text-muted)" }} />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AppShell>
  )
}

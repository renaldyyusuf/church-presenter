"use client"

import { AppShell } from "@/components/layout/AppShell"
import { useSongStore } from "@/stores/songStore"
import { useSongsInit } from "@/hooks/useSongs"
import { usePresentationStore } from "@/stores/presentationStore"
import { lyricsToSlides, parseLyrics, SECTION_COLORS } from "@/lib/lyrics/parser"
import {
  Music2, Plus, Search, Star, Play, Edit2, Heart,
  ChevronRight, ChevronDown, Loader2,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import type { Song, SectionType } from "@/types"

export default function SongsPage() {
  const { songs, selectedSong, selectSong, searchQuery, setSearch, toggleFavorite } = useSongStore()
  const { loading, error } = useSongsInit()
  const { setQueue, setMode } = usePresentationStore()
  const [filterFav, setFilterFav] = useState(false)
  const [filterCat, setFilterCat] = useState<string | null>(null)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = songs.filter(s => {
    const q = searchQuery.toLowerCase()
    return (
      (!q || s.title.toLowerCase().includes(q) || (s.artist ?? "").toLowerCase().includes(q) || s.tags.some(t => t.includes(q)))
      && (!filterFav || s.favorite)
      && (!filterCat || s.category === filterCat)
    )
  })

  const categories = Array.from(new Set(songs.map(s => s.category).filter(Boolean)))

  const handlePlay = (song: Song) => {
    selectSong(song)
    setQueue(lyricsToSlides(song.lyrics_raw, song.id), 0)
    setMode("live")
  }

  return (
    <AppShell>
      <div className="p-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--color-text-primary)" }}>Song Library</h1>
            <p className="text-sm mt-0.5" style={{ color: "var(--color-text-muted)" }}>
              {loading ? "Memuat lagu..." : `${songs.length} lagu`}
            </p>
          </div>
          <Link href="/songs/new"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold"
            style={{ background: "var(--color-brand)", color: "white" }}>
            <Plus className="w-4 h-4" /> Tambah Lagu
          </Link>
        </div>

        {/* Supabase status banner */}
        {error && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl border text-sm"
            style={{ background: "var(--color-warn-dim)", borderColor: "var(--color-warn)", color: "var(--color-warn)" }}>
            <span>⚠</span>
            <span>{error}</span>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "var(--color-text-muted)" }} />
            <input value={searchQuery} onChange={e => setSearch(e.target.value)}
              placeholder="Cari judul, artis, tag..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg text-sm border outline-none"
              style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)", color: "var(--color-text-primary)" }} />
          </div>
          <button onClick={() => setFilterFav(!filterFav)}
            className="flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm border transition-all"
            style={{
              background: filterFav ? "var(--color-warn-dim)" : "var(--color-surface-2)",
              borderColor: filterFav ? "var(--color-warn)" : "var(--color-border)",
              color: filterFav ? "var(--color-warn)" : "var(--color-text-secondary)",
            }}>
            <Heart className="w-3.5 h-3.5" fill={filterFav ? "currentColor" : "none"} /> Favorit
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setFilterCat(filterCat === cat ? null : cat!)}
              className="px-3 py-2.5 rounded-lg text-sm border transition-all"
              style={{
                background: filterCat === cat ? "var(--color-brand-glow)" : "var(--color-surface-2)",
                borderColor: filterCat === cat ? "var(--color-brand)" : "var(--color-border)",
                color: filterCat === cat ? "var(--color-brand)" : "var(--color-text-secondary)",
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: "var(--color-brand)" }} />
            <span className="ml-3 text-sm" style={{ color: "var(--color-text-muted)" }}>Memuat dari database...</span>
          </div>
        )}

        {/* Songs */}
        {!loading && (
          <div className="space-y-2">
            {filtered.map(song => {
              const isActive = (selectedSong as Song | null)?.id === song.id
              const isExpanded = expandedId === song.id
              const sections = parseLyrics(song.lyrics_raw)
              return (
                <div key={song.id} className="rounded-xl border overflow-hidden transition-all"
                  style={{
                    background: isActive ? "var(--color-brand-glow)" : "var(--color-surface-2)",
                    borderColor: isActive ? "var(--color-border-active)" : "var(--color-border)",
                    borderLeft: `3px solid ${isActive ? "var(--color-brand)" : "var(--color-surface-4)"}`,
                  }}>
                  <div className="flex items-center gap-3 px-4 py-3.5 group">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
                      style={{ background: isActive ? "var(--color-brand)" : "var(--color-surface-3)" }}>
                      <Music2 className="w-4 h-4" style={{ color: isActive ? "#fff" : "var(--color-brand)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm" style={{ color: "var(--color-text-primary)" }}>
                          {song.title}
                        </span>
                        {song.favorite && <Star className="w-3.5 h-3.5" style={{ color: "var(--color-warn)" }} fill="currentColor" />}
                        {isActive && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded animate-pulse-live"
                            style={{ background: "var(--color-live-dim)", color: "var(--color-live)" }}>
                            LIVE
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        {song.artist && <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>{song.artist}</span>}
                        {song.category && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded"
                            style={{ background: "var(--color-surface-4)", color: "var(--color-text-muted)" }}>
                            {song.category}
                          </span>
                        )}
                      </div>
                    </div>

                    <button onClick={() => setExpandedId(isExpanded ? null : song.id)}
                      className="hidden group-hover:flex items-center gap-1 px-2 py-1 rounded-lg text-xs"
                      style={{ color: "var(--color-text-muted)", background: "var(--color-surface-3)" }}>
                      {sections.length} seksi
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>

                    <div className="flex items-center gap-1">
                      <button onClick={() => toggleFavorite(song.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        style={{ color: song.favorite ? "var(--color-warn)" : "var(--color-text-muted)" }}>
                        <Star className="w-4 h-4" fill={song.favorite ? "currentColor" : "none"} />
                      </button>
                      <Link href={`/songs/${song.id}/edit`}
                        className="w-8 h-8 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all"
                        style={{ color: "var(--color-text-muted)" }}>
                        <Edit2 className="w-4 h-4" />
                      </Link>
                      <button onClick={() => handlePlay(song)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                        style={{ background: "var(--color-brand)", color: "white" }}>
                        <Play className="w-3.5 h-3.5" fill="currentColor" /> Sajikan
                      </button>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="border-t px-4 py-3"
                      style={{ borderColor: "var(--color-border)", background: "var(--color-surface-1)" }}>
                      <div className="flex flex-wrap gap-2">
                        {sections.map((s, i) => (
                          <div key={i} className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border"
                            style={{ background: "var(--color-surface-2)", borderColor: "var(--color-border)" }}>
                            <div className="w-2 h-2 rounded-full"
                              style={{ background: SECTION_COLORS[s.type as SectionType] ?? "#888" }} />
                            <span className="text-xs font-medium" style={{ color: "var(--color-text-secondary)" }}>{s.label}</span>
                            <span className="text-[10px]" style={{ color: "var(--color-text-muted)" }}>{s.lines.length}B</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {!loading && filtered.length === 0 && (
              <div className="text-center py-16 rounded-xl border"
                style={{ borderColor: "var(--color-border)", background: "var(--color-surface-2)" }}>
                <Music2 className="w-10 h-10 mx-auto mb-3" style={{ color: "var(--color-text-muted)" }} />
                <p className="font-medium" style={{ color: "var(--color-text-secondary)" }}>Tidak ada lagu ditemukan</p>
                <Link href="/songs/new"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-lg text-sm font-semibold"
                  style={{ background: "var(--color-brand)", color: "white" }}>
                  <Plus className="w-4 h-4" /> Tambah Lagu
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </AppShell>
  )
}

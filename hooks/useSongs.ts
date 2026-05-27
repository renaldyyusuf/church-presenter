"use client"

import { useEffect, useState } from "react"
import { useSongStore }        from "@/stores/songStore"
import { DEMO_SONGS }          from "@/lib/data/demo"
import { toast }               from "@/components/ui/Toast"
import type { Song }           from "@/types"

const hasSupabase = () =>
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxx")

export function useSongsInit() {
  const { songs, setSongs, addSong, updateSong: patchStore, deleteSong: removeStore } = useSongStore()
  const [loading, setLoading]   = useState(false)
  const [error,   setError]     = useState<string | null>(null)

  useEffect(() => {
    if (songs.length > 0) return
    const load = async () => {
      setLoading(true)
      try {
        if (hasSupabase()) {
          const { fetchSongs } = await import("@/lib/supabase/songs")
          const data = await fetchSongs()
          setSongs(data.length > 0 ? data : DEMO_SONGS)
        } else {
          setSongs(DEMO_SONGS)
        }
      } catch {
        setSongs(DEMO_SONGS)
        setError("Menggunakan data demo — Supabase belum dikonfigurasi")
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const saveSong = async (song: Omit<Song, "id" | "created_at" | "updated_at">): Promise<Song> => {
    const newSong: Song = {
      ...song, id: `song-${Date.now()}`,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    }
    addSong(newSong)
    if (hasSupabase()) {
      try {
        const { createSong } = await import("@/lib/supabase/songs")
        const saved = await createSong(song)
        if (saved) { removeStore(newSong.id); addSong(saved) }
      } catch { /* keep local */ }
    }
    toast.success("Lagu disimpan", song.title)
    return newSong
  }

  const editSong = async (id: string, updates: Partial<Song>) => {
    patchStore(id, updates)
    if (hasSupabase()) {
      try {
        const { updateSong } = await import("@/lib/supabase/songs")
        await updateSong(id, updates)
      } catch { /* keep local */ }
    }
    toast.success("Lagu diperbarui")
  }

  const removeSong = async (id: string) => {
    const song = songs.find(s => s.id === id)
    removeStore(id)
    if (hasSupabase()) {
      try {
        const { deleteSong } = await import("@/lib/supabase/songs")
        await deleteSong(id)
      } catch { /* keep local */ }
    }
    toast.success("Lagu dihapus", song?.title)
  }

  return { loading, error, saveSong, editSong, removeSong }
}

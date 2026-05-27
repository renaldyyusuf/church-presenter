import { getSupabase } from "./client"
import { DEMO_SONGS } from "@/lib/data/demo"
import type { Song } from "@/types"

export async function fetchSongs(): Promise<Song[]> {
  try {
    const sb = getSupabase()
    const { data, error } = await sb
      .from("songs")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) throw error
    return (data ?? []) as Song[]
  } catch {
    // Fallback to demo songs if Supabase not configured
    return DEMO_SONGS
  }
}

export async function createSong(song: Omit<Song, "id" | "created_at" | "updated_at">): Promise<Song | null> {
  try {
    const sb = getSupabase()
    const { data, error } = await sb.from("songs").insert(song).select().single()
    if (error) throw error
    return data as Song
  } catch {
    return null
  }
}

export async function updateSong(id: string, updates: Partial<Song>): Promise<Song | null> {
  try {
    const sb = getSupabase()
    const { data, error } = await sb
      .from("songs")
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single()
    if (error) throw error
    return data as Song
  } catch {
    return null
  }
}

export async function deleteSong(id: string): Promise<boolean> {
  try {
    const sb = getSupabase()
    const { error } = await sb.from("songs").delete().eq("id", id)
    return !error
  } catch {
    return false
  }
}

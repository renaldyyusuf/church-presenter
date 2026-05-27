import { getSupabase } from "./client"
import type { Media } from "@/types"

export async function fetchMedia(): Promise<Media[]> {
  try {
    const sb = getSupabase()
    const { data, error } = await sb
      .from("media")
      .select("*")
      .order("created_at", { ascending: false })
    if (error) throw error
    return (data ?? []) as Media[]
  } catch { return [] }
}

export async function uploadMedia(file: File, tags: string[] = []): Promise<Media | null> {
  try {
    const sb = getSupabase()
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin"
    const path = `uploads/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`

    const { error: uploadError } = await sb.storage.from("media").upload(path, file)
    if (uploadError) throw uploadError

    const { data: urlData } = sb.storage.from("media").getPublicUrl(path)

    const type = file.type.startsWith("video") ? "video"
      : file.type.startsWith("image") ? "image" : "image"

    const { data, error } = await sb.from("media").insert({
      name: file.name.replace(/\.[^/.]+$/, ""),
      type,
      path,
      url: urlData.publicUrl,
      size_bytes: file.size,
      tags,
    }).select().single()

    if (error) throw error
    return data as Media
  } catch { return null }
}

export async function deleteMedia(id: string, path: string): Promise<void> {
  try {
    const sb = getSupabase()
    await sb.storage.from("media").remove([path])
    await sb.from("media").delete().eq("id", id)
  } catch {}
}

export async function fetchThemes() {
  try {
    const sb = getSupabase()
    const { data } = await sb.from("themes").select("*").order("created_at")
    return data ?? []
  } catch { return [] }
}

export async function upsertTheme(theme: Record<string, unknown>) {
  try {
    const sb = getSupabase()
    const { data } = await sb.from("themes").upsert(theme, { onConflict: "id" }).select().single()
    return data
  } catch { return null }
}

/**
 * Supabase Realtime — Live Session Sync
 *
 * Replaces BroadcastChannel for cross-device, cross-network sync.
 * The operator writes to `live_sessions` table; output/stage screens
 * subscribe via Supabase Realtime postgres_changes.
 *
 * Session key = one per church service (e.g. "default" or date-based)
 */

import { getSupabase } from "./client"
import type { RealtimeChannel } from "@supabase/supabase-js"

const SESSION_KEY = "default"

export interface LiveSessionPayload {
  current_slide_id?: string | null
  current_slide_content?: string | null
  current_slide_section?: string | null
  next_slide_content?: string | null
  next_slide_section?: string | null
  mode?: string
  theme?: Record<string, unknown> | null
  stage_message?: string | null
  timer_seconds?: number
  timer_running?: boolean
}

// Upsert live session state (called by operator/control)
export async function pushLiveState(payload: LiveSessionPayload) {
  try {
    const sb = getSupabase()
    await sb.from("live_sessions").upsert(
      { session_key: SESSION_KEY, ...payload, updated_at: new Date().toISOString() },
      { onConflict: "session_key" }
    )
  } catch {
    // Silently fail — BroadcastChannel still works as fallback
  }
}

// Fetch current live state (called on page load by output/stage)
export async function getLiveState(): Promise<LiveSessionPayload | null> {
  try {
    const sb = getSupabase()
    const { data } = await sb
      .from("live_sessions")
      .select("*")
      .eq("session_key", SESSION_KEY)
      .single()
    return data
  } catch {
    return null
  }
}

// Subscribe to real-time changes (called by output/stage pages)
export function subscribeLiveState(
  onUpdate: (payload: LiveSessionPayload) => void
): RealtimeChannel {
  const sb = getSupabase()
  const channel = sb
    .channel("live_session_changes")
    .on(
      "postgres_changes",
      {
        event: "*",
        schema: "public",
        table: "live_sessions",
        filter: `session_key=eq.${SESSION_KEY}`,
      },
      (event) => {
        if (event.new) onUpdate(event.new as LiveSessionPayload)
      }
    )
    .subscribe()
  return channel
}

// Unsubscribe
export function unsubscribeLiveState(channel: RealtimeChannel) {
  const sb = getSupabase()
  sb.removeChannel(channel)
}

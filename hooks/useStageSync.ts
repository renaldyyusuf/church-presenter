"use client"

import { useEffect, useRef } from "react"
import { usePresentationStore } from "@/stores/presentationStore"
import { useStageStore } from "@/stores/stageStore"

const hasSupabase = () =>
  typeof window !== "undefined" &&
  !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("xxxxxxxx")

// ── Operator: broadcast ───────────────────────────────────────────────────────
export function usePresentationBroadcast() {
  const bcRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    bcRef.current = new BroadcastChannel("church-presenter")
    return () => bcRef.current?.close()
  }, [])

  useEffect(() => {
    return usePresentationStore.subscribe((state) => {
      const payload = {
        type: "PRESENTATION_UPDATE",
        currentSlide: state.currentSlide,
        nextSlide: state.nextSlide,
        mode: state.mode,
        activeTheme: state.activeTheme,
        backgroundMedia: state.backgroundMedia,
      }
      bcRef.current?.postMessage(payload)

      if (hasSupabase()) {
        import("@/lib/supabase/realtime").then(({ pushLiveState }) => {
          pushLiveState({
            current_slide_id: state.currentSlide?.id ?? null,
            current_slide_content: state.currentSlide?.content ?? null,
            current_slide_section: state.currentSlide?.section ?? null,
            next_slide_content: state.nextSlide?.content ?? null,
            next_slide_section: state.nextSlide?.section ?? null,
            mode: state.mode,
            theme: state.activeTheme as Record<string, unknown> | null,
          })
        }).catch(() => {})
      }
    })
  }, [])
}

export function useStageBroadcast() {
  const bcRef = useRef<BroadcastChannel | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    bcRef.current = new BroadcastChannel("church-presenter-stage")
    return () => bcRef.current?.close()
  }, [])

  useEffect(() => {
    return useStageStore.subscribe((state) => {
      bcRef.current?.postMessage({
        type: "STAGE_UPDATE",
        message: state.message,
        timerSeconds: state.timerSeconds,
        remaining: state.remaining,
        timerRunning: state.timerRunning,
      })

      if (hasSupabase()) {
        import("@/lib/supabase/realtime").then(({ pushLiveState }) => {
          pushLiveState({
            stage_message: state.message,
            timer_seconds: state.timerSeconds,
            timer_running: state.timerRunning,
          })
        }).catch(() => {})
      }
    })
  }, [])
}

// ── Receivers ─────────────────────────────────────────────────────────────────
export function useReceiveBroadcast() {
  const { receiveSlideChange, receiveModeChange, setTheme, setBackground } = usePresentationStore()

  useEffect(() => {
    if (typeof window === "undefined") return

    // Load initial from Supabase
    if (hasSupabase()) {
      import("@/lib/supabase/realtime").then(async ({ getLiveState, subscribeLiveState }) => {
        const data = await getLiveState()
        if (data?.current_slide_content) {
          receiveSlideChange(
            {
              id: data.current_slide_id ?? `r-${Date.now()}`,
              content: data.current_slide_content,
              section: data.current_slide_section ?? undefined,
              sourceType: "song" as const,
              order: 0,
            } as never,
            data.next_slide_content
              ? { id: `n-${Date.now()}`, content: data.next_slide_content, section: data.next_slide_section ?? undefined, sourceType: "song" as const, order: 1 } as never
              : null
          )
        }
        if (data?.mode) receiveModeChange(data.mode as never)

        const channel = subscribeLiveState((d) => {
          if (d.current_slide_content !== undefined) {
            receiveSlideChange(
              d.current_slide_content ? {
                id: d.current_slide_id ?? `r-${Date.now()}`,
                content: d.current_slide_content,
                section: d.current_slide_section ?? undefined,
                sourceType: "song" as const, order: 0,
              } as never : null as never,
              d.next_slide_content ? {
                id: `n-${Date.now()}`, content: d.next_slide_content,
                section: d.next_slide_section ?? undefined, sourceType: "song" as const, order: 1,
              } as never : null
            )
          }
          if (d.mode) receiveModeChange(d.mode as never)
          if (d.theme) setTheme(d.theme as never)
        })
        return () => {
          import("@/lib/supabase/realtime").then(({ unsubscribeLiveState }) => unsubscribeLiveState(channel))
        }
      }).catch(() => {})
    }

    // BroadcastChannel fallback
    const bc = new BroadcastChannel("church-presenter")
    bc.onmessage = (e) => {
      if (e.data.type !== "PRESENTATION_UPDATE") return
      if (e.data.currentSlide !== undefined) receiveSlideChange(e.data.currentSlide, e.data.nextSlide)
      if (e.data.mode !== undefined) receiveModeChange(e.data.mode)
      if (e.data.activeTheme) setTheme(e.data.activeTheme)
      if (e.data.backgroundMedia !== undefined) setBackground(e.data.backgroundMedia)
    }
    return () => bc.close()
  }, [])
}

export function useReceiveStageBroadcast() {
  const { setMessage, setTimer, startTimer, stopTimer } = useStageStore()

  useEffect(() => {
    if (typeof window === "undefined") return

    const bc = new BroadcastChannel("church-presenter-stage")
    bc.onmessage = (e) => {
      if (e.data.type !== "STAGE_UPDATE") return
      setMessage(e.data.message ?? "")
      setTimer(e.data.timerSeconds ?? 300)
      if (e.data.timerRunning) startTimer(); else stopTimer()
    }
    return () => bc.close()
  }, [])
}

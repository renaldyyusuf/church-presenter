"use client"
import { useEffect } from "react"
import { useStageStore } from "@/stores/stageStore"

/** Mount once in BottomBar (always rendered) — drives the countdown */
export function useGlobalTimer() {
  const tick = useStageStore(s => s.tick)
  useEffect(() => {
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [tick])
}

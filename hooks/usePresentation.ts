"use client"
import { useEffect, useCallback } from "react"
import { usePresentationStore } from "@/stores/presentationStore"

export function useKeyboardShortcuts() {
  const { goNext, goPrev, setMode, mode } = usePresentationStore()

  const handler = useCallback((e: KeyboardEvent) => {
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return
    switch (e.key) {
      case "ArrowRight":
      case "ArrowDown":
      case " ":
        e.preventDefault()
        goNext()
        break
      case "ArrowLeft":
      case "ArrowUp":
        e.preventDefault()
        goPrev()
        break
      case "b":
      case "B":
        setMode(mode === "black" ? "live" : "black")
        break
      case "l":
      case "L":
        setMode(mode === "logo" ? "live" : "logo")
        break
      case "Escape":
        setMode("clear")
        break
    }
  }, [goNext, goPrev, setMode, mode])

  useEffect(() => {
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [handler])
}

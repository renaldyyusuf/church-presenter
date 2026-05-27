import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Slide, PresentationMode, Theme, Media } from '@/types'

interface PresentationState {
  currentSlide: Slide | null
  nextSlide: Slide | null
  queue: Slide[]
  queueIndex: number
  mode: PresentationMode
  activeTheme: Theme | null
  backgroundMedia: Media | null
  isLive: boolean

  // Actions
  setQueue: (slides: Slide[], startIndex?: number) => void
  goToSlide: (index: number) => void
  goNext: () => void
  goPrev: () => void
  setMode: (mode: PresentationMode) => void
  setTheme: (theme: Theme) => void
  setBackground: (media: Media | null) => void
  setLive: (live: boolean) => void
  // Called by socket listeners on output/stage screens
  receiveSlideChange: (current: Slide, next: Slide | null) => void
  receiveModeChange: (mode: PresentationMode) => void
}

export const usePresentationStore = create<PresentationState>()(
  devtools(
    (set, get) => ({
      currentSlide: null,
      nextSlide: null,
      queue: [],
      queueIndex: 0,
      mode: 'clear',
      activeTheme: null,
      backgroundMedia: null,
      isLive: false,

      setQueue: (slides, startIndex = 0) => {
        set({
          queue: slides,
          queueIndex: startIndex,
          currentSlide: slides[startIndex] ?? null,
          nextSlide: slides[startIndex + 1] ?? null,
        })
      },

      goToSlide: (index) => {
        const { queue } = get()
        if (index < 0 || index >= queue.length) return
        set({
          queueIndex: index,
          currentSlide: queue[index],
          nextSlide: queue[index + 1] ?? null,
        })
      },

      goNext: () => {
        const { queueIndex, queue } = get()
        const next = Math.min(queueIndex + 1, queue.length - 1)
        get().goToSlide(next)
      },

      goPrev: () => {
        const { queueIndex } = get()
        get().goToSlide(Math.max(queueIndex - 1, 0))
      },

      setMode: (mode) => set({ mode }),

      setTheme: (theme) => set({ activeTheme: theme }),

      setBackground: (media) => set({ backgroundMedia: media }),

      setLive: (live) => set({ isLive: live }),

      receiveSlideChange: (current, next) => set({ currentSlide: current, nextSlide: next }),

      receiveModeChange: (mode) => set({ mode }),
    }),
    { name: 'presentation' }
  )
)

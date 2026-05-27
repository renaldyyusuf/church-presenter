import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

interface StageState {
  message: string
  timerSeconds: number   // total seconds set
  remaining: number      // actual countdown value
  timerRunning: boolean

  setMessage: (msg: string) => void
  clearMessage: () => void
  setTimer: (seconds: number) => void
  startTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  tick: () => void       // called every second
}

export const useStageStore = create<StageState>()(
  devtools(
    (set, get) => ({
      message: '',
      timerSeconds: 300,
      remaining: 300,
      timerRunning: false,

      setMessage: (message) => set({ message }),
      clearMessage: () => set({ message: '' }),

      setTimer: (timerSeconds) => set({ timerSeconds, remaining: timerSeconds }),

      startTimer: () => set({ timerRunning: true }),
      stopTimer:  () => set({ timerRunning: false }),
      resetTimer: () => {
        const { timerSeconds } = get()
        set({ timerRunning: false, remaining: timerSeconds })
      },

      tick: () => {
        const { remaining, timerRunning } = get()
        if (!timerRunning || remaining <= 0) {
          if (remaining <= 0) set({ timerRunning: false })
          return
        }
        set({ remaining: remaining - 1 })
      },
    }),
    { name: 'stage' }
  )
)

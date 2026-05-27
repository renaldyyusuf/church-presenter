import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { BibleVerse, Slide } from '@/types'

interface BibleState {
  translation: string
  searchQuery: string
  results: BibleVerse[]
  selectedVerses: BibleVerse[]
  slides: Slide[]

  setTranslation: (t: string) => void
  setSearch: (q: string) => void
  setResults: (results: BibleVerse[]) => void
  toggleVerse: (verse: BibleVerse) => void
  clearSelection: () => void
  generateSlides: () => void
}

export const useBibleStore = create<BibleState>()(
  devtools(
    (set, get) => ({
      translation: 'KJV',
      searchQuery: '',
      results: [],
      selectedVerses: [],
      slides: [],

      setTranslation: (translation) => set({ translation }),
      setSearch: (searchQuery) => set({ searchQuery }),
      setResults: (results) => set({ results }),
      toggleVerse: (verse) => set(s => {
        const exists = s.selectedVerses.some(v => v.id === verse.id)
        return { selectedVerses: exists ? s.selectedVerses.filter(v => v.id !== verse.id) : [...s.selectedVerses, verse] }
      }),
      clearSelection: () => set({ selectedVerses: [] }),
      generateSlides: () => {
        const { selectedVerses, results } = get()
        const toSlide = selectedVerses.length > 0 ? selectedVerses : results
        const slides: Slide[] = toSlide.map((v, i) => ({
          id: `bible-${v.book}-${v.chapter}-${v.verse}`,
          content: v.content,
          section: `${v.book} ${v.chapter}:${v.verse}`,
          sourceType: 'bible' as const,
          sourceId: v.id,
          order: i,
        }))
        set({ slides })
      },
    }),
    { name: 'bible' }
  )
)

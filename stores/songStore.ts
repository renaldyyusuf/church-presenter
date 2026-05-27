import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Song } from '@/types'

interface SongState {
  songs: Song[]
  selectedSong: Song | null
  searchQuery: string
  filters: { tags: string[]; category: string | null; favorite: boolean }

  setSongs: (songs: Song[]) => void
  addSong: (song: Song) => void
  updateSong: (id: string, updates: Partial<Song>) => void
  deleteSong: (id: string) => void
  selectSong: (song: Song | null) => void
  setSearch: (q: string) => void
  toggleFavorite: (id: string) => void
  setFilters: (f: Partial<SongState['filters']>) => void
}

export const useSongStore = create<SongState>()(
  devtools(
    (set, get) => ({
      songs: [],
      selectedSong: null,
      searchQuery: '',
      filters: { tags: [], category: null, favorite: false },

      setSongs: (songs) => set({ songs }),
      addSong: (song) => set(s => ({ songs: [...s.songs, song] })),
      updateSong: (id, updates) => set(s => ({
        songs: s.songs.map(song => song.id === id ? { ...song, ...updates } : song)
      })),
      deleteSong: (id) => set(s => ({ songs: s.songs.filter(song => song.id !== id) })),
      selectSong: (song) => set({ selectedSong: song }),
      setSearch: (searchQuery) => set({ searchQuery }),
      toggleFavorite: (id) => set(s => ({
        songs: s.songs.map(song => song.id === id ? { ...song, favorite: !song.favorite } : song)
      })),
      setFilters: (f) => set(s => ({ filters: { ...s.filters, ...f } })),
    }),
    { name: 'songs' }
  )
)

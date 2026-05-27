// ─── Song ────────────────────────────────────────────────────────────────────

export type SectionType = 'verse' | 'chorus' | 'bridge' | 'tag' | 'pre-chorus' | 'outro'

export interface LyricsSection {
  type: SectionType
  label: string
  lines: string[]
}

export interface Song {
  id: string
  title: string
  artist?: string
  lyrics_raw: string
  tags: string[]
  category?: string
  favorite: boolean
  theme_id?: string
  created_at: string
  updated_at: string
}

// ─── Slide ───────────────────────────────────────────────────────────────────

export type SlideSourceType = 'song' | 'bible' | 'announcement' | 'blank'

export interface Slide {
  id: string
  content: string
  section?: string
  sourceType: SlideSourceType
  sourceId?: string
  order: number
  // Optional per-slide background override
  backgroundMediaUrl?: string
  backgroundMediaType?: 'image' | 'video'
  themeOverride?: Partial<Theme>
}

// ─── Presentation ────────────────────────────────────────────────────────────

export type PresentationMode = 'live' | 'black' | 'logo' | 'clear'

// ─── Bible ───────────────────────────────────────────────────────────────────

export interface BibleVerse {
  id: string
  translation: string
  book: string
  book_number: number
  chapter: number
  verse: number
  content: string
}

// ─── Service ─────────────────────────────────────────────────────────────────

export type ServiceItemType = 'song' | 'bible' | 'video' | 'image' | 'announcement'

export interface ServiceItem {
  id: string
  service_id: string
  type: ServiceItemType
  ref_id?: string
  label: string
  notes?: string
  item_order: number
  metadata: Record<string, unknown>
  song?: Song
  slides?: Slide[]
}

export interface Service {
  id: string
  name: string
  date?: string
  created_at: string
  updated_at: string
  items?: ServiceItem[]
}

// ─── Media ───────────────────────────────────────────────────────────────────

export type MediaType = 'image' | 'video' | 'loop' | 'countdown'

export interface Media {
  id: string
  name: string
  type: MediaType
  path: string
  url?: string
  size_bytes?: number
  tags: string[]
  created_at: string
}

// ─── Theme ───────────────────────────────────────────────────────────────────

export type TextAlignment = 'left' | 'center' | 'right'
export type TextPosition  = 'top' | 'center' | 'bottom'

export interface Theme {
  id: string
  name: string
  font_family: string
  font_size: number
  font_weight: number
  text_align: TextAlignment
  text_color: string
  shadow: boolean
  shadow_blur: number
  stroke: boolean
  stroke_color: string
  stroke_width: number
  bg_opacity: number
  position: TextPosition
  is_default: boolean
  created_at: string
}

// ─── Search ──────────────────────────────────────────────────────────────────

export type SearchResultType = 'song' | 'bible' | 'announcement'

export interface SearchResult {
  id: string
  type: SearchResultType
  title: string
  subtitle?: string
  tags?: string[]
}

// ─── Socket Events ───────────────────────────────────────────────────────────

export interface SocketSlideChangePayload  { current: Slide; next: Slide | null }
export interface SocketModeChangePayload   { mode: PresentationMode }
export interface SocketStageMessagePayload { text: string }
export interface SocketTimerPayload        { action: 'start' | 'stop' | 'reset'; seconds?: number }

import type { LyricsSection, SectionType, Slide } from '@/types'

const SECTION_PATTERNS: Record<SectionType, RegExp> = {
  verse: /^(VERSE\s*\d*|V\d+)/i,
  chorus: /^(CHORUS|CHO|C\b)/i,
  bridge: /^(BRIDGE|BRDG)/i,
  tag: /^(TAG|CODA)/i,
  'pre-chorus': /^(PRE[- ]?CHORUS|PRE\b)/i,
  outro: /^(OUTRO|ENDING|END\b)/i,
}

function detectType(label: string): SectionType {
  for (const [type, regex] of Object.entries(SECTION_PATTERNS)) {
    if (regex.test(label.trim())) return type as SectionType
  }
  return 'verse'
}

export function parseLyrics(raw: string): LyricsSection[] {
  const lines = raw.split('\n')
  const sections: LyricsSection[] = []
  let current: LyricsSection | null = null

  for (const line of lines) {
    const trimmed = line.trim()
    if (!trimmed) continue

    const isHeader = Object.values(SECTION_PATTERNS).some(r => r.test(trimmed))
    if (isHeader) {
      if (current && current.lines.length > 0) sections.push(current)
      current = { type: detectType(trimmed), label: trimmed, lines: [] }
    } else if (current) {
      current.lines.push(trimmed)
    } else {
      // Lines before any section header → treat as verse 1
      current = { type: 'verse', label: 'VERSE 1', lines: [trimmed] }
    }
  }

  if (current && current.lines.length > 0) sections.push(current)
  return sections
}

function chunkLines(lines: string[], size: number): string[][] {
  const chunks: string[][] = []
  for (let i = 0; i < lines.length; i += size) {
    chunks.push(lines.slice(i, i + size))
  }
  return chunks
}

export function sectionsToSlides(sections: LyricsSection[], songId: string): Slide[] {
  return sections.flatMap((section, i) =>
    chunkLines(section.lines, 4).map((chunk, j) => ({
      id: `${songId}-s${i}-c${j}`,
      content: chunk.join('\n'),
      section: section.label,
      sourceType: 'song' as const,
      sourceId: songId,
      order: i * 100 + j,
    }))
  )
}

export function lyricsToSlides(raw: string, songId: string): Slide[] {
  const sections = parseLyrics(raw)
  return sectionsToSlides(sections, songId)
}

export const SECTION_COLORS: Record<SectionType, string> = {
  verse: '#6C63FF',
  chorus: '#22C55E',
  bridge: '#F59E0B',
  tag: '#EC4899',
  'pre-chorus': '#06B6D4',
  outro: '#9897A8',
}

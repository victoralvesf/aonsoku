import { CSSProperties } from 'react'

export const chartTooltipStyle: CSSProperties = {
  background: 'hsl(var(--popover))',
  border: '1px solid hsl(var(--border))',
  borderRadius: '8px',
  fontSize: '12px',
  padding: '6px 10px',
  color: 'hsl(var(--popover-foreground))',
}

export const chartTooltipLabelStyle: CSSProperties = {
  color: 'hsl(var(--foreground))',
  fontWeight: 600,
}

export const chartTooltipWrapperStyle: CSSProperties = {
  zIndex: 50,
}

const GENRE_COLORS = [
  'hsl(var(--primary))',
  '#a78bfa',
  '#22d3ee',
  '#f472b6',
  '#fbbf24',
  '#34d399',
  '#f54900',
  '#94a3b8',
]

export function getGenreColor(index: number) {
  return GENRE_COLORS[index % GENRE_COLORS.length]
}

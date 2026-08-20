import { subsonic } from '@/service/subsonic'
import { useAppStore } from '@/store/app.store'
import { usePlayerStore } from '@/store/player.store'
import type { ISong } from '@/types/responses/song'
import { LyricsTab } from './lyrics'

// ---------------------------------------------------------------------------
// Shared LyricsResult mock shapes
// ---------------------------------------------------------------------------

// Word mode — v2 structuredLyric with cueLine data
const wordMock = {
  value: '[00:01.00] Sunlight through the trees',
  lang: 'eng',
  artist: 'Test Artist',
  title: 'Test Song',
  structuredLyric: {
    synced: true,
    kind: 'main',
    lang: 'eng',
    line: [{ start: 1000, value: 'Sunlight through the trees' }],
    cueLine: [
      {
        index: 0,
        value: 'Sunlight through the trees',
        start: 1000,
        end: 4999,
        cue: [
          {
            start: 1000,
            end: 1800,
            value: 'Sunlight',
            byteStart: 0,
            byteEnd: 7,
          },
        ],
      },
    ],
  },
}

// Line mode — synced LRC string, no cueLine
const lineMock = {
  value:
    '[00:01.00] Sunlight through the trees\n[00:05.00] Echo in the valley',
  lang: 'eng',
  artist: 'Test Artist',
  title: 'Test Song',
}

// Plain mode — NOT LRC format (no [00: prefix)
const plainMock = {
  value: 'Sunlight through the trees\nEcho in the valley',
  lang: 'eng',
  artist: 'Test Artist',
  title: 'Test Song',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function setExtensions(v2: boolean) {
  useAppStore.setState((state) => ({
    ...state,
    data: {
      ...state.data,
      extensionsSupported: v2 ? { songLyrics: [1, 2] } : { songLyrics: [1] },
    },
  }))
}

// Each test gets a unique queryKey because the singleton QueryClient (in
// cypress/support/component.tsx) caches by ['get-lyrics', artist, title,
// duration] (see lyrics.tsx). Mutating artist + title per test ensures the
// stub is freshly invoked.
let testCounter = 0

// ---------------------------------------------------------------------------
// Spec
// ---------------------------------------------------------------------------

describe('LyricsTab mode routing', () => {
  beforeEach(() => {
    testCounter += 1
    const tag = `lyrics-t14-${testCounter}-${Date.now()}`

    cy.fixture('songs/song.json').then((song: ISong) => {
      const uniqueSong: ISong = {
        ...song,
        id: tag,
        title: `${song.title} ${tag}`,
        artist: `${song.artist} ${tag}`,
      }
      usePlayerStore.getState().actions.setSongList([uniqueSong], 0)
    })
  })

  afterEach(() => {
    useAppStore.setState((state) => ({
      ...state,
      data: { ...state.data, extensionsSupported: undefined },
    }))
    usePlayerStore.setState((state) => ({
      ...state,
      settings: {
        ...state.settings,
        lyrics: { ...state.settings.lyrics, preferSyncedLyrics: false },
      },
    }))
  })

  // 1. Word mode when v2 + cueLine data + preferSyncedLyrics=true
  it('routes to word mode when v2 extension + cueLine + preferSyncedLyrics=true', () => {
    setExtensions(true)
    usePlayerStore.setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        lyrics: { ...s.settings.lyrics, preferSyncedLyrics: true },
      },
    }))
    cy.stub(subsonic.lyrics, 'getLyrics').resolves(wordMock)

    cy.mount(<LyricsTab />)

    cy.get('[data-testid="lyrics-mode"]').should(
      'have.attr',
      'data-mode',
      'word',
    )
    cy.get('[data-testid="word-sync-lyrics-box"]').should('exist')
  })

  // 2. Line mode when v2 server but no cueLine data
  it('falls back to line mode when v2 server returns no cueLine', () => {
    setExtensions(true)
    usePlayerStore.setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        lyrics: { ...s.settings.lyrics, preferSyncedLyrics: true },
      },
    }))
    cy.stub(subsonic.lyrics, 'getLyrics').resolves(lineMock)

    cy.mount(<LyricsTab />)

    cy.get('[data-testid="lyrics-mode"]').should(
      'have.attr',
      'data-mode',
      'line',
    )
    cy.get('#sync-lyrics-box').should('exist')
    cy.get('[data-testid="word-sync-lyrics-box"]').should('not.exist')
  })

  // 3. Line mode when v1-only server (regression guard)
  it('uses line mode when server only advertises songLyrics v1', () => {
    setExtensions(false)
    usePlayerStore.setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        lyrics: { ...s.settings.lyrics, preferSyncedLyrics: true },
      },
    }))
    cy.stub(subsonic.lyrics, 'getLyrics').resolves(lineMock)

    cy.mount(<LyricsTab />)

    cy.get('[data-testid="lyrics-mode"]').should(
      'have.attr',
      'data-mode',
      'line',
    )
  })

  // 4. Plain mode when preferSyncedLyrics=false (D1 guard)
  it('shows plain mode when preferSyncedLyrics is false, ignoring cueLine data (D1)', () => {
    setExtensions(true)
    usePlayerStore.setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        lyrics: { ...s.settings.lyrics, preferSyncedLyrics: false },
      },
    }))
    cy.stub(subsonic.lyrics, 'getLyrics').resolves(plainMock)

    cy.mount(<LyricsTab />)

    cy.get('[data-testid="lyrics-mode"]').should(
      'have.attr',
      'data-mode',
      'plain',
    )
    cy.get('[data-testid="word-sync-lyrics-box"]').should('not.exist')
  })

  // 5. No word mode when no extension data
  it('does not use word mode when extensionsSupported is empty', () => {
    useAppStore.setState((s) => ({
      ...s,
      data: { ...s.data, extensionsSupported: {} },
    }))
    usePlayerStore.setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        lyrics: { ...s.settings.lyrics, preferSyncedLyrics: true },
      },
    }))
    cy.stub(subsonic.lyrics, 'getLyrics').resolves(lineMock)

    cy.mount(<LyricsTab />)

    cy.get('[data-testid="lyrics-mode"]').should(
      'have.attr',
      'data-mode',
      'line',
    )
  })

  // 6. Loading state shown while query is in flight
  it('shows loading message while lyrics are being fetched', () => {
    setExtensions(true)
    cy.stub(subsonic.lyrics, 'getLyrics').returns(
      new Promise<never>(() => {}),
    )

    cy.mount(<LyricsTab />)

    // Loading state — no lyrics-mode div
    cy.get('[data-testid="lyrics-mode"]').should('not.exist')
  })

  // 7. No lyrics message when service returns undefined
  it('shows no-lyrics message when service returns undefined', () => {
    setExtensions(true)
    usePlayerStore.setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        lyrics: { ...s.settings.lyrics, preferSyncedLyrics: true },
      },
    }))
    cy.stub(subsonic.lyrics, 'getLyrics').resolves(undefined)

    cy.mount(<LyricsTab />)

    cy.get('[data-testid="lyrics-mode"]').should('not.exist')
  })

  // 8. Multi-agent: two agent sub-rows render stacked (D3-revised)
  it('renders two stacked sub-rows for multi-agent structuredLyric', () => {
    setExtensions(true)
    usePlayerStore.setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        lyrics: { ...s.settings.lyrics, preferSyncedLyrics: true },
      },
    }))
    const multiAgentMock = {
      value: '[00:01.00] Together we stand',
      lang: 'eng',
      artist: 'Test',
      title: 'Test',
      structuredLyric: {
        synced: true,
        kind: 'main',
        lang: 'eng',
        agents: [
          { id: 'lead', role: 'main' },
          { id: 'bg', role: 'bg' },
        ],
        line: [{ start: 1000, value: 'Together we stand' }],
        cueLine: [
          {
            index: 0,
            agentId: 'lead',
            value: 'Together we stand',
            start: 1000,
            end: 4000,
            cue: [
              {
                start: 1000,
                end: 4000,
                value: 'Together we stand',
                byteStart: 0,
                byteEnd: 16,
              },
            ],
          },
          {
            index: 0,
            agentId: 'bg',
            value: 'Together we stand',
            start: 1000,
            end: 4000,
            cue: [
              {
                start: 1000,
                end: 4000,
                value: 'Together we stand',
                byteStart: 0,
                byteEnd: 16,
              },
            ],
          },
        ],
      },
    }
    cy.stub(subsonic.lyrics, 'getLyrics').resolves(multiAgentMock)

    cy.mount(<LyricsTab />)

    cy.get('[data-testid="lyrics-mode"]').should(
      'have.attr',
      'data-mode',
      'word',
    )
    cy.get('[data-testid="word-line-0"]').children('p').should('have.length', 2)
    cy.get('[data-display-order="0"]').should('not.have.class', 'opacity-70')
    cy.get('[data-display-order="1"]')
      .should('have.class', 'opacity-70')
      .and('have.class', 'text-sm')
  })

  // 9. Multi-agent different values: concurrent vocalists both visible
  it('renders both lead and background concurrent text when values differ', () => {
    setExtensions(true)
    usePlayerStore.setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        lyrics: { ...s.settings.lyrics, preferSyncedLyrics: true },
      },
    }))
    const diffMock = {
      value: "[00:01.00] Don't worry bout a thing",
      lang: 'eng',
      artist: 'Test',
      title: 'Test',
      structuredLyric: {
        synced: true,
        kind: 'main',
        lang: 'eng',
        agents: [
          { id: 'lead', role: 'main' },
          { id: 'bg', role: 'bg' },
        ],
        line: [{ start: 1000, value: "Don't worry bout a thing" }],
        cueLine: [
          {
            index: 0,
            agentId: 'lead',
            value: "Don't worry bout a thing",
            start: 1000,
            end: 5000,
            cue: [
              {
                start: 1000,
                end: 5000,
                value: "Don't worry bout a thing",
                byteStart: 0,
                byteEnd: 23,
              },
            ],
          },
          {
            index: 0,
            agentId: 'bg',
            value: 'Oh oh oh',
            start: 1200,
            end: 5000,
            cue: [
              {
                start: 1200,
                end: 5000,
                value: 'Oh oh oh',
                byteStart: 0,
                byteEnd: 7,
              },
            ],
          },
        ],
      },
    }
    cy.stub(subsonic.lyrics, 'getLyrics').resolves(diffMock)

    cy.mount(<LyricsTab />)

    cy.get('[data-testid="word-line-0"]').children('p').should('have.length', 2)
    cy.get('[data-agent-role="main"]').should('exist')
    cy.get('[data-agent-role="bg"]').should('exist')
  })

  // 10. Multi-agent without agents[] (positional fallback)
  it('renders stacked sub-rows even when no agents[] declared (positional key fallback)', () => {
    setExtensions(true)
    usePlayerStore.setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        lyrics: { ...s.settings.lyrics, preferSyncedLyrics: true },
      },
    }))
    const noAgentsMock = {
      value: '[00:01.00] Test line',
      lang: 'eng',
      artist: 'Test',
      title: 'Test',
      structuredLyric: {
        synced: true,
        kind: 'main',
        lang: 'eng',
        line: [{ start: 1000, value: 'Test line' }],
        cueLine: [
          {
            index: 0,
            value: 'Test line',
            start: 1000,
            end: 3000,
            cue: [
              {
                start: 1000,
                end: 3000,
                value: 'Test line',
                byteStart: 0,
                byteEnd: 8,
              },
            ],
          },
          {
            index: 0,
            value: 'Harmony',
            start: 1200,
            end: 3000,
            cue: [
              {
                start: 1200,
                end: 3000,
                value: 'Harmony',
                byteStart: 0,
                byteEnd: 6,
              },
            ],
          },
        ],
      },
    }
    cy.stub(subsonic.lyrics, 'getLyrics').resolves(noAgentsMock)

    cy.mount(<LyricsTab />)

    cy.get('[data-testid="word-line-0"]').children('p').should('have.length', 2)
    // Keys use positional fallback: "0:pos0" and "0:pos1"
    cy.get('[data-testid^="word-line-0-cueline-0:pos"]').should(
      'have.length',
      2,
    )
  })

  // 11. OOB cueLine.index — graceful (container renders null → word mode chosen but empty)
  it('handles OOB cueLine.index gracefully without crashing', () => {
    setExtensions(true)
    usePlayerStore.setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        lyrics: { ...s.settings.lyrics, preferSyncedLyrics: true },
      },
    }))
    const oobMock = {
      value: '[00:00.00] Line one',
      lang: 'eng',
      artist: 'Test',
      title: 'Test',
      structuredLyric: {
        synced: true,
        kind: 'main',
        lang: 'eng',
        line: [{ start: 0, value: 'Line one' }],
        cueLine: [
          {
            index: 99,
            value: 'OOB',
            start: 0,
            end: 1000,
            cue: [
              {
                start: 0,
                end: 500,
                value: 'OOB',
                byteStart: 0,
                byteEnd: 2,
              },
            ],
          },
        ],
      },
    }
    cy.stub(subsonic.lyrics, 'getLyrics').resolves(oobMock)

    cy.mount(<LyricsTab />)

    // word mode chosen (raw cueLine has cues), but normalizer filters OOB
    // → container returns null. The lyrics-mode div still has data-mode="word".
    cy.get('[data-testid="lyrics-mode"]').should(
      'have.attr',
      'data-mode',
      'word',
    )
  })

  // 12. Bad byte-range cue falls back to cue.value (no crash)
  it('handles bad byte-range cue (byteStart > byteEnd) without crashing', () => {
    setExtensions(true)
    usePlayerStore.setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        lyrics: { ...s.settings.lyrics, preferSyncedLyrics: true },
      },
    }))
    const badByteMock = {
      value: '[00:00.00] Test line',
      lang: 'eng',
      artist: 'Test',
      title: 'Test',
      structuredLyric: {
        synced: true,
        kind: 'main',
        lang: 'eng',
        line: [{ start: 0, value: 'Test line' }],
        cueLine: [
          {
            index: 0,
            value: 'Test line',
            start: 0,
            end: 2000,
            cue: [
              {
                start: 0,
                end: 1000,
                value: 'Test',
                byteStart: 10,
                byteEnd: 2,
              },
            ],
          },
        ],
      },
    }
    cy.stub(subsonic.lyrics, 'getLyrics').resolves(badByteMock)

    cy.mount(<LyricsTab />)

    cy.get('[data-testid="lyrics-mode"]').should(
      'have.attr',
      'data-mode',
      'word',
    )
    // Falls back to cue.value — "Test" renders without crash
    cy.get('[data-testid="word-sync-lyrics-box"]').should('exist')
  })

  // 13. Regression: line mode still works end-to-end (SyncedLyrics renders)
  it('regression: line-only synced lyrics still render via SyncedLyrics (react-lrc)', () => {
    setExtensions(false)
    usePlayerStore.setState((s) => ({
      ...s,
      settings: {
        ...s.settings,
        lyrics: { ...s.settings.lyrics, preferSyncedLyrics: true },
      },
    }))
    cy.stub(subsonic.lyrics, 'getLyrics').resolves(lineMock)

    cy.mount(<LyricsTab />)

    cy.get('[data-testid="lyrics-mode"]').should(
      'have.attr',
      'data-mode',
      'line',
    )
    cy.get('#sync-lyrics-box').should('exist')
    cy.get('[data-testid="word-sync-lyrics-box"]').should('not.exist')
  })
})

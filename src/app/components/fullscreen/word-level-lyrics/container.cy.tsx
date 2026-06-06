import { useState } from 'react'
import { findLineIdx } from '@/hooks/use-raf-active-cue'
import { usePlayerStore } from '@/store/player.store'
import type { IStructuredLyric } from '@/types/responses/song'
import { WordLevelLyricsContainer } from './container'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

interface FakeAudio {
  currentTime: number
  duration: number
}

interface FixtureShape {
  'subsonic-response': {
    lyricsList: {
      structuredLyrics: IStructuredLyric[]
    }
  }
}

function loadStructuredLyric(
  fixtureName: string,
): Cypress.Chainable<IStructuredLyric> {
  return cy
    .fixture<FixtureShape>(`lyrics/${fixtureName}`)
    .then((fx) => {
      const list = fx['subsonic-response'].lyricsList.structuredLyrics
      return list.find((l) => l.kind === 'main') ?? list[0]
    })
}

function installFakeAudio(): FakeAudio {
  const fakeAudio: FakeAudio = { currentTime: 0, duration: 300 }
  usePlayerStore
    .getState()
    .actions.setAudioPlayerRef(fakeAudio as unknown as HTMLAudioElement)
  return fakeAudio
}

// Wrapper used by the unmount lifecycle test — flipping `mounted` triggers
// React unmount of the container, which fires the rAF cleanup path.
function MountToggle({
  structuredLyric,
}: {
  structuredLyric: IStructuredLyric
}) {
  const [mounted, setMounted] = useState(true)
  return (
    <>
      <button
        data-testid="toggle-unmount"
        type="button"
        onClick={() => setMounted(false)}
      >
        Unmount
      </button>
      {mounted && (
        <WordLevelLyricsContainer structuredLyric={structuredLyric} />
      )}
    </>
  )
}

// Wrapper used by the song-change rerender test — flipping the lyric prop
// while keeping the same WordLevelLyricsContainer instance mounted.
function LyricSwitcher({
  lyricA,
  lyricB,
}: {
  lyricA: IStructuredLyric
  lyricB: IStructuredLyric
}) {
  const [useB, setUseB] = useState(false)
  return (
    <>
      <button
        data-testid="switch-lyric"
        type="button"
        onClick={() => setUseB(true)}
      >
        Switch
      </button>
      <WordLevelLyricsContainer
        structuredLyric={useB ? lyricB : lyricA}
      />
    </>
  )
}

// ---------------------------------------------------------------------------
// Spec
// ---------------------------------------------------------------------------

describe('WordLevelLyricsContainer (T13)', () => {
  let fakeAudio: FakeAudio

  beforeEach(() => {
    fakeAudio = installFakeAudio()
  })

  afterEach(() => {
    // Remove any test-set 'hidden' override on document.
    if (Object.prototype.hasOwnProperty.call(document, 'hidden')) {
      delete (document as unknown as { hidden?: boolean }).hidden
    }
    // Clear the audio ref from the store so spies/handles don't leak.
    usePlayerStore.setState((state) => {
      state.playerState.audioPlayerRef = null
    })
  })

  // 1
  it('mounts and renders the scroll container', () => {
    loadStructuredLyric('v2-with-cues').then((lyric) => {
      cy.mount(<WordLevelLyricsContainer structuredLyric={lyric} />)
      cy.getByTestId('word-sync-lyrics-box').should('exist')
    })
  })

  // 2
  it('rAF is registered on mount', () => {
    cy.spy(window, 'requestAnimationFrame').as('raf')
    loadStructuredLyric('v2-with-cues').then((lyric) => {
      cy.mount(<WordLevelLyricsContainer structuredLyric={lyric} />)
      cy.get('@raf').its('callCount').should('be.gte', 1)
    })
  })

  // 3
  it('rAF is cancelled on unmount — no post-unmount callbacks', () => {
    cy.spy(window, 'cancelAnimationFrame').as('caf')
    loadStructuredLyric('v2-with-cues').then((lyric) => {
      cy.mount(<MountToggle structuredLyric={lyric} />)
      cy.getByTestId('word-sync-lyrics-box').should('exist')

      // Trigger React unmount of the container.
      cy.getByTestId('toggle-unmount').click()
      cy.getByTestId('word-sync-lyrics-box').should('not.exist')

      cy.get('@caf').its('callCount').should('be.gte', 1)
    })
  })

  // 4
  it('hasWordTiming=false → container renders null', () => {
    loadStructuredLyric('v2-no-cues').then((lyric) => {
      cy.mount(<WordLevelLyricsContainer structuredLyric={lyric} />)
      cy.getByTestId('word-sync-lyrics-box').should('not.exist')
    })
  })

  // 5
  it('active line changes when audio time advances past a line start', () => {
    loadStructuredLyric('v2-with-cues').then((lyric) => {
      cy.mount(<WordLevelLyricsContainer structuredLyric={lyric} />)

      // Initial state: no line active → line 0 has opacity-50.
      cy.getByTestId('word-line-0').should('have.class', 'opacity-50')

      cy.then(() => {
        fakeAudio.currentTime = 1.1 // 1100 ms > line[0].start (1000 ms)
      })
      cy.wait(50)
      cy.getByTestId('word-line-0').should('have.class', 'opacity-100')
    })
  })

  // 6
  it('active word changes when audio time enters a cue interval', () => {
    loadStructuredLyric('v2-with-cues').then((lyric) => {
      cy.mount(<WordLevelLyricsContainer structuredLyric={lyric} />)
      cy.then(() => {
        fakeAudio.currentTime = 1.05 // inside cue 0 (1000–1800 ms)
      })
      cy.wait(50)
      cy.get('[data-testid="word-0-0:pos0-0"]').should(
        'have.class',
        'karaoke-fill',
      )
    })
  })

  // 7
  it('click-to-seek sets playerRef.currentTime', () => {
    loadStructuredLyric('v2-with-cues').then((lyric) => {
      cy.mount(<WordLevelLyricsContainer structuredLyric={lyric} />)

      // Activate line 0 so the word span is interactive.
      cy.then(() => {
        fakeAudio.currentTime = 1.05
      })
      cy.wait(50)

      cy.get('[data-testid="word-0-0:pos0-0"]').click()
      cy.then(() => {
        // cue[0].start = 1000 ms → 1.0 s.
        expect(fakeAudio.currentTime).to.equal(1.0)
      })
    })
  })

  // 8
  it('hasWordTiming=true → renders WordLevelLyricsView', () => {
    loadStructuredLyric('v2-with-cues').then((lyric) => {
      cy.mount(<WordLevelLyricsContainer structuredLyric={lyric} />)
      cy.getByTestId('word-sync-lyrics-box').should('exist')
      cy.getByTestId('word-line-0').should('exist')
      cy.getByTestId('word-line-1').should('exist')
      cy.getByTestId('word-line-2').should('exist')
    })
  })

  // 9
  it('document.hidden = true → rAF does not update active state', () => {
    Object.defineProperty(document, 'hidden', {
      configurable: true,
      get: () => true,
    })

    loadStructuredLyric('v2-with-cues').then((lyric) => {
      cy.mount(<WordLevelLyricsContainer structuredLyric={lyric} />)
      cy.then(() => {
        fakeAudio.currentTime = 1.1
      })
      // Wait long enough for several rAF ticks; state should NOT update.
      cy.wait(100)
      cy.getByTestId('word-line-0').should('have.class', 'opacity-50')
      cy.getByTestId('word-line-0').should('not.have.class', 'opacity-100')
    })
  })

  // 10
  it('multi-agent: both lead and bg cues highlighted independently', () => {
    loadStructuredLyric('v2-multi-agent-different-value').then((lyric) => {
      cy.mount(<WordLevelLyricsContainer structuredLyric={lyric} />)
      cy.then(() => {
        // Lead cue 0: 1000–1600 ms. BG cue 0: 1200–2000 ms.
        // 1.3 s sits inside both.
        fakeAudio.currentTime = 1.3
      })
      cy.wait(50)

      cy.get('[data-testid="word-0-0:lead-0"]').should(
        'have.attr',
        'data-state',
        'active',
      )
      cy.get('[data-testid="word-0-0:bg-0"]').should(
        'have.attr',
        'data-state',
        'active',
      )
    })
  })

  // 11
  it('no active cue (before any line start) yields no active span', () => {
    loadStructuredLyric('v2-with-cues').then((lyric) => {
      cy.mount(<WordLevelLyricsContainer structuredLyric={lyric} />)
      cy.then(() => {
        fakeAudio.currentTime = 0.5 // 500 ms, before line[0].start (1000 ms)
      })
      cy.wait(50)
      cy.get('[data-state="active"]').should('not.exist')
    })
  })

  // 12
  it('Task 4 hook smoke: findLineIdx binary search', () => {
    expect(findLineIdx([0, 1000, 2500, 4000], -100)).to.equal(-1)
    expect(findLineIdx([0, 1000, 2500, 4000], 0)).to.equal(0)
    expect(findLineIdx([0, 1000, 2500, 4000], 999)).to.equal(0)
    expect(findLineIdx([0, 1000, 2500, 4000], 1000)).to.equal(1)
    expect(findLineIdx([0, 1000, 2500, 4000], 3000)).to.equal(2)
    expect(findLineIdx([0, 1000, 2500, 4000], 10_000)).to.equal(3)
    expect(findLineIdx([], 500)).to.equal(-1)
  })

  // 13
  it('song change (new structuredLyric prop) resets active state', () => {
    loadStructuredLyric('v2-with-cues').then((lyricA) => {
      loadStructuredLyric('v2-with-offset').then((lyricB) => {
        cy.mount(<LyricSwitcher lyricA={lyricA} lyricB={lyricB} />)

        // Activate line 1 of lyricA.
        cy.then(() => {
          fakeAudio.currentTime = 5.1 // > line[1].start (5000 ms)
        })
        cy.wait(50)
        cy.getByTestId('word-line-1').should('have.class', 'opacity-100')

        // Switch to lyricB (only 1 line, line[0].start = 1900 ms after offset).
        cy.then(() => {
          fakeAudio.currentTime = 0
        })
        cy.getByTestId('switch-lyric').click()
        cy.wait(50)

        // lyricB has only one line; word-line-1 must not exist.
        cy.getByTestId('word-line-1').should('not.exist')
        // line 0 of lyricB must not be stuck-active from lyricA's line 1.
        cy.getByTestId('word-line-0').should('have.class', 'opacity-50')
      })
    })
  })

  // 14
  it('offset applied: cue.start adjusted by offset in v2-with-offset fixture', () => {
    loadStructuredLyric('v2-with-offset').then((lyric) => {
      cy.mount(<WordLevelLyricsContainer structuredLyric={lyric} />)
      // offset = -100; raw cue.start = 2000 → effective 1900 ms.
      // currentTime = 1.95 s = 1950 ms → inside [1900, 2700).
      cy.then(() => {
        fakeAudio.currentTime = 1.95
      })
      cy.wait(50)
      cy.get('[data-testid="word-0-0:pos0-0"]').should(
        'have.attr',
        'data-state',
        'active',
      )
    })
  })
})

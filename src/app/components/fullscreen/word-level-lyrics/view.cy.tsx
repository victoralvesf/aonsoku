import {
  normalizeStructuredLyric,
  type NormalizedStructuredLyric,
} from '@/utils/wordTiming'
import { WordLevelLyricsView } from './view'

/**
 * Load raw fixture, pick the primary structuredLyric, normalise it,
 * and hand the result to the test callback.
 */
function loadAndNormalize(
  fixtureName: string,
  callback: (n: NormalizedStructuredLyric) => void,
) {
  cy.fixture(`lyrics/${fixtureName}`).then((fx) => {
    const rawList = fx['subsonic-response'].lyricsList.structuredLyrics
    const raw =
      rawList.find((l: { kind?: string }) => l.kind === 'main') ?? rawList[0]
    callback(normalizeStructuredLyric(raw))
  })
}

describe('WordLevelLyricsView Component', () => {
  // 1
  it('renders all lines from data.lines', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      // [data-active] is present ONLY on the line container divs; cueLine <p>
      // children share the "word-line-" prefix but do not carry data-active.
      cy.get('[data-testid^="word-line-"][data-active]').should(
        'have.length',
        data.lines.length,
      )
    })
  })

  // 2
  it('active line container has opacity-100, others have opacity-50', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-line-1"]').should('have.class', 'opacity-100')
      cy.get('[data-testid="word-line-0"]').should('have.class', 'opacity-50')
    })
  })

  // 3
  it('active word has karaoke-fill AND font-semibold', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={0}
          activeCueByKey={{ '0:pos0': 2 }}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-0-0:pos0-2"]')
        .should('have.class', 'karaoke-fill')
        .and('have.class', 'font-semibold')
    })
  })

  // 4
  it('past words on active line have opacity-50', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={0}
          activeCueByKey={{ '0:pos0': 2 }}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-0-0:pos0-0"]').should(
        'have.class',
        'opacity-50',
      )
      cy.get('[data-testid="word-0-0:pos0-1"]').should(
        'have.class',
        'opacity-50',
      )
    })
  })

  // 5
  it('future words on active line have neither opacity-50 nor karaoke-fill', () => {
    // NOTE: line 0 of v2-with-cues only has 3 cues (indices 0..2). To get a
    // FUTURE cue on the active line we set the active cue to 0 — then cue 2
    // ("through") is in the future state and serves as the assertion target.
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={0}
          activeCueByKey={{ '0:pos0': 0 }}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-0-0:pos0-2"]')
        .should('not.have.class', 'karaoke-fill')
        .and('not.have.class', 'opacity-50')
    })
  })

  // 6
  it('CJK byte-aware rendering', () => {
    loadAndNormalize('v2-cjk-korean.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={0}
          activeCueByKey={{ '0:pos0': 0 }}
          onWordClick={cy.stub()}
          resolvedLang="ko"
        />,
      )
      // First cue is the Hangul syllable "눈" (UTF-8 bytes 0..2 of "눈을 뜬 순간").
      cy.get('[data-testid="word-0-0:pos0-0"]').should(
        'have.attr',
        'data-text',
        '눈',
      )
    })
  })

  // 7
  it('whitespace-only cue has aria-hidden="true"', () => {
    loadAndNormalize('v2-cjk-korean.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={0}
          activeCueByKey={{ '0:pos0': 0 }}
          onWordClick={cy.stub()}
          resolvedLang="ko"
        />,
      )
      // Cue 2 is the inter-syllable space (byteStart === byteEnd === 6).
      cy.get('[data-testid="word-0-0:pos0-2"]').should(
        'have.attr',
        'aria-hidden',
        'true',
      )
    })
  })

  // 8
  it('click on word invokes onWordClick spy with cue.start', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      const onWordClick = cy.stub().as('onWordClick')
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={onWordClick}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-0-0:pos0-0"]').click()
      // cue 0 of line 0 in v2-with-cues starts at 1000 ms (offset=0).
      cy.get('@onWordClick').should('have.been.calledWith', 1000)
    })
  })

  // 9
  it('keyboard Enter invokes onWordClick', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      const onWordClick = cy.stub().as('onWordClick')
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={onWordClick}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-0-0:pos0-0"]')
        .focus()
        .trigger('keydown', { key: 'Enter' })
      cy.get('@onWordClick').should('have.been.called')
    })
  })

  // 10
  it('keyboard Space invokes onWordClick AND prevents default scroll', () => {
    // The handler calls e.preventDefault() before invoking the spy, so the
    // spy assertion proves the handler ran to completion (and thus that
    // preventDefault was executed — the page-scroll guard is the same code
    // path).
    loadAndNormalize('v2-with-cues.json', (data) => {
      const onWordClick = cy.stub().as('onWordClick')
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={onWordClick}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-0-0:pos0-0"]')
        .focus()
        .trigger('keydown', { key: ' ' })
      cy.get('@onWordClick').should('have.been.called')
    })
  })

  // 11
  it('width-reservation sibling span present on non-whitespace cues', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-0-0:pos0-0"] > span[aria-hidden="true"]')
        .should('exist')
        .and('have.class', 'font-semibold')
    })
  })

  // 12
  it('lang attribute on cueLine sub-rows', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="ko"
        />,
      )
      cy.get('[data-testid^="word-line-0-cueline-"]').should(
        'have.attr',
        'lang',
        'ko',
      )
    })
  })

  // 13
  it('dir="auto" on cueLine sub-rows', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid^="word-line-0-cueline-"]').should(
        'have.attr',
        'dir',
        'auto',
      )
    })
  })

  // 14
  it('Safari user-agent — no scroll-smooth on scroll container', () => {
    // LIMITATION: isSafari from react-device-detect is evaluated at
    // module-load time, so stubbing window.navigator.userAgent from inside a
    // running test cannot flip the branch. Cypress component tests run in a
    // Chromium-based browser by default, so isSafari === false here and
    // 'scroll-smooth' IS present. We assert the non-Safari path; the inverse
    // (Safari → no scroll-smooth) is covered by inspection of view.tsx.
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-sync-lyrics-box"]').should(
        'have.class',
        'scroll-smooth',
      )
    })
  })

  // 15
  it('scroll container has data-testid="word-sync-lyrics-box"', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-sync-lyrics-box"]').should('exist')
    })
  })

  // 16
  it('line without cueLine renders plain line.value without cue spans', () => {
    loadAndNormalize('v2-no-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      data.lines.forEach((line, i) => {
        cy.get(`[data-testid="word-line-${i}"]`)
          .find('p')
          .should('contain.text', line.value)
        // No cue spans inside this line: cue testids are word-${i}-..., which
        // does NOT overlap with word-line-${i}- (line/cueLine testids).
        cy.get(
          `[data-testid="word-line-${i}"] [data-testid^="word-${i}-"]`,
        ).should('not.exist')
      })
    })
  })

  // 17
  it('transition class includes motion-reduce:transition-none on cue spans', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-0-0:pos0-0"]').should(
        'have.class',
        'motion-reduce:transition-none',
      )
    })
  })

  // 18
  it('multi-agent: two sub-rows render per line', () => {
    loadAndNormalize('v2-multi-agent-different-value.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-line-0"] > p').should('have.length', 2)

      cy.get('[data-testid="word-line-0"] > p[data-display-order="0"]')
        .should('exist')
        .and('not.have.class', 'opacity-70')

      cy.get('[data-testid="word-line-0"] > p[data-display-order="1"]')
        .should('exist')
        .and('have.class', 'opacity-70')
        .and('have.class', 'text-sm')
    })
  })

  // 19
  it('multi-agent: agentRole exposed via data-agent-role attribute', () => {
    loadAndNormalize('v2-multi-agent-different-value.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('p[data-agent-role="main"]').should('exist')
      cy.get('p[data-agent-role="bg"]').should('exist')
    })
  })

  // 20
  it('multi-agent: independent active highlighting per agent sub-row', () => {
    loadAndNormalize('v2-multi-agent-different-value.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={0}
          activeCueByKey={{ '0:lead': 0, '0:bg': 0 }}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-0-0:lead-0"]').should(
        'have.class',
        'karaoke-fill',
      )
      cy.get('[data-testid="word-0-0:bg-0"]').should(
        'have.class',
        'karaoke-fill',
      )
    })
  })

  // 21
  it('single-agent regression: exactly one sub-row, no opacity-70/text-sm', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-line-0"] > p').should('have.length', 1)
      cy.get('[data-testid="word-line-0"] > p')
        .should('not.have.class', 'opacity-70')
        .and('not.have.class', 'text-sm')
    })
  })

  // 22
  it('data-active attribute on line container matches activeLineIdx', () => {
    loadAndNormalize('v2-with-cues.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={1}
          activeCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-line-1"]').should(
        'have.attr',
        'data-active',
        'true',
      )
      cy.get('[data-testid="word-line-0"]').should(
        'have.attr',
        'data-active',
        'false',
      )
    })
  })

  // 23
  it('cluster: cross-index concurrent lines all flip data-active=true simultaneously when activeLineIndices is multi-element', () => {
    loadAndNormalize('v2-multi-agent-overlapping-indices.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={2}
          activeLineIndices={[0, 1, 2]}
          activeCueByKey={{}}
          lastVisitedCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-line-0"]').should(
        'have.attr',
        'data-active',
        'true',
      )
      cy.get('[data-testid="word-line-1"]').should(
        'have.attr',
        'data-active',
        'true',
      )
      cy.get('[data-testid="word-line-2"]').should(
        'have.attr',
        'data-active',
        'true',
      )
    })
  })

  // 24
  it('cluster: scale-125 applies to every line in activeLineIndices', () => {
    loadAndNormalize('v2-multi-agent-overlapping-indices.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={2}
          activeLineIndices={[0, 1, 2]}
          activeCueByKey={{}}
          lastVisitedCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-line-0"]').should('have.class', 'scale-125')
      cy.get('[data-testid="word-line-1"]').should('have.class', 'scale-125')
      cy.get('[data-testid="word-line-2"]').should('have.class', 'scale-125')
    })
  })

  // 25
  it('cluster: each active line carries its own karaoke-fill cue (per-line independent highlighting)', () => {
    loadAndNormalize('v2-multi-agent-overlapping-indices.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={2}
          activeLineIndices={[0, 1, 2]}
          activeCueByKey={{
            '0:lead': 2,
            '1:echo': 0,
            '2:choir': 0,
          }}
          lastVisitedCueByKey={{
            '0:lead': 2,
            '1:echo': 0,
            '2:choir': 0,
          }}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-0-0:lead-2"]').should(
        'have.class',
        'karaoke-fill',
      )
      cy.get('[data-testid="word-1-1:echo-0"]').should(
        'have.class',
        'karaoke-fill',
      )
      cy.get('[data-testid="word-2-2:choir-0"]').should(
        'have.class',
        'karaoke-fill',
      )
    })
  })

  // 26
  it('cluster back-compat: activeLineIndices omitted falls back to [activeLineIdx] (existing single-index tests keep working)', () => {
    loadAndNormalize('v2-multi-agent-overlapping-indices.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={1}
          activeCueByKey={{}}
          lastVisitedCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-line-1"]').should(
        'have.attr',
        'data-active',
        'true',
      )
      cy.get('[data-testid="word-line-0"]').should(
        'have.attr',
        'data-active',
        'false',
      )
      cy.get('[data-testid="word-line-2"]').should(
        'have.attr',
        'data-active',
        'false',
      )
    })
  })

  // 27
  it('cluster: line OUTSIDE the cluster but before its anchor renders cues as past (i < activeLineIdx fallback)', () => {
    loadAndNormalize('v2-multi-agent-overlapping-indices.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={2}
          activeLineIndices={[1, 2]}
          activeCueByKey={{ '1:echo': 0, '2:choir': 0 }}
          lastVisitedCueByKey={{ '1:echo': 0, '2:choir': 0 }}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-0-0:lead-0"]').should(
        'have.attr',
        'data-state',
        'past',
      )
    })
  })

  // 28
  it('cluster: rightmost-started line that has ENDED while an earlier concurrent line keeps going renders past, not future (regression for i === activeLineIdx outside set)', () => {
    // Simulates: Line 0 still active, Line 1 ended (its end < t < Line 2's start).
    // Hook would emit activeLineIdx=1, activeLineIndices=[0]. The strict `<`
    // boundary regressed before; this test guards the `<=` fix.
    loadAndNormalize('v2-multi-agent-overlapping-indices.json', (data) => {
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={1}
          activeLineIndices={[0]}
          activeCueByKey={{ '0:lead': 2 }}
          lastVisitedCueByKey={{
            '0:lead': 2,
            '1:echo': 2,
          }}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-1-1:echo-0"]').should(
        'have.attr',
        'data-state',
        'past',
      )
      cy.get('[data-testid="word-1-1:echo-2"]').should(
        'have.attr',
        'data-state',
        'past',
      )
      cy.get('[data-testid="word-1-1:echo-0"]').should(
        'have.class',
        'opacity-50',
      )
      cy.get('[data-testid="word-2-2:choir-0"]').should(
        'have.attr',
        'data-state',
        'future',
      )
    })
  })

  // 29
  it('empty-text line is hidden when a break covers its time slot', () => {
    // Fixture: line 0 ends at 2000, empty line at 2000, next real line at 7000
    // (5s gap). A break with [start=2000, end=7000] is generated; the empty
    // line falls inside it and should NOT render.
    loadAndNormalize('v2-with-empty-lines.json', (data) => {
      expect(data.breaks.length, 'one break detected').to.equal(1)
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          lastVisitedCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-line-0"]').should('exist')
      cy.get('[data-testid="word-line-1"]').should('not.exist')
      cy.get('[data-testid="word-line-2"]').should('exist')
      cy.get('[data-testid="instrumental-break-brk:2"]').should('exist')
    })
  })

  // 30
  it('empty-text line stays visible when the gap is sub-threshold (no break to replace it)', () => {
    // Fixture: line 0 ends at 2000, empty line at 2000, next real line at 4000
    // (2s gap, below the 3s break threshold). No break is generated, so the
    // empty line must remain visible as the only "clear display" signal.
    loadAndNormalize('v2-empty-line-short-gap.json', (data) => {
      expect(data.breaks.length, 'no break generated').to.equal(0)
      cy.mount(
        <WordLevelLyricsView
          data={data}
          activeLineIdx={-1}
          activeCueByKey={{}}
          lastVisitedCueByKey={{}}
          onWordClick={cy.stub()}
          resolvedLang="en"
        />,
      )
      cy.get('[data-testid="word-line-0"]').should('exist')
      cy.get('[data-testid="word-line-1"]').should('exist')
      cy.get('[data-testid="word-line-1"]').find('p').should('have.text', '')
      cy.get('[data-testid="word-line-2"]').should('exist')
      cy.get('[data-testid^="instrumental-break-"]').should('not.exist')
    })
  })
})

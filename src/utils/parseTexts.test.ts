import { defaultUrlTransform } from 'react-markdown'
import { describe, expect, it } from 'vitest'
import { linkifyText, sanitizeLinks } from './parseTexts'

describe('sanitizeLinks', () => {
  it('strips event handler attributes from img tags', () => {
    const result = sanitizeLinks('<img src=x onerror=alert(1)>')

    expect(result).not.toContain('onerror')
    expect(result).not.toContain('alert(1)')
  })

  it('neutralizes javascript: hrefs, unwrapping the anchor to plain text', () => {
    const result = sanitizeLinks('<a href="javascript:alert(1)">x</a>')

    expect(result).not.toContain('javascript:')
    expect(result).not.toMatch(/<a[^>]*href/i)
  })

  it('leaves a percent-encoded "javascript:" href inert', () => {
    // Browsers never percent-decode the *scheme* portion of a URL before
    // resolving it (WHATWG URL spec), so this string can never become an
    // executable javascript: URI - it just resolves as a relative path
    // under the page's own origin. DOMPurify's URI regexp intentionally
    // allows it through for that reason; assert the real-world resolution
    // stays inert instead of asserting the attribute gets stripped.
    const result = sanitizeLinks(
      '<a href="%6A%61%76%61%73%63%72%69%70%74%3Aalert(1)">x</a>',
    )
    const hrefMatch = result.match(/href="([^"]*)"/)
    expect(hrefMatch).not.toBeNull()

    const resolved = new URL(hrefMatch![1], 'https://example.com/page')
    expect(resolved.protocol).not.toBe('javascript:')
  })

  it('blocks javascript: URIs padded with tabs/whitespace', () => {
    const result = sanitizeLinks('<a href="j\tavascript:alert(1)">x</a>')

    expect(result).not.toMatch(/<a[^>]*href/i)
  })

  it('blocks data: URIs on links', () => {
    const result = sanitizeLinks(
      '<a href="data:text/html,<script>alert(1)</script>">x</a>',
    )

    expect(result).not.toContain('data:text/html')
    expect(result).not.toMatch(/<a[^>]*href/i)
  })

  it('removes svg/onload payloads entirely', () => {
    const result = sanitizeLinks('<svg onload=alert(1)>')

    expect(result).not.toContain('<svg')
    expect(result).not.toContain('onload')
  })

  it('removes iframe tags entirely', () => {
    const result = sanitizeLinks('<iframe src="https://evil.example"></iframe>')

    expect(result).not.toContain('<iframe')
  })

  it('removes script tags entirely', () => {
    const result = sanitizeLinks('<script>alert(1)</script>')

    expect(result).not.toContain('<script')
    expect(result).not.toContain('alert(1)')
  })

  it('handles malformed/incorrectly nested markup without leaking scripts', () => {
    const result = sanitizeLinks(
      '<a><a href="javascript:alert(1)">nested</a></a>',
    )

    expect(result).not.toContain('javascript:')
    expect(result).not.toMatch(/<a[^>]*href="javascript:/i)
  })

  it('keeps a legitimate http link intact', () => {
    const result = sanitizeLinks('<a href="https://example.com">example</a>')

    expect(result).toContain('href="https://example.com"')
  })

  it('preserves allowed tags like <b>-equivalent <strong> and <p>', () => {
    const result = sanitizeLinks('<p>Hello <strong>world</strong></p>')

    expect(result).toBe('<p>Hello <strong>world</strong></p>')
  })

  it('drops img tags whose src is stripped down to nothing', () => {
    const result = sanitizeLinks('<img src="javascript:alert(1)">')

    expect(result).not.toContain('<img')
  })
})

describe('sanitizeLinks -> linkifyText pipeline', () => {
  function process(comment: string) {
    return linkifyText(sanitizeLinks(comment))
  }

  it('turns a plain-text URL into a clickable link', () => {
    const result = process('Check https://example.com')

    expect(result).toContain('<a href="https://example.com"')
    expect(result).toContain('target="_blank"')
    expect(result).toContain('rel="noreferrer nofollow"')
  })

  it('never emits an onerror attribute for a malicious img payload', () => {
    const result = process('<img src=x onerror=alert(1)>')

    expect(result).not.toContain('onerror')
  })

  it('never emits a javascript: href for a malicious anchor payload', () => {
    const result = process('<a href="javascript:alert(1)">x</a>')

    expect(result).not.toContain('javascript:')
  })

  it('preserves allowed markup alongside autolinked plain text', () => {
    const result = process('<p>See https://example.com for details</p>')

    expect(result).toContain('<p>')
    expect(result).toContain('<a href="https://example.com"')
  })
})

describe('call site: artist bio (info-panel)', () => {
  // Shape of a real Last.fm bio: <br>, inline emphasis, entities, trailing link
  const bio = `Radiohead are an English rock band formed in Abingdon.<br />
Members: <strong>Thom Yorke</strong> &amp; Jonny Greenwood.
<a href="https://www.last.fm/music/Radiohead">Read more on Last.fm</a>.`

  it('keeps the formatting a bio relies on', () => {
    const result = sanitizeLinks(bio)

    expect(result).toContain('<br>')
    expect(result).toContain('<strong>Thom Yorke</strong>')
    expect(result).toContain('&amp;')
  })

  it('hardens the Last.fm link without dropping it', () => {
    const result = sanitizeLinks(bio)

    expect(result).toContain('href="https://www.last.fm/music/Radiohead"')
    expect(result).toContain('target="_blank"')
    expect(result).toContain('rel="noreferrer nofollow"')
  })

  it('unwraps non-whitelisted formatting tags instead of losing their text', () => {
    // The previous hand-rolled sanitizer removed these nodes wholesale, taking
    // the text with them. DOMPurify keeps the content and drops only the tag.
    expect(sanitizeLinks('<b>Bold</b> and <i>italic</i>')).toBe(
      'Bold and italic',
    )
    expect(sanitizeLinks('<tt>monospace</tt>')).toBe('monospace')
  })

  it('still discards the content of script-like containers', () => {
    expect(sanitizeLinks('<style>body{color:red}</style>visible')).toBe(
      'visible',
    )
  })

  it('strips inline style attributes', () => {
    expect(sanitizeLinks('<p style="color:red">x</p>')).toBe('<p>x</p>')
  })
})

describe('call site: podcast episode description', () => {
  function process(description: string) {
    return linkifyText(sanitizeLinks(description))
  }

  const description = `<p>We talk about <em>music</em> &amp; software.</p>
<ul><li>Topic one</li><li>Topic two</li></ul>
<p>Email contact@example.com or visit https://example.com/contact</p>
<img src="https://example.com/cover.jpg" alt="cover" />`

  it('preserves the block structure feeds ship', () => {
    const result = process(description)

    expect(result).toContain('<p>')
    expect(result).toContain('<em>music</em>')
    expect(result).toContain('<ul><li>Topic one</li><li>Topic two</li></ul>')
    expect(result).toContain('<img src="https://example.com/cover.jpg"')
  })

  it('autolinks bare URLs and emails found in the text', () => {
    const result = process(description)

    expect(result).toContain(
      '<a href="https://example.com/contact" target="_blank"',
    )
    // mailto links intentionally stay in the same tab, so no target/rel
    expect(result).toContain('<a href="mailto:contact@example.com">')
  })

  it('renders anchors whose text is already a URL without losing the link', () => {
    // linkifyText re-links the text inside an existing <a>, producing nested
    // anchors. The HTML parser un-nests them, so the visible text and the
    // working link survive - assert on the parsed DOM, not the raw string.
    const html = process(
      '<p>Show: <a href="https://example.com/show">https://example.com/show</a></p>',
    )
    const container = document.createElement('div')
    container.innerHTML = html

    expect(container.textContent).toBe('Show: https://example.com/show')
    const linked = Array.from(container.querySelectorAll('a')).filter(
      (anchor) => anchor.textContent !== '',
    )
    expect(linked).toHaveLength(1)
    expect(linked[0].getAttribute('href')).toBe('https://example.com/show')
  })
})

describe('call site: updater release notes', () => {
  // sanitizeLinks runs on the raw markdown, before react-markdown parses it.
  const notes = `# Release Notes

## New Features

- **Player:** added support for lyrics.
- **Radio:** added support for <strong>lyrics</strong>.

## Fixes

- Some fixes. (thanks to @someuser).
- Fixed the **player** crash (#123).`

  it('leaves markdown syntax untouched for react-markdown to parse', () => {
    const result = sanitizeLinks(notes)

    expect(result).toContain("# Release Notes")
    expect(result).toContain('## New Features')
    expect(result).toContain('- **Player:** added support for lyrics.')
    expect(result).toContain('- **Radio:** added support for <strong>lyrics</strong>.')
    expect(result).toContain('## Fixes')
    expect(result).toContain('- Some fixes. (thanks to @someuser).')
    expect(result).toContain('- Fixed the **player** crash (#123).')
    expect(result).toContain('<strong>lyrics</strong>')
  })

  it('neutralizes raw HTML embedded in release notes before rehype-raw sees it', () => {
    const result = sanitizeLinks(
      '<img src=x onerror=alert(1)>\n<script>alert(1)</script>',
    )

    expect(result).not.toContain('onerror')
    expect(result).not.toContain('<script')
    expect(result).not.toContain('alert(1)')
  })

  it('relies on react-markdown to block dangerous markdown link targets', () => {
    // Markdown links are plain text at sanitize time, so sanitizeLinks cannot
    // vet them - react-markdown's default urlTransform is what covers this.
    expect(defaultUrlTransform('javascript:alert(1)')).toBe('')
    expect(defaultUrlTransform('https://example.com')).toBe(
      'https://example.com',
    )
  })
})

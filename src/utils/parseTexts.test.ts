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

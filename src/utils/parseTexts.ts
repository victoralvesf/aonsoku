import { convert } from 'html-to-text'
import LinkifyIt from 'linkify-it'

export function parseHtmlToText(text: string) {
  return convert(text, {
    wordwrap: false,
    selectors: [
      { selector: 'a', format: 'inline' },
      { selector: 'img', format: 'skip' },
    ],
  })
}

interface createParams {
  schema: string
  url: string
  text: string
}

function createLinkTag({ schema, url, text }: createParams) {
  if (schema.includes('mailto')) {
    return `<a href="${url}">${text}</a>`
  }

  return `<a href="${url}" target="_blank" rel="noreferrer nofollow">${text}</a>`
}

export function linkifyText(textToParse: string) {
  const linkify = new LinkifyIt()

  let result = textToParse.replace(/>([^<]+)</g, (match, content) => {
    const matches = linkify.match(content)

    if (!matches) return match

    const processedText = matches.reduce(
      (updatedText, { url, text, schema }) => {
        const linkTag = createLinkTag({ schema, url, text })
        return updatedText.replace(text, linkTag)
      },
      content,
    )

    return `>${processedText}<`
  })

  if (!/<[^>]+>/.test(textToParse)) {
    const matches = linkify.match(result)

    if (matches) {
      matches.forEach(({ url, text, schema }) => {
        const linkTag = createLinkTag({ schema, url, text })
        result = result.replace(text, linkTag)
      })
    }
  }

  return result
}

export function sanitizeLinks(text: string) {
  const parser = new DOMParser()
  const doc = parser.parseFromString(text, 'text/html')

  const tagWhiteList = [
    'a',
    'p',
    'u',
    'figure',
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'img',
    'strong',
    'em',
    'ul',
    'ol',
    'li',
    'br',
    'span',
    'div',
  ]
  const attributeWhiteList = ['href', 'class', 'rel', 'target', 'src', 'alt']

  // Remove all tags not in the whitelist
  doc.body.querySelectorAll('*').forEach((node) => {
    if (!tagWhiteList.includes(node.tagName.toLowerCase())) {
      if (node.tagName.toLowerCase() === 'tt') {
        node.replaceWith(...Array.from(node.childNodes))
      } else {
        node.remove()
      }
    }

    // Strip attributes not in the whitelist
    Array.from(node.attributes).forEach((attr) => {
      if (!attributeWhiteList.includes(attr.name)) {
        node.removeAttribute(attr.name)
      }
    })

    // Specific handling for anchor tags
    if (node.tagName.toLowerCase() === 'a') {
      const link = node as HTMLAnchorElement
      const href = link.getAttribute('href') ?? ''

      // Normalize href: decode URL-encoded sequences, remove control characters and whitespace, lowercase
      // This prevents bypasses like "j a v a s c r i p t :", "%6A%61%76%61%73%63%72%69%74", or null bytes
      let normalizedHref = href
      // Decode recursively up to 10 times to prevent double-encoding attacks
      for (let i = 0; i < 10; i++) {
        try {
          const decoded = decodeURIComponent(normalizedHref)
          if (decoded === normalizedHref) break
          normalizedHref = decoded
        } catch (_) {
          break
        }
      }
      // Remove control characters (ASCII 0-31 and 127-159)
      normalizedHref = normalizedHref.replace(
        // biome-ignore lint/suspicious/noControlCharactersInRegex: necessary for URL validation
        /[\u0000-\u001F\u007F-\u009F]/g,
        '',
      )
      // Remove whitespace
      normalizedHref = normalizedHref.replace(/\s+/g, '')
      // Lowercase for validation checks
      const lowercasedHref = normalizedHref.toLowerCase()

      // if it's not http, https or mailto, we consider invalid or dangerous
      const isSafeProtocol = /^(https?:|mailto:)/.test(lowercasedHref)

      // checks if it's a relative URL:
      // absolute path, hash anchor, same-directory, or parent-directory reference
      const isRelativeUrl = /^(\/#|\.\/|\.\.\/|\/|#)/.test(lowercasedHref)

      if (!isSafeProtocol && !isRelativeUrl) {
        // If it's not a safe protocol or a relative URL
        // remove the link but keep the text
        link.replaceWith(...Array.from(link.childNodes))
      } else {
        link.setAttribute('href', normalizedHref)
        link.setAttribute('target', '_blank')
        link.setAttribute('rel', 'noreferrer nofollow')
      }
    }

    // Specific handling for img tags
    if (node.tagName.toLowerCase() === 'img') {
      const img = node as HTMLImageElement
      const src = img.getAttribute('src') ?? ''

      let normalizedSrc = src
      // Decode recursively up to 10 times to prevent double-encoding attacks
      for (let i = 0; i < 10; i++) {
        try {
          const decoded = decodeURIComponent(normalizedSrc)
          if (decoded === normalizedSrc) break
          normalizedSrc = decoded
        } catch (_) {
          break
        }
      }

      // Check for < or > (HTML injection) OR dangerous protocols (javascript:)
      const hasHtml = /[<>]/.test(normalizedSrc)
      const normalizedSrcNoSpace = normalizedSrc.replace(/\s+/g, '')
      const hasDangerousProtocol = /\b(javascript|vbscript|data):/i.test(
        normalizedSrcNoSpace,
      )
      const isSafeSrc = !hasHtml && !hasDangerousProtocol

      if (!isSafeSrc) {
        node.remove()
      }
    }
  })

  return doc.body.innerHTML
}

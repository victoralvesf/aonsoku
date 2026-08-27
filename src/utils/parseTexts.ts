import DOMPurify from 'dompurify'
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

// Minimal tag/attribute whitelist for server-controlled rich text
const ALLOWED_TAGS = [
  'a',
  'p',
  'u',
  'figure',
  'img',
  'h1',
  'h2',
  'h3',
  'h4',
  'h5',
  'h6',
  'strong',
  'em',
  'ul',
  'ol',
  'li',
  'br',
  'span',
  'div',
]
const ALLOWED_ATTR = ['href', 'class', 'rel', 'target', 'src', 'alt']

// Only allow absolute http(s)/mailto URLs, or relative/anchor references
// (e.g. "/path", "./x", "../x", "#anchor"). Blocks javascript:, data:,
// vbscript:, and any other scheme.
const ALLOWED_URI_REGEXP =
  /^(?:(?:https?|mailto):|[^a-z]|[a-z+.-]+(?:[^a-z+.-:]|$))/i

// Force safe link behavior and drop dead anchors/images in the output.
DOMPurify.addHook('afterSanitizeAttributes', (node) => {
  if (node.tagName === 'A') {
    if (node.hasAttribute('href')) {
      node.setAttribute('target', '_blank')
      node.setAttribute('rel', 'noreferrer nofollow')
    } else {
      node.replaceWith(...Array.from(node.childNodes))
    }
  }

  if (node.tagName === 'IMG' && !node.hasAttribute('src')) {
    node.remove()
  }
})

export function sanitizeLinks(text: string) {
  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    ALLOWED_URI_REGEXP,
    ALLOW_DATA_ATTR: false,
    ALLOW_ARIA_ATTR: false,
  })
}

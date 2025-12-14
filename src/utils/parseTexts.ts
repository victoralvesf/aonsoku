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
  const attributeWhiteList = ['href', 'class', 'rel', 'target']

  // Remove all tags not in the whitelist
  doc.body.querySelectorAll('*').forEach((node) => {
    if (!tagWhiteList.includes(node.tagName.toLowerCase())) {
      node.remove()
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
      
      // Removes empty spaces and control characters for verification
      // This prevents bypasses like "j a v a s c r i p t :"
      const normalizedHref = href.replace(/\s+/g, '').toLowerCase()

      // if it's not http, https or mailto, we consider invalid or dangerous
      const isSafeProtocol = /^(https?:|mailto:)/.test(normalizedHref)

      // checks if it's a relative URL, starting with / or . or #
      const isRelativeUrl = /^(\/|\.|#)/.test(normalizedHref)
  
      if (!isSafeProtocol && !isRelativeUrl) {
        // If it's not a safe protocol or a relative URL
        // remove the link but keep the text
        link.replaceWith(document.createTextNode(link.textContent || ''))
      } else {
        link.setAttribute('target', '_blank')
        link.setAttribute('rel', 'noreferrer nofollow')
      }
    }
  })

  return doc.body.innerHTML
}

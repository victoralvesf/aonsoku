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

  doc.querySelectorAll('a').forEach((link) => {
    const href = link.getAttribute('href') ?? ''

    if (href.includes('javascript')) {
      const textNode = document.createTextNode(link.textContent || '')
      link.replaceWith(textNode)
    } else {
      link.setAttribute('target', '_blank')
      link.setAttribute('rel', 'noreferrer nofollow')
    }
  })

  return doc.body.innerHTML
}

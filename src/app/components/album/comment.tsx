import { linkifyText, sanitizeLinks } from '@/utils/parseTexts'

export function AlbumComment({ comment }: { comment: string }) {
  const sanitizedComment = sanitizeLinks(comment)
  const parsedComment = linkifyText(sanitizedComment)

  return (
    <div className="mt-8 text-sm text-muted-foreground p-4 bg-muted rounded-md border border-border">
      <p
        className="html whitespace-pre-line"
        dangerouslySetInnerHTML={{ __html: parsedComment }}
      />
    </div>
  )
}

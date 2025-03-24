export function AlbumComment({ comment }: { comment: string }) {
  return (
    <div className="mt-8 text-sm text-muted-foreground p-4 bg-muted rounded-md border border-border">
      <p className="whitespace-pre-line">{comment}</p>
    </div>
  )
}

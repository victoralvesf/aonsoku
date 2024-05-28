import { useAsyncValue } from "react-router-dom";
import { SimpleTooltip } from "@/app/components/ui/simple-tooltip";
import LastFmIcon from "@/app/components/icons/last-fm";
import { Skeleton } from "@/app/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { IAlbumInfo } from "@/types/responses/album";

interface AlbumInfoProps {
  albumName: string
}

const containerClasses = "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all bg-muted"

export default function AlbumInfo({ albumName }: AlbumInfoProps) {
  const albumInfo = useAsyncValue() as IAlbumInfo

  if (!albumInfo.notes) return

  return (
    <div className={cn(containerClasses)} id="artist-biography">
      <h3 className="scroll-m-20 mb-2 text-3xl font-semibold tracking-tight">About {albumName}</h3>
      <p dangerouslySetInnerHTML={{ __html: albumInfo?.notes! }} />

      <div className="flex w-full mt-2 gap-2">
        {albumInfo?.lastFmUrl && (
          <SimpleTooltip text="Open in Last.fm">
            <a
              target="_blank"
              rel="nofollow"
              href={albumInfo.lastFmUrl}
              className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
            >
              <LastFmIcon className="w-6 h-6 fill-foreground" />
            </a>
          </SimpleTooltip>
        )}
      </div>
    </div>
  )
}

export function AlbumInfoFallback() {
  return (
    <div className={containerClasses}>
      <Skeleton className="h-9 w-[300px] mb-2 rounded bg-border" />
      <Skeleton className="h-3 w-full rounded bg-border" />
      <Skeleton className="h-3 w-full rounded bg-border" />
      <Skeleton className="h-3 w-1/2 rounded bg-border" />

      <div className="flex w-full mt-2 gap-2">
        <Skeleton className="w-10 h-10 rounded-full bg-border" />
      </div>
    </div>
  )
}

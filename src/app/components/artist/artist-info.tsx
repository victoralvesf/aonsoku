import { useAsyncValue } from "react-router-dom";
import { SimpleTooltip } from "@/app/components/ui/simple-tooltip";
import LastFmIcon from "@/app/components/icons/last-fm";
import MusicbrainzIcon from "@/app/components/icons/musicbrainz";
import { Skeleton } from "@/app/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { IArtistInfo } from "@/types/responses/artist";

interface ArtistInfoProps {
  artistName: string
}

const containerClasses = "flex flex-col items-start gap-2 rounded-lg border p-3 text-left text-sm transition-all bg-muted"

export default function ArtistInfo({ artistName }: ArtistInfoProps) {
  const artistInfo = useAsyncValue() as IArtistInfo

  if (!artistInfo.biography) return

  return (
    <div className={cn(containerClasses)} id="artist-biography">
      <h3 className="scroll-m-20 mb-2 text-3xl font-semibold tracking-tight">About {artistName}</h3>
      <p dangerouslySetInnerHTML={{ __html: artistInfo?.biography! }} />

      <div className="flex w-full mt-2 gap-2">
        {artistInfo?.lastFmUrl && (
          <SimpleTooltip text="Open in Last.fm">
            <a
              target="_blank"
              rel="nofollow"
              href={artistInfo.lastFmUrl}
              className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
            >

              <LastFmIcon className="w-6 h-6 fill-foreground" />
            </a>
          </SimpleTooltip>
        )}

        {artistInfo?.musicBrainzId && (
          <SimpleTooltip text="Open in MusicBrainz">
            <a
              target="_blank"
              rel="nofollow"
              href={`https://musicbrainz.org/artist/${artistInfo.musicBrainzId}`}
              className="p-2 hover:bg-black/10 dark:hover:bg-white/10 rounded-full"
            >
              <MusicbrainzIcon className="w-6 h-6 fill-foreground" />
            </a>
          </SimpleTooltip>
        )}
      </div>
    </div>
  )
}

export function ArtistInfoFallback() {
  return (
    <div className={containerClasses}>
      <Skeleton className="h-9 w-[300px] mb-2 rounded bg-border" />
      <Skeleton className="h-3 w-full rounded bg-border" />
      <Skeleton className="h-3 w-full rounded bg-border" />
      <Skeleton className="h-3 w-1/2 rounded bg-border" />

      <div className="flex w-full mt-2 gap-2">
        <Skeleton className="w-10 h-10 rounded-full bg-border" />
        <Skeleton className="w-10 h-10 rounded-full bg-border" />
      </div>
    </div>
  )
}

import { AudioLines } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { getCoverArtUrl } from '@/api/httpClient'
import { usePlayerCurrentList, usePlayerCurrentSongIndex, useQueueState } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { useMemo } from 'react'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'


const MiniQueueInfo = () => {

  interface ISongAdvanced extends ISong {
    numQueuedAlbumTracks: number
  }
  const displayMaxLength = 2;

  const currentSongIndex = usePlayerCurrentSongIndex()
  const fullQueue = usePlayerCurrentList()
  const remainingQueue = fullQueue.slice(currentSongIndex+1)

  const remainingQueueLength = useMemo(() => remainingQueue.length, [remainingQueue])
  const remainingQueueDuration = useMemo(() => remainingQueue.reduce((acc, song) => acc + song.duration, 0), [remainingQueue])

  const fullQueueLength = useMemo(() => fullQueue.length, [fullQueue])
  const fullQueueDuration = useMemo(() => fullQueue.reduce((acc, song) => acc + song.duration, 0), [fullQueue])

  let endSummaryTrack: string = `${remainingQueueLength} track${remainingQueueLength > 1 ? 's' : ''}, ${convertSecondsToTime(remainingQueueDuration)}`;
  if (remainingQueueLength === 0) {
    endSummaryTrack = `It's over! (of ${fullQueueLength}, ${convertSecondsToTime(fullQueueDuration)})`;
  }
  const endOfQueue: ISongAdvanced = {id: 'end-of-queue', title: endSummaryTrack};

  const getUpNextCompactQueue = (): ISongAdvanced[] => {
    const upNextCompactQueue: ISongAdvanced[] = [];

    remainingQueue.forEach((song, index) => {
      if (index === 0 || song.album !== remainingQueue[index-1]?.album) {
        upNextCompactQueue.push({...song, numQueuedAlbumTracks: 1});
      } else {
        upNextCompactQueue[upNextCompactQueue?.length-1].numQueuedAlbumTracks++;
      }
    })

    return [...upNextCompactQueue.slice(0,displayMaxLength), endOfQueue];
  }

  return (
    <div>  
      {getUpNextCompactQueue().map((song) => (
        <div className="flex gap-1 items-center w-200px h-25px justify-end" key={song.id}>
          <div className="flex flex-col items-end gap-0">  
            <div className="text-xs font-light leading-tight">{song.numQueuedAlbumTracks > 1 ? song.album : song.title}</div>
            <div className="text-xs font-thin leading-tight">{song.artist}</div>
          </div>
          {song.numQueuedAlbumTracks > 1 && (
            <div>
              <div className="text-xs font-small border border-current w-6 h-6 flex items-center justify-center">{song.numQueuedAlbumTracks}</div>
            </div>
          )}
          <LazyLoadImage className="w-25px h-25px mr-2"
            src={getCoverArtUrl(song.coverArt, 'song', '25')}
            width="25px"
            height="25px"
          />
        </div>
        ))}
    </div>
  )
}

  


export function QueuePreview({ song }: { song: ISong | undefined }) {
  const { toggleQueueAction } = useQueueState()
  const { t } = useTranslation()

  function handleClick() {
    toggleQueueAction()
  }


  if (!song) {
    return (
      <Fragment>
        <div className="w-[70px] h-[70px] flex justify-center items-center bg-muted rounded">
          <AudioLines data-testid="song-no-playing-icon" />
        </div>
        <div className="flex flex-col justify-center">
          <span
            className="text-sm font-medium"
            data-testid="song-no-playing-label"
          >
            {t('player.noSongPlaying')}
          </span>
        </div>
      </Fragment>
    )
  }

  return (
    <Fragment>
      <div onClick={handleClick} className="flex flex-col justify-center w-full overflow-hidden">
        <MiniQueueInfo />
      </div>
    </Fragment>
  )
}


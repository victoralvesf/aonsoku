import randomCSSHexColor from '@chriscodesthings/random-css-hex-color'
import { AudioLines, Maximize2 } from 'lucide-react'
import { useCallback, memo, useMemo } from 'react'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { getCoverArtUrl } from '@/api/httpClient'
import { usePlayerCurrentList, usePlayerCurrentSong, usePlayerCurrentSongIndex, useQueueState, useSongColor } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { getAverageColor } from '@/utils/getAverageColor'
import { logger } from '@/utils/logger'
import { ALBUM_ARTISTS_MAX_NUMBER } from '@/utils/multipleArtists'



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

  let endSummaryTrack: string = `${remainingQueueLength} track${remainingQueueLength > 1 ? 's' : ''}, ~${remainingQueueDuration} s (of ${fullQueueLength}, ~${fullQueueDuration} s)`;
  if (remainingQueueLength === 0) {
    endSummaryTrack = `That's all! (of ${fullQueueLength}, ~${fullQueueDuration} s)`;
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
            <div className="text-xs font-thin  leading-tight">{song.artist}</div>
          </div>
          <div>
            {song.numQueuedAlbumTracks > 1 ? song.numQueuedAlbumTracks : ''}
          </div>
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
  const { toggleQueueAction, queueState } = useQueueState()
  const { t } = useTranslation()
  const { setCurrentSongColor, currentSongColor } = useSongColor()

  function handleClick() {
    toggleQueueAction()
  }


  const getImageElement = useCallback(() => {
    return document.getElementById('track-song-image') as HTMLImageElement
  }, [])

  const getImageColor = useCallback(async () => {
    const img = getImageElement()
    if (!img) return

    let color = randomCSSHexColor(true)

    try {
      color = (await getAverageColor(img)).hex
      logger.info('[TrackInfo] - Getting Image Average Color', {
        color,
      })
    } catch {
      logger.error('[TrackInfo] - Unable to get image average color.')
    }

    if (color !== currentSongColor) {
      setCurrentSongColor(color)
    }
  }, [currentSongColor, setCurrentSongColor, getImageElement])

  function handleError() {
    const img = getImageElement()
    if (!img) return

    img.crossOrigin = null
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


import { useEffect, useState } from 'react'
import { Radio } from '@/types/responses/radios'
import IcecastMetadataStats from 'icecast-metadata-stats'

export const useRadioMetadata = (radio: Radio | undefined) => {
  const streamUrl = radio?.streamUrl
  const [radioMetadata, setRadioMetadata] = useState({ title: '', artist: '' })

  useEffect(() => {
    if (!streamUrl) {
      setRadioMetadata({ artist: '', title: '' })
      return
    }
    let iceListener: IcecastMetadataStats
    let prevStreamTitle = ''

    try {
      iceListener = new IcecastMetadataStats(streamUrl, {
        interval: 10,
        onStats: (stats) => {
          const streamTitle = stats.StreamTitle
            ? stats.StreamTitle
            : stats.icy?.StreamTitle
          if (streamTitle && prevStreamTitle !== streamTitle) {
            prevStreamTitle = streamTitle
            const i = streamTitle.indexOf(' - ')

            if (i < 0) {
              setRadioMetadata({ title: streamTitle.trim(), artist: '' })
            } else {
              const trackArtist = streamTitle.slice(0, i).trim()
              const trackTitle = streamTitle.slice(i + 3).trim()
              setRadioMetadata({ title: trackTitle, artist: trackArtist })
            }
          } else if (prevStreamTitle !== streamTitle) {
            prevStreamTitle = streamTitle
            setRadioMetadata({ title: '', artist: '' })
          }
        },
        sources: ['icy'],
      })

      iceListener.start()
    } catch {
      setRadioMetadata({ title: '', artist: '' })
    }

    return () => {
      if (iceListener) {
        iceListener.stop()
      }
      setRadioMetadata({ title: '', artist: '' })
    }
  }, [streamUrl])

  return radioMetadata
}

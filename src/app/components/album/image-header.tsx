import randomCSSHexColor from '@chriscodesthings/random-css-hex-color'
import clsx from 'clsx'
import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'

import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '@/utils/queryKeys'
import { subsonic } from '@/service/subsonic'
import { toast } from 'react-toastify'
import { usePlaylists } from '@/store/playlists.store'


import { getCoverArtUrl } from '@/api/httpClient'
import { AlbumHeaderFallback } from '@/app/components/fallbacks/album-fallbacks'
import { BadgesData, HeaderInfoGenerator } from '@/app/components/header-info'
import { CustomLightBox } from '@/app/components/lightbox'
import { cn } from '@/lib/utils'
import { CoverArt } from '@/types/coverArtType'
import { IFeaturedArtist } from '@/types/responses/artist'
import { getAverageColor } from '@/utils/getAverageColor'
import { getTextSizeClass } from '@/utils/getTextSizeClass'
import { AlbumArtistInfo, AlbumMultipleArtistsInfo } from './artists'
import { ImageHeaderEffect } from './header-effect'

import { Input } from '@/app/components/ui/input'

import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/app/components/ui/form'
import { Switch } from '@/app/components/ui/switch'



const playlistSchema = z.object({
  name: z.string().min(2, { message: 'playlist.form.validations.nameLength' }),
  comment: z.string(),
  isPublic: z.boolean(),
})

type PlaylistSchema = z.infer<typeof playlistSchema>

const defaultValues: PlaylistSchema = {
  name: '',
  comment: '',
  isPublic: true,
}


interface ImageHeaderProps {
  type: string
  title: string
  subtitle?: string
  artistId?: string
  artists?: IFeaturedArtist[]
  coverArtId?: string
  coverArtType: CoverArt
  coverArtSize: string
  coverArtAlt: string
  badges: BadgesData
  isPlaylist?: boolean
  isEditingPlaylist?: boolean
}

export default function ImageHeader({
  type,
  title,
  subtitle,
  artistId,
  artists,
  coverArtId,
  coverArtType,
  coverArtSize,
  coverArtAlt,
  badges,
  isPlaylist = false,
  isEditingPlaylist = false,
}: ImageHeaderProps) {
  const { t } = useTranslation()
  const { data } = usePlaylists()

  const [loaded, setLoaded] = useState(false)
  const [open, setOpen] = useState(false)
  const [bgColor, setBgColor] = useState('')

  const [titleState, setTitleState] = useState(title)
  const [subtitleState, setSubtitleState] = useState(subtitle)

  function getImage() {
    return document.getElementById('cover-art-image') as HTMLImageElement
  }

  async function handleLoadImage() {
    const img = getImage()
    if (!img) return

    let color = randomCSSHexColor(true)

    try {
      color = (await getAverageColor(img)).hex
    } catch (_) {
      console.warn(
        'handleLoadImage: unable to get image color. Using a random color.',
      )
    }

    setBgColor(color)
    setLoaded(true)
  }

  function handleError() {
    const img = getImage()
    if (!img) return

    img.crossOrigin = null

    setLoaded(true)
  }

  const hasMultipleArtists = artists ? artists.length > 1 : false




  
  const form = useForm<PlaylistSchema>({
    resolver: zodResolver(playlistSchema),
    defaultValues,
  })


  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: subsonic.playlists.update,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [queryKeys.playlist.all],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeys.playlist.single, data.id],
        }),
      ])
      toast.success(t('playlist.form.edit.toast.success'))
    },
    onError: () => {
      toast.error(t('playlist.form.edit.toast.error'))
    },
  })

  async function onSubmit({ name, comment, isPublic }: PlaylistSchema) {
      await updateMutation.mutateAsync({
        playlistId: data.id,
        name,
        comment,
        isPublic: isPublic ? 'true' : 'false',
      })


  }




  return (
    <div
      className="flex relative w-full h-[calc(3rem+200px)] 2xl:h-[calc(3rem+250px)]"
      key={`header-${coverArtId}`}
    >
      {!loaded && (
        <div className="absolute inset-0 z-20">
          <AlbumHeaderFallback />
        </div>
      )}
      <div
        className={cn(
          'w-full px-8 py-6 flex gap-4 absolute inset-0',
          'bg-gradient-to-b from-background/20 to-background/50',
        )}
        style={{ backgroundColor: bgColor }}
      >
        <div
          className={cn(
            'w-[200px] h-[200px] min-w-[200px] min-h-[200px]',
            '2xl:w-[250px] 2xl:h-[250px] 2xl:min-w-[250px] 2xl:min-h-[250px]',
            'bg-skeleton aspect-square bg-cover bg-center rounded',
            'shadow-header-image overflow-hidden',
            'hover:scale-[1.02] ease-linear duration-100',
          )}
        >
          <LazyLoadImage
            key={coverArtId}
            effect="opacity"
            crossOrigin="anonymous"
            id="cover-art-image"
            src={getCoverArtUrl(coverArtId, coverArtType, coverArtSize)}
            alt={coverArtAlt}
            className="aspect-square object-cover w-full h-full cursor-pointer"
            width="100%"
            height="100%"
            onLoad={handleLoadImage}
            onError={handleError}
            onClick={() => setOpen(true)}
          />
        </div>

        <div className="flex w-full max-w-[calc(100%-216px)] 2xl:max-w-[calc(100%-266px)] flex-col justify-end z-10">
          <p className="text-xs 2xl:text-sm font-medium text-shadow-md">
            {type}
          </p>

          {!isEditingPlaylist ? (
          <h1
            className={clsx(
              'max-w-full scroll-m-20 font-bold tracking-tight antialiased text-shadow-md break-words line-clamp-2',
              getTextSizeClass(title),
            )}
          >
            {titleState}
          </h1>
          ) : (
            <Input className="max-w-full scroll-m-20 font-bold tracking-tight antialiased text-shadow-md break-words line-clamp-2"
              value={titleState}
              onChange={(e) => setTitleState(e.target.value)}>
            </Input>
          )}


          {!isPlaylist && artists && hasMultipleArtists && (
            <div className="flex items-center mt-2">
              <AlbumMultipleArtistsInfo artists={artists} />
              <HeaderInfoGenerator badges={badges} />
            </div>
          )}

          {!isPlaylist && subtitle && !hasMultipleArtists && (
            <>
              {artistId ? (
                <div className="flex items-center mt-2">
                  <AlbumArtistInfo id={artistId} name={subtitle} />
                  <HeaderInfoGenerator badges={badges} />
                </div>
              ) : (
                <p className="opacity-80 text-sm font-medium">{subtitle}</p>
              )}
            </>
          )}

          {isPlaylist && subtitle && (
            <>
            {!isEditingPlaylist ? (
              <p className="text-sm opacity-80 text-shadow-md line-clamp-2 mt-1 mb-2">
                {subtitleState}
              </p>
            ) : (
              <Input className="text-sm opacity-80 text-shadow-md line-clamp-2 mt-1 mb-2"
                value={subtitleState}
                onChange={(e) => setSubtitleState(e.target.value)}>
              </Input>
            )}
            <div className="flex items-center justify-between gap-2">
              <HeaderInfoGenerator badges={badges} showFirstDot={false} />
              {isEditingPlaylist 
                ?
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2">
                    <p> {JSON.stringify(data)} </p>

                    <FormField
                      control={form.control}
                      name="isPublic"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center gap-2">
                          <FormLabel>
                            {t('playlist.form.labels.isPublic')}
                          </FormLabel>
                          <FormControl>
                            <Switch
                              id="playlist-is-public"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <Button type="submit"> Save </Button>
                  </form>
                </Form>
                : null
              }
            </div>
            </>
          )}

          {!subtitle && (
            <div className="mt-1">
              <HeaderInfoGenerator badges={badges} showFirstDot={false} />
            </div>
          )}
        </div>
      </div>

      {!loaded ? (
        <ImageHeaderEffect className="bg-muted-foreground" />
      ) : (
        <ImageHeaderEffect style={{ backgroundColor: bgColor }} />
      )}

      <CustomLightBox
        open={open}
        close={setOpen}
        src={getCoverArtUrl(coverArtId, coverArtType, coverArtSize)}
        alt={coverArtAlt}
      />
    </div>
  )
}

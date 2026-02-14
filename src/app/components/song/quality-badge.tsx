import { TooltipPortal } from '@radix-ui/react-tooltip'
import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/app/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip'
import { ISong } from '@/types/responses/song'
import { formatBitrate, formatSamplingRate } from '@/utils/audioInfo'
import { formatBytes } from '@/utils/formatBytes'

interface SongQualityBadgeProps {
  variant?: 'neutral' | 'secondary'
  song: ISong
}

export function SongQualityBadge({
  song,
  variant = 'secondary',
}: SongQualityBadgeProps) {
  const { t } = useTranslation()

  if (!song?.suffix) {
    return null
  }

  const quality = song.suffix.toUpperCase()
  const bitrate = formatBitrate(song.bitRate)
  const samplingRate = formatSamplingRate(song.samplingRate)
  const size = formatBytes(song.size ?? 0)

  const lines = [
    { label: t('table.columns.quality'), value: quality },
    { label: t('table.columns.bitrate'), value: bitrate },
    { label: t('table.columns.samplingRate'), value: samplingRate },
    { label: t('table.columns.size'), value: size },
  ]

  return (
    <TooltipProvider>
      <Tooltip delayDuration={100}>
        <TooltipTrigger className="cursor-default flex">
          <Badge variant={variant}>{quality}</Badge>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent className="flex flex-col items-center p-0 divide-y">
            {lines.map((line, index) => (
              <ContentLine key={index} label={line.label}>
                {line.value}
              </ContentLine>
            ))}
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </TooltipProvider>
  )
}

interface ContentLineProps {
  label: string
  children: ReactNode
}

function ContentLine({ label, children }: ContentLineProps) {
  return (
    <div className="flex items-center justify-between w-full p-2 gap-6 text-sm">
      <p className="text-muted-foreground">{label}</p>
      <span className="font-medium">{children}</span>
    </div>
  )
}

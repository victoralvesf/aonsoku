import { Fragment } from 'react'
import { RadioIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Radio } from '@/types/responses/radios'

export function RadioInfo({ radio }: { radio: Radio }) {
  const { t } = useTranslation()

  return (
    <Fragment>
      <div className="w-[70px] h-[70px] flex justify-center items-center bg-muted rounded">
        <RadioIcon className="w-12 h-12" strokeWidth={1} />
      </div>
      <div className="flex flex-col justify-center">
        {radio ? (
          <Fragment>
            <span className="text-sm font-medium">{radio.name}</span>
            <span className="text-xs font-light text-muted-foreground">
              {t('radios.label')}
            </span>
          </Fragment>
        ) : (
          <span className="text-sm font-medium">
            {t('player.noRadioPlaying')}
          </span>
        )}
      </div>
    </Fragment>
  )
}

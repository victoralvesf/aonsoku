import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { PlusIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { EmptyWrapper } from '@/app/components/albums/empty-wrapper'
import { SongListFallback } from '@/app/components/fallbacks/song-fallbacks'
import { HeaderTitle } from '@/app/components/header-title'
import ListWrapper from '@/app/components/list-wrapper'
import { EmptyRadiosInfo } from '@/app/components/radios/empty-message'
import { RadioFormDialog } from '@/app/components/radios/form-dialog'
import { RemoveRadioDialog } from '@/app/components/radios/remove-dialog'
import { Button } from '@/app/components/ui/button'
import { DataTable } from '@/app/components/ui/data-table'
import { radiosColumns } from '@/app/tables/radios-columns'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { useRadios } from '@/store/radios.store'
import { Radio } from '@/types/responses/radios'
import { queryKeys } from '@/utils/queryKeys'

export default function Radios() {
  const { setDialogState, setData } = useRadios()
  const { t } = useTranslation()
  const { setPlayRadio } = usePlayerActions()

  const { data: radios, isLoading } = useQuery({
    queryKey: [queryKeys.radio.all],
    queryFn: subsonic.radios.getAll,
  })

  const columns = radiosColumns()

  function handleAddRadio() {
    setData({} as Radio)
    setDialogState(true)
  }

  if (isLoading) return <SongListFallback />

  const showTable = radios && radios.length > 0

  return (
    <div className={clsx('w-full', showTable ? 'h-full' : 'h-content')}>
      <ShadowHeader>
        <div className="w-full flex items-center justify-between">
          <HeaderTitle
            title={t('sidebar.radios')}
            count={radios?.length ?? 0}
          />

          <Button
            size="sm"
            variant="default"
            className="px-4"
            onClick={handleAddRadio}
          >
            <PlusIcon className="w-5 h-5 -ml-[3px]" />
            <span className="ml-2">{t('radios.addRadio')}</span>
          </Button>
        </div>
      </ShadowHeader>

      {showTable && (
        <ListWrapper className="pt-[--shadow-header-distance]">
          <DataTable
            columns={columns}
            data={radios}
            handlePlaySong={(row) => setPlayRadio(radios, row.index)}
            showPagination={true}
            showSearch={true}
            searchColumn="name"
            allowRowSelection={false}
            dataType="radio"
          />
        </ListWrapper>
      )}

      {!showTable && (
        <ListWrapper className="pt-[--shadow-header-distance] h-full">
          <EmptyWrapper>
            <EmptyRadiosInfo />
          </EmptyWrapper>
        </ListWrapper>
      )}

      <RadioFormDialog />
      <RemoveRadioDialog />
    </div>
  )
}

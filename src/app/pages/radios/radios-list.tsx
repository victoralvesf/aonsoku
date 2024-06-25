import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from 'lucide-react'
import { DataTable } from '@/app/components/ui/data-table'
import { radiosColumns } from '@/app/tables/radios-columns'
import ListWrapper from '@/app/components/list-wrapper'
import { Button } from '@/app/components/ui/button'
import { ShadowHeader } from '@/app/components/shadow-header'
import { RadioFormDialog } from '@/app/components/radios/form-dialog'
import { useRadios } from '@/app/contexts/radios-context'
import { RemoveRadioDialog } from '@/app/components/radios/remove-dialog'
import { Radio } from '@/types/responses/radios'
import { useLang } from '@/app/contexts/lang-context'
import { usePlayer } from '@/app/contexts/player-context'
import { Badge } from '@/app/components/ui/badge'

export default function Radios() {
  const { radios, setDialogState, setData, fetchRadios } = useRadios()
  const { langCode } = useLang()
  const { t } = useTranslation()

  const memoizedRadiosColumns = useMemo(
    () => radiosColumns(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [langCode, radios],
  )
  const memoizedRadios = useMemo(() => radios, [radios])

  const player = usePlayer()

  function handleAddRadio() {
    setData({} as Radio)
    setDialogState(true)
  }

  useEffect(() => {
    fetchRadios()
  }, [fetchRadios])

  return (
    <main className="w-full h-full">
      <ShadowHeader>
        <div className="w-full flex items-center justify-between">
          <div className="flex gap-2 items-center">
            <h2 className="text-2xl font-semibold tracking-tight">
              {t('sidebar.radios')}
            </h2>
            <Badge variant="secondary" className="text-foreground/70">
              {radios.length}
            </Badge>
          </div>

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

      <ListWrapper className="mt-8">
        <DataTable
          columns={memoizedRadiosColumns}
          data={memoizedRadios}
          handlePlaySong={(row) =>
            player.setPlayRadio(memoizedRadios, row.index)
          }
          showPagination={true}
        />
      </ListWrapper>

      <RadioFormDialog />
      <RemoveRadioDialog />
    </main>
  )
}

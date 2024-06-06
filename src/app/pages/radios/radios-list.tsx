import { DataTable } from "@/app/components/ui/data-table"
import { radioColumns } from "@/app/tables/radios-columns"
import ListWrapper from "@/app/components/list-wrapper"
import { Button } from "@/app/components/ui/button"
import { PlusIcon } from "lucide-react"
import { ShadowHeader } from "@/app/components/shadow-header"
import { RadioFormDialog } from "@/app/components/radios/form-dialog"
import { useRadios } from "@/app/contexts/radios-context"
import { RemoveRadioDialog } from "@/app/components/radios/remove-dialog"
import { Radio } from "@/types/responses/radios"
import { useTranslation } from "react-i18next"

export default function Radios() {
  const { radios, setDialogState, setData } = useRadios()
  const { t } = useTranslation()

  function handleAddRadio() {
    setData({} as Radio)
    setDialogState(true)
  }

  return (
    <main className="w-full h-full">
      <ShadowHeader>
        <div className="w-full flex items-center justify-between">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('sidebar.radios')}
          </h2>

          <Button
            size="sm"
            variant="default"
            className="px-4"
            onClick={handleAddRadio}
          >
            <PlusIcon className="w-5 h-5 -ml-[3px]" />
            <span className="ml-2">
              {t('radios.addRadio')}
            </span>
          </Button>
        </div>
      </ShadowHeader>

      <ListWrapper className="mt-8">
        <DataTable
          columns={radioColumns}
          data={radios}
        />
      </ListWrapper>

      <RadioFormDialog />
      <RemoveRadioDialog />
    </main>
  )
}
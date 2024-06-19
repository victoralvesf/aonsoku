import { useTranslation } from 'react-i18next'
import { EllipsisVertical, Pencil, Trash } from 'lucide-react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { Radio } from '@/types/responses/radios'
import { useRadios } from '@/app/contexts/radios-context'

interface RadioActionButtonProps {
  row: Radio
}

export function RadioActionButton({ row }: RadioActionButtonProps) {
  const { t } = useTranslation()
  const { setDialogState, setData, setConfirmDeleteState } = useRadios()

  function handleEdit() {
    setData(row)
    setDialogState(true)
  }

  async function handleDelete() {
    setData(row)
    setConfirmDeleteState(true)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center justify-center rounded-full w-8 h-8 p-1 hover:border hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm ring-0 outline-none">
        <EllipsisVertical className="w-4 h-4" strokeWidth={2} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            <span>{t('radios.table.actions.edit')}</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDelete}>
            <Trash className="mr-2 h-4 w-4 fill-red-300 text-red-500" />
            <span className="text-red-500">
              {t('radios.table.actions.delete')}
            </span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

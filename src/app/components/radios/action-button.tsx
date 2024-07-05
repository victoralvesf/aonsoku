import { Pencil, Trash } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { TableActionButton } from '@/app/components/table/action-button'
import {
  DropdownMenuGroup,
  DropdownMenuItem,
} from '@/app/components/ui/dropdown-menu'
import { useRadios } from '@/store/radios.store'
import { Radio } from '@/types/responses/radios'

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
    <TableActionButton
      optionsMenuItems={
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
      }
    />
  )
}

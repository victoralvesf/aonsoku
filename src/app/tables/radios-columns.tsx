import { ColumnDef } from "@tanstack/react-table"

import { Radio } from "@/types/responses/radios"
import i18n from '@/i18n'

import { RadioActionButton } from "../components/radios/action-button"

function fillRadiosColumns(): ColumnDef<Radio>[] {
  return [
    {
      id: "index",
      accessorKey: "index",
      header: () => {
        return <div className="text-center">#</div>
      },
      cell: ({ row }) => (
        <div className="text-center">
          {row.index + 1}
        </div>
      )
    },
    {
      id: "name",
      accessorKey: "name",
      header: i18n.t('radios.table.name'),
    },
    {
      id: "homePageUrl",
      accessorKey: "homePageUrl",
      header: i18n.t('radios.table.homepage'),
      cell: ({ row }) => {
        const { homePageUrl } = row.original

        if (!homePageUrl) return ''

        return (
          <a href={homePageUrl} target="_blank" rel="nofollow" className="text-primary hover:underline">
            {homePageUrl}
          </a>
        )
      }
    },
    {
      id: "streamUrl",
      accessorKey: "streamUrl",
      header: i18n.t('radios.table.stream'),
      cell: ({ row }) => (
        <div className="max-w-[350px] 2xl:max-w-[600px]">
          <p className="truncate">{row.original.streamUrl}</p>
        </div>
      )
    },
    {
      id: "actions",
      accessorKey: "actions",
      header: "",
      size: 40,
      maxSize: 40,
      cell: ({ row }) => {
        return (
          <RadioActionButton row={row.original} />
        )
      }
    }
  ]
}

let radioColumns = fillRadiosColumns()

i18n.on('languageChanged', () => {
  radioColumns = fillRadiosColumns()
})

export {
  radioColumns
}

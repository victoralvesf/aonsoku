import { useQuery } from '@tanstack/react-query'
import { Check, ChevronsUpDown } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { subsonic } from '@/service/subsonic'
import { AlbumsSearchParams } from '@/utils/albumsFilter'
import { queryKeys } from '@/utils/queryKeys'
import { scrollPageToTop } from '@/utils/scrollPageToTop'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

export function AlbumsFilterByGenre() {
  const { t } = useTranslation()
  const [open, setOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const { data: genres, isLoading } = useQuery({
    queryKey: [queryKeys.genre],
    queryFn: subsonic.genres.get,
  })

  const genre = getSearchParam<string>(AlbumsSearchParams.Genre, '')

  function handleChangeGenreFilter(value: string) {
    setSearchParams((state) => {
      state.set(AlbumsSearchParams.Genre, value)

      return state
    })
    setOpen(false)
    scrollPageToTop()
  }

  if (isLoading) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="w-[220px] justify-between"
        disabled={true}
      >
        {t('album.list.genre.loading')}
        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </Button>
    )
  }
  if (!genres) return null

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          role="combobox"
          aria-expanded={open}
          className="w-[220px] justify-between"
        >
          {!genre ? t('album.list.genre.label') : genre}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0" align="end">
        <Command>
          <CommandInput placeholder={t('album.list.genre.search')} />
          <ScrollArea className="h-[300px]" type="always">
            <CommandList className="max-h-fit">
              <CommandEmpty>
                <div className="px-2">{t('album.list.genre.notFound')}</div>
              </CommandEmpty>
              <CommandGroup>
                {genres.map(({ value }) => (
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={(currentValue) =>
                      handleChangeGenreFilter(currentValue)
                    }
                    className="mr-1.5"
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        genre === value ? 'opacity-100' : 'opacity-0',
                      )}
                    />
                    {value}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </ScrollArea>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

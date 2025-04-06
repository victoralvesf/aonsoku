import clsx from 'clsx'
import { SearchIcon, XIcon } from 'lucide-react'
import {
  ComponentPropsWithoutRef,
  FormEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSearchParams } from 'react-router-dom'
import { Input } from '@/app/components/ui/input'
import { AlbumsFilters, AlbumsSearchParams } from '@/utils/albumsFilter'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

type SearchInputProps = ComponentPropsWithoutRef<typeof Input>

export function ExpandableSearchInput({ ...props }: SearchInputProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const filter = getSearchParam<string>(AlbumsSearchParams.MainFilter, '')
  const query = getSearchParam<string>(AlbumsSearchParams.Query, '')

  const [searchActive, setSearchActive] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const searchRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const setParams = useCallback(
    (value: string) => {
      const params = new URLSearchParams()

      if (value) {
        params.append(AlbumsSearchParams.MainFilter, AlbumsFilters.Search)
        params.append(AlbumsSearchParams.Query, value)

        setSearchParams(params)
      } else {
        inputRef.current?.blur()
      }
    },
    [setSearchParams],
  )

  const close = useCallback(() => {
    setSearchActive(false)
    setSearchValue('')
    if (filter !== '' || query !== '') {
      setSearchParams(new URLSearchParams())
    }
    if (inputRef.current) {
      inputRef.current.blur()
      inputRef.current.value = ''
    }
  }, [filter, query, setSearchParams])

  const toggleSearchActive = useCallback(() => {
    if (!searchActive) {
      setSearchActive(true)
    } else {
      close()
    }
  }, [close, searchActive])

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault()
      setParams(searchValue)
    },
    [searchValue, setParams],
  )

  useEffect(() => {
    setSearchActive(filter === AlbumsFilters.Search)
  }, [filter])

  useEffect(() => {
    setSearchValue(query)
  }, [query])

  useEffect(() => {
    if (!inputRef.current) return

    if (filter === AlbumsFilters.Search && query !== '') {
      inputRef.current.focus()
    }

    inputRef.current.value = query
  }, [filter, query])

  return (
    <form onSubmit={handleSubmit}>
      <div
        ref={searchRef}
        className="relative inline-block w-fit min-w-9 h-9 align-bottom rounded-md overflow-hidden"
      >
        <Input
          id="search"
          ref={inputRef}
          onChange={(e) => setSearchValue(e.target.value)}
          className={clsx(
            'bg-background h-full z-10 left-auto duration-300',
            'focus-visible:ring-transparent ring-offset-background',
            'focus-visible:ring-offset-0 focus-visible:ring-0',
            searchActive
              ? 'w-[260px] pr-9 text-foreground placeholder:opacity-100'
              : 'w-9 text-transparent placeholder:opacity-0',
          )}
          {...props}
        />
        <label
          htmlFor="search"
          className={clsx(
            'absolute w-9 h-9 m-0 right-0 top-0',
            'inline-flex items-center justify-center',
            'leading-10 cursor-pointer text-center z-30',
            'hover:bg-accent rounded-md',
          )}
          aria-label={props.placeholder}
          onClick={toggleSearchActive}
        >
          <SearchIcon
            data-visible={searchActive ? 'hide' : 'show'}
            className="w-4 h-4 text-muted-foreground pointer-events-none rotate-0 scale-100 transition-transform data-[visible=hide]:-rotate-90 data-[visible=hide]:scale-0"
          />
          <XIcon
            data-visible={searchActive ? 'show' : 'hide'}
            className="absolute w-5 h-5 text-muted-foreground pointer-events-none rotate-90 scale-0 transition-transform data-[visible=show]:rotate-0 data-[visible=show]:scale-100"
          />
        </label>
      </div>
    </form>
  )
}

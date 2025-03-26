import clsx from 'clsx'
import {
  Cog,
  ListMusic,
  Palette,
  PlusIcon,
  SquareArrowOutUpRight,
} from 'lucide-react'
import { ReactNode } from 'react'

type Variant =
  | 'GotoPage'
  | 'ChangeTheme'
  | 'Playlists'
  | 'CreatePlaylist'
  | 'ServerManagement'

type CommandItemProps = {
  children: ReactNode
  variant: Variant
}

const icons = {
  GotoPage: {
    className: 'from-cyan-500 to-blue-500',
    icon: <SquareArrowOutUpRight />,
  },
  ChangeTheme: {
    className: 'from-purple-500 to-pink-500',
    icon: <Palette />,
  },
  Playlists: {
    className: 'from-blue-600 to-violet-600',
    icon: <ListMusic />,
  },
  CreatePlaylist: {
    className: 'from-teal-400 to-emerald-600',
    icon: <PlusIcon />,
  },
  ServerManagement: {
    className: 'from-rose-400 to-red-500',
    icon: <Cog />,
  },
}

export function CustomCommandItem({ children, variant }: CommandItemProps) {
  const { className, icon } = icons[variant as keyof typeof icons]

  return (
    <div className="flex gap-2 items-center">
      <div
        className={clsx('bg-gradient-to-r rounded p-1 text-white', className)}
      >
        {icon}
      </div>
      {children}
    </div>
  )
}

import clsx from 'clsx'
import {
  Cog,
  ListMusic,
  Palette,
  PlusIcon,
  SquareArrowOutUpRight,
} from 'lucide-react'

interface Children {
  children: React.ReactNode
}

function Wrapper({ children }: Children) {
  return <div className="flex gap-2 items-center">{children}</div>
}

interface CommandItemProps extends Children {
  variant:
    | 'GotoPage'
    | 'ChangeTheme'
    | 'Playlists'
    | 'CreatePlaylist'
    | 'ServerManagement'
}

const icons = {
  GotoPage: {
    className: 'from-cyan-500 to-blue-500',
    icon: <SquareArrowOutUpRight className="text-white" />,
  },
  ChangeTheme: {
    className: 'from-purple-500 to-pink-500',
    icon: <Palette className="text-white" />,
  },
  Playlists: {
    className: 'from-blue-600 to-violet-600',
    icon: <ListMusic className="text-white" />,
  },
  CreatePlaylist: {
    className: 'from-teal-400 to-emerald-600',
    icon: <PlusIcon className="text-white" />,
  },
  ServerManagement: {
    className: 'from-rose-400 to-red-500',
    icon: <Cog className="text-white" />,
  },
}

export function CustomCommandItem({ children, variant }: CommandItemProps) {
  const { className, icon } = icons[variant as keyof typeof icons]

  return (
    <Wrapper>
      <div className={clsx('bg-gradient-to-r rounded p-1', className)}>
        {icon}
      </div>
      {children}
    </Wrapper>
  )
}

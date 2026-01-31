import {
  HeartIcon,
  HomeIcon,
  LibraryIcon,
  ListMusicIcon,
  Mic2Icon,
  Music2Icon,
  PodcastIcon,
  RadioIcon,
} from 'lucide-react'
import { ElementType, memo } from 'react'
import { ROUTES } from '@/routes/routesList'

const ListMusic = memo(ListMusicIcon)
const Mic2 = memo(Mic2Icon)
const Music2 = memo(Music2Icon)
const Radio = memo(RadioIcon)
const Home = memo(HomeIcon)
const Library = memo(LibraryIcon)
const Podcast = memo(PodcastIcon)
const Heart = memo(HeartIcon)

export interface ISidebarItem {
  id: string
  title: string
  route: string
  icon: ElementType
}

export enum SidebarItems {
  Home = 'home',
  Artists = 'artists',
  Songs = 'songs',
  Albums = 'albums',
  Favorites = 'favorites',
  Playlists = 'playlists',
  Podcasts = 'podcasts',
  Radios = 'radios',
  PodcastAll = 'podcast-all',
  PodcastLatest = 'podcast-latest',
}

export const mainNavItems = [
  {
    id: SidebarItems.Home,
    title: 'sidebar.home',
    route: ROUTES.LIBRARY.HOME,
    icon: Home,
  },
]

export const libraryItems = [
  {
    id: SidebarItems.Artists,
    title: 'sidebar.artists',
    route: ROUTES.LIBRARY.ARTISTS,
    icon: Mic2,
  },
  {
    id: SidebarItems.Songs,
    title: 'sidebar.songs',
    route: ROUTES.LIBRARY.SONGS,
    icon: Music2,
  },
  {
    id: SidebarItems.Albums,
    title: 'sidebar.albums',
    route: ROUTES.LIBRARY.ALBUMS,
    icon: Library,
  },
  {
    id: SidebarItems.Favorites,
    title: 'sidebar.favorites',
    route: ROUTES.LIBRARY.FAVORITES,
    icon: Heart,
  },
  {
    id: SidebarItems.Playlists,
    title: 'sidebar.playlists',
    route: ROUTES.LIBRARY.PLAYLISTS,
    icon: ListMusic,
  },
  {
    id: SidebarItems.Podcasts,
    title: 'sidebar.podcasts',
    route: ROUTES.LIBRARY.PODCASTS,
    icon: Podcast,
  },
  {
    id: SidebarItems.Radios,
    title: 'sidebar.radios',
    route: ROUTES.LIBRARY.RADIOS,
    icon: Radio,
  },
]

export const podcastItems = [
  {
    id: SidebarItems.PodcastAll,
    title: 'podcasts.form.all',
    route: ROUTES.LIBRARY.PODCASTS,
    icon: () => null,
  },
  {
    id: SidebarItems.PodcastLatest,
    title: 'podcasts.form.latestEpisodes',
    route: ROUTES.EPISODES.LATEST,
    icon: () => null,
  },
]

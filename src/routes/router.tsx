import BaseLayout from '@/app/layout/base'
import RecentlyAddedAlbums from '@/app/pages/recently-added-albums'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    children: [
      {
        path: '/recently-added',
        element: <RecentlyAddedAlbums />
      }
    ]
  }
])
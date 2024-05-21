import BaseLayout from '@/app/layout/base'
import ErrorPage from '@/app/pages/error-page'
import RecentlyAddedAlbums from '@/app/pages/recently-added-albums'
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <BaseLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: 'albums/recently-added',
        element: <RecentlyAddedAlbums />
      }
    ]
  }
])
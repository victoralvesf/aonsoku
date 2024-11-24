import { RouterProvider } from 'react-router-dom'
import { LangObserver } from '@/app/observers/lang-observer'
import { ThemeObserver } from '@/app/observers/theme-observer'
import { ToastContainer } from '@/app/observers/toast-container'
import { UpdateObserver } from '@/app/observers/update-observer'
import { router } from '@/routes/router'
import { isTauri } from '@/utils/tauriTools'

function App() {
  return (
    <>
      {isTauri() && <UpdateObserver />}
      <LangObserver />
      <ThemeObserver />
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App

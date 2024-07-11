import { RouterProvider } from 'react-router-dom'
import { LangObserver } from '@/app/observers/lang-observer'
import { ThemeObserver } from '@/app/observers/theme-observer'
import { ToastContainer } from '@/app/observers/toast-container'
import { router } from '@/routes/router'

function App() {
  return (
    <>
      <LangObserver />
      <ThemeObserver />
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  )
}

export default App

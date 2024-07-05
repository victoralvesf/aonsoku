import { RouterProvider } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import { LangObserver } from '@/app/observers/lang-observer'
import { ThemeObserver } from '@/app/observers/theme-observer'
import { router } from '@/routes/router'

function App() {
  return (
    <>
      <LangObserver />
      <ThemeObserver />
      <RouterProvider router={router} />
      <ToastContainer theme="colored" />
    </>
  )
}

export default App

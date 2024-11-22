import { Gnome } from '@/app/components/controls/gnome'
import { Windows } from '@/app/components/controls/windows'
import { AppTitle } from '@/app/components/header/app-title'
import { LoginForm } from '@/app/components/login/form'
import { isLinux, isWindows } from '@/utils/osType'

export default function Login() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <header
        data-tauri-drag-region
        className="w-full h-[--header-height] border-b bg-background flex justify-center items-center relative"
      >
        <AppTitle />
        <div className="flex items-center absolute right-4">
          {isLinux && <Gnome />}
          {isWindows && <Windows />}
        </div>
      </header>
      <main className="flex flex-col w-full h-full justify-center items-center">
        <LoginForm />
      </main>
    </div>
  )
}

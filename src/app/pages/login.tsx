import { AppTitle } from '@/app/components/header/app-title'
import { LoginForm } from '@/app/components/login/form'

export default function Login() {
  return (
    <div className="flex flex-col w-screen h-screen">
      <header className="w-full h-header border-b bg-background flex justify-center items-center relative">
        <AppTitle />
      </header>
      <main className="flex flex-col w-full h-full justify-center items-center">
        <LoginForm />
      </main>
    </div>
  )
}

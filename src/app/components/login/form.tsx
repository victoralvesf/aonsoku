import { FormEvent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigate } from "react-router-dom"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/app/components/ui/select"

import { Input } from "@/app/components/ui/input"
import { Label } from "@/app/components/ui/label"
import { ThemeToggle } from "@/app/components/header/theme-toggle"
import { Button } from "@/app/components/ui/button"
import { useApp } from "@/app/contexts/app-context"
import { ROUTES } from "@/routes/routesList"
import { LangSelect } from "@/app/components/header/lang-select"

export function LoginForm() {
  const {
    serverProtocol,
    setServerProtocol,
    setServerUrl,
    setServerUsername,
    setServerPassword,
    handleSaveServerConfig
  } = useApp()
  const navigate = useNavigate()
  const { t } = useTranslation()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const status = await handleSaveServerConfig()
    if (status) {
      navigate(ROUTES.LIBRARY.HOME, { replace: true })
    }
  }

  return (
    <Card className="w-[450px] bg-slate-100 dark:bg-slate-900">
      <form onSubmit={handleSubmit}>
        <CardHeader className="flex">
          <CardTitle className="flex flex-row justify-between items-center">
            {t('login.form.server')}
            <div className="flex gap-2 items-center">
              <LangSelect />
              <ThemeToggle />
            </div>
          </CardTitle>
          <CardDescription>
            {t('login.form.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="url">
                {t('login.form.url')} *
              </Label>
              <div className="flex flex-row gap-2">
                <Select onValueChange={setServerProtocol} value={serverProtocol}>
                  <SelectTrigger className="w-[110px]" >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="http://">http://</SelectItem>
                    <SelectItem value="https://">https://</SelectItem>
                  </SelectContent>
                </Select>
                <Input
                  id="url"
                  type="text"
                  placeholder={t('login.form.urlPlaceholder')}
                  autoCorrect="false"
                  autoCapitalize="false"
                  spellCheck="false"
                  required
                  onChange={(e) => setServerUrl(e.currentTarget.value)}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">
                {t('login.form.username')} *
              </Label>
              <Input
                id="username"
                type="text"
                placeholder={t('login.form.usernamePlaceholder')}
                autoCorrect="false"
                autoCapitalize="false"
                spellCheck="false"
                required
                onChange={(e) => setServerUsername(e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">
                {t('login.form.password')} *
              </Label>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setServerPassword(e.currentTarget.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex">
          <Button type="submit" className="w-full">
            {t('login.form.connect')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

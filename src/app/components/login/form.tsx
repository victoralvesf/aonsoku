import { Loader2 } from 'lucide-react'
import { FormEvent, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'
import { LangSelect } from '@/app/components/header/lang-select'
import { ThemeToggle } from '@/app/components/header/theme-toggle'
import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'

import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select'
import { ROUTES } from '@/routes/routesList'
import { useAppActions, useAppData } from '@/store/app.store'

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const { protocol } = useAppData()
  const { setProtocol, setUrl, setUsername, setPassword, saveConfig } =
    useAppActions()
  const navigate = useNavigate()
  const { t } = useTranslation()

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const status = await saveConfig()
    if (status) {
      toast.success(t('toast.server.success'))
      navigate(ROUTES.LIBRARY.HOME, { replace: true })
    } else {
      setLoading(false)
      toast.error(t('toast.server.error'))
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
          <CardDescription>{t('login.form.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="url">{t('login.form.url')} *</Label>
              <div className="flex flex-row gap-2">
                <Select onValueChange={setProtocol} value={protocol}>
                  <SelectTrigger className="w-[110px]">
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
                  onChange={(e) => setUrl(e.currentTarget.value)}
                />
              </div>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="username">{t('login.form.username')} *</Label>
              <Input
                id="username"
                type="text"
                placeholder={t('login.form.usernamePlaceholder')}
                autoCorrect="false"
                autoCapitalize="false"
                spellCheck="false"
                required
                onChange={(e) => setUsername(e.currentTarget.value)}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="password">{t('login.form.password')} *</Label>
              <Input
                id="password"
                type="password"
                required
                onChange={(e) => setPassword(e.currentTarget.value)}
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex">
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {t('login.form.connect')}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

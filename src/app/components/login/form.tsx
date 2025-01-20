import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import clsx from 'clsx'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { toast } from 'react-toastify'
import { z } from 'zod'
import { queryServerInfo } from '@/api/queryServerInfo'
import { LangToggle } from '@/app/components/login/lang-toggle'
import { Button } from '@/app/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { Password } from '@/app/components/ui/password'
import { ROUTES } from '@/routes/routesList'
import { useAppActions, useAppData } from '@/store/app.store'
import { removeSlashFromUrl } from '@/utils/removeSlashFromUrl'
import { isTauri } from '@/utils/tauriTools'

const loginSchema = z.object({
  url: z
    .string()
    .url({ message: 'login.form.validations.url' })
    .refine((value) => /^https?:\/\//.test(value), {
      message: 'login.form.validations.protocol',
    }),
  username: z
    .string({ required_error: 'login.form.validations.username' })
    .min(2, { message: 'login.form.validations.usernameLength' }),
  password: z
    .string({ required_error: 'login.form.validations.password' })
    .min(2, { message: 'login.form.validations.passwordLength' }),
})

type FormData = z.infer<typeof loginSchema>

const defaultUrl = isTauri() ? 'http://' : 'https://'
const url = window.SERVER_URL || defaultUrl
const urlIsValid = url !== defaultUrl

export function LoginForm() {
  const [loading, setLoading] = useState(false)
  const [serverIsIncompatible, setServerIsIncompatible] = useState(false)
  const { saveConfig } = useAppActions()
  const { hideServer } = useAppData()
  const navigate = useNavigate()
  const { t } = useTranslation()
  const queryClient = useQueryClient()

  const shouldHideUrlInput = urlIsValid && hideServer

  const form = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    values: {
      url,
      username: '',
      password: '',
    },
  })

  async function onSubmit(data: FormData, forceCompatible?: boolean) {
    setLoading(true)

    // Check if server is compatible
    const serverInfo = await queryServerInfo(removeSlashFromUrl(data.url))

    // If server version is lower than 1.15.0
    if (serverInfo.protocolVersionNumber < 1150 && forceCompatible !== true) {
      setServerIsIncompatible(true)
      setLoading(false)
      return
    } else {
      setServerIsIncompatible(false)
    }

    const status = await saveConfig({
      ...data,
      url: removeSlashFromUrl(data.url),
    })

    if (status) {
      await queryClient.invalidateQueries()
      toast.success(t('toast.server.success'))
      navigate(ROUTES.LIBRARY.HOME, { replace: true })
    } else {
      setLoading(false)
      toast.error(t('toast.server.error'))
    }
  }

  return (
    <>
      <Card className="w-[450px] bg-background-foreground">
        <Form {...form}>
          <form onSubmit={form.handleSubmit((data) => onSubmit(data))}>
            <CardHeader className="flex">
              <CardTitle className="flex flex-row justify-between items-center">
                {t('login.form.server')}
                <div className="flex gap-2 items-center">
                  <LangToggle />
                </div>
              </CardTitle>
              <CardDescription>{t('login.form.description')}</CardDescription>
            </CardHeader>

            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className={clsx(shouldHideUrlInput && 'hidden')}>
                    <FormLabel className="required">
                      {t('login.form.url')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="url"
                        type="text"
                        placeholder={t('login.form.urlDescription')}
                        autoCorrect="false"
                        autoCapitalize="false"
                        spellCheck="false"
                      />
                    </FormControl>
                    <FormDescription>
                      {t('login.form.urlDescription')}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className={clsx(shouldHideUrlInput && '!mt-0')}>
                    <FormLabel className="required">
                      {t('login.form.username')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        id="username"
                        type="text"
                        placeholder={t('login.form.usernamePlaceholder')}
                        autoCorrect="false"
                        autoCapitalize="false"
                        spellCheck="false"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required">
                      {t('login.form.password')}
                    </FormLabel>
                    <FormControl>
                      <Password {...field} value={field.value ?? ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>

            <CardFooter className="flex">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t('login.form.connecting')}
                  </>
                ) : (
                  <>{t('login.form.connect')}</>
                )}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <Dialog
        open={serverIsIncompatible}
        onOpenChange={(state) => {
          setServerIsIncompatible(state)
        }}
      >
        <DialogContent className="max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t('server.incompatible.title')}</DialogTitle>
          </DialogHeader>
          <p>{t('server.incompatible.description')}</p>
          <DialogFooter>
            <Button onClick={form.handleSubmit((data) => onSubmit(data, true))}>
              {t('server.incompatible.skip')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

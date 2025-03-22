import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'

import { toast } from 'react-toastify'
import { z } from 'zod'
import { Button } from '@/app/components/ui/button'
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/components/ui/form'
import { Input } from '@/app/components/ui/input'
import { subsonic } from '@/service/subsonic'
import { useRadios } from '@/store/radios.store'
import { Radio } from '@/types/responses/radios'
import { queryKeys } from '@/utils/queryKeys'

const radioSchema = z.object({
  name: z.string().min(3, { message: 'radios.form.validations.name' }),
  homePageUrl: z
    .string()
    .url({ message: 'radios.form.validations.url' })
    .min(10, { message: 'radios.form.validations.homepageUrlLength' })
    .refine((value) => /^https?:\/\//.test(value), {
      message: 'login.form.validations.protocol',
    })
    .or(z.literal('')),
  streamUrl: z
    .string()
    .url({ message: 'radios.form.validations.url' })
    .min(10, { message: 'radios.form.validations.streamUrlLength' })
    .refine((value) => /^https?:\/\//.test(value), {
      message: 'login.form.validations.protocol',
    }),
})

type RadioSchema = z.infer<typeof radioSchema>

const defaultValues: RadioSchema = {
  name: '',
  homePageUrl: '',
  streamUrl: '',
}

export function RadioFormDialog() {
  const { t } = useTranslation()
  const { data, setData, dialogState, setDialogState } = useRadios()

  const isCreation = Object.keys(data).length === 0

  const form = useForm<RadioSchema>({
    resolver: zodResolver(radioSchema),
    defaultValues,
  })

  useEffect(() => {
    if (isCreation) {
      form.reset(defaultValues)
    } else {
      form.reset({
        name: data.name ?? '',
        homePageUrl: data.homePageUrl ?? '',
        streamUrl: data.streamUrl ?? '',
      })
    }
  }, [data, form, isCreation])

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: subsonic.radios.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.radio.all],
      })
      toast.success(t('radios.form.create.toast.success'))
    },
    onError: () => {
      toast.error(t('radios.form.create.toast.error'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: subsonic.radios.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.radio.all],
      })
      toast.success(t('radios.form.edit.toast.success'))
    },
    onError: () => {
      toast.success(t('radios.form.edit.toast.error'))
    },
  })

  async function onSubmit({ name, homePageUrl, streamUrl }: RadioSchema) {
    if (isCreation) {
      await createMutation.mutateAsync({
        name,
        homePageUrl,
        streamUrl,
      })
    } else {
      await updateMutation.mutateAsync({
        id: data.id,
        name,
        homePageUrl,
        streamUrl,
      })
    }

    setDialogState(false)
    clear()
  }

  function clear() {
    setData({} as Radio)
  }

  return (
    <Dialog
      defaultOpen={false}
      open={dialogState}
      onOpenChange={(state) => {
        if (!state) clear()
        setDialogState(state)
      }}
    >
      <DialogContent className="max-w-[500px]" aria-describedby={undefined}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>
                {t(`radios.form.${isCreation ? 'create' : 'edit'}.title`)}
              </DialogTitle>
            </DialogHeader>
            <div className="my-4 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required">
                      {t('radios.table.name')}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} id="radio-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="homePageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('radios.table.homepage')}</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="radio-home-page-url"
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
                name="streamUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required">
                      {t('radios.table.stream')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        id="radio-stream-url"
                        autoCorrect="false"
                        autoCapitalize="false"
                        spellCheck="false"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {t(`radios.form.${isCreation ? 'create' : 'edit'}.button`)}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

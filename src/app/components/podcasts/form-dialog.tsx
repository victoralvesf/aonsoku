import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
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
import { Textarea } from '@/app/components/ui/textarea'
import { podcasts } from '@/service/podcasts'
import { logger } from '@/utils/logger'

const urlSchema = z
  .string()
  .url({ message: 'podcasts.form.dialog.validations.url' })
  .min(10, { message: 'podcasts.form.dialog.validations.urlLength' })
  .refine((value) => /^https?:\/\//.test(value), {
    message: 'podcasts.form.dialog.validations.protocol',
  })

const textareaSchema = z
  .string({
    message: 'podcasts.form.dialog.validations.atLeastOneUrl',
  })
  .transform((value) =>
    value
      .replace(' ', '\n')
      .split('\n')
      .map((line) => line.trim())
      .filter((line) => line !== ''),
  )
  .refine((urls) => urls.length > 0, {
    message: 'podcasts.form.dialog.validations.atLeastOneUrl',
  })
  .refine((urls) => urls.every((url) => urlSchema.safeParse(url).success), {
    message: 'podcasts.form.dialog.validations.url',
  })

const podcastSchema = z.object({
  feedUrl: textareaSchema,
})

type PodcastSchema = z.infer<typeof podcastSchema>

interface PodcastFormDialogProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const defaultValues = {
  feedUrl: [''],
}

export function PodcastFormDialog({ open, setOpen }: PodcastFormDialogProps) {
  const { t } = useTranslation()

  const form = useForm<PodcastSchema>({
    resolver: zodResolver(podcastSchema),
    defaultValues,
  })

  const createMutation = useMutation({
    mutationFn: podcasts.create,
    onSuccess: () => {
      toast.success(t('podcasts.form.toasts.success'))
      setOpen(false)
    },
    onError: (error) => {
      logger.error('[PodcastForm] - Error creating podcast', { error })
      toast.error(t('podcasts.form.toasts.error'))
    },
  })

  function onSubmit({ feedUrl }: PodcastSchema) {
    logger.info('[PodcastForm] - Sent body:', { body: feedUrl })

    createMutation.mutate({
      feed_urls: feedUrl,
    })
  }

  return (
    <Dialog
      defaultOpen={false}
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        form.reset(defaultValues)
      }}
    >
      <DialogContent className="max-w-[500px]" aria-describedby={undefined}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>{t('podcasts.form.dialog.title')}</DialogTitle>
            </DialogHeader>
            <div className="my-4 space-y-4">
              <FormField
                control={form.control}
                name="feedUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="required">
                      {t('podcasts.form.dialog.feedUrl')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        id="feed-url"
                        autoCorrect="off"
                        autoCapitalize="off"
                        spellCheck={false}
                        autoComplete="off"
                        className="max-h-[160px]"
                      />
                    </FormControl>
                    <p className="text-sm text-muted-foreground">
                      {t('podcasts.form.dialog.message')}
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                <span>{t('podcasts.form.dialog.saveButton')}</span>
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

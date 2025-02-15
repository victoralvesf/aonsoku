import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { Input } from '@/app/components/ui/input'
import { podcasts } from '@/service/podcasts'
import { queryKeys } from '@/utils/queryKeys'

const podcastSchema = z.object({
  feedUrl: z
    .string()
    .url({ message: 'radios.form.validations.url' })
    .min(10, { message: 'radios.form.validations.streamUrlLength' })
    .refine((value) => /^https?:\/\//.test(value), {
      message: 'login.form.validations.protocol',
    }),
})

type PodcastSchema = z.infer<typeof podcastSchema>

interface PodcastFormDialogProps {
  open: boolean
  setOpen: (value: boolean) => void
}

export function PodcastFormDialog({ open, setOpen }: PodcastFormDialogProps) {
  const { t } = useTranslation()

  const form = useForm<PodcastSchema>({
    resolver: zodResolver(podcastSchema),
    defaultValues: {
      feedUrl: '',
    },
  })

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: podcasts.create,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.podcast.all],
      })
      toast.success(t('podcasts.form.toasts.success'))
      setOpen(false)
      form.reset({ feedUrl: '' })
    },
    onError: () => {
      toast.error(t('podcasts.form.toasts.error'))
    },
  })

  async function onSubmit({ feedUrl }: PodcastSchema) {
    await createMutation.mutate({
      feed_urls: [feedUrl],
    })
  }

  return (
    <Dialog
      defaultOpen={false}
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        form.reset({ feedUrl: '' })
      }}
    >
      <DialogContent className="max-w-[500px]">
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
                      <Input
                        {...field}
                        id="feed-url"
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

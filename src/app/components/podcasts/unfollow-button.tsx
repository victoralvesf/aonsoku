import { useMutation, useQueryClient } from '@tanstack/react-query'
import { BookmarkIcon } from 'lucide-react'
import { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/app/components/ui/alert-dialog'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { ROUTES } from '@/routes/routesList'
import { podcasts } from '@/service/podcasts'
import { queryKeys } from '@/utils/queryKeys'

interface UnfollowButtonProps {
  title: string
  podcastId: string
}

export function UnfollowButton({ title, podcastId }: UnfollowButtonProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const queryClient = useQueryClient()

  const removeMutation = useMutation({
    mutationFn: podcasts.unfollow,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.podcast.all],
      })
      toast.success(t('podcasts.header.unfollow.toasts.success'))
      navigate(ROUTES.LIBRARY.PODCASTS)
    },
    onError: () => {
      toast.error(t('podcasts.header.unfollow.toasts.error'))
    },
  })

  async function handleUnfollow(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    await removeMutation.mutateAsync(podcastId)
  }

  return (
    <AlertDialog>
      <SimpleTooltip text={t('podcasts.header.unfollow.tooltip', { title })}>
        <AlertDialogTrigger asChild>
          <Button size="icon" className="rounded-full p-0 aspect-square">
            <BookmarkIcon className="w-4 h-4 fill-primary-foreground" />
          </Button>
        </AlertDialogTrigger>
      </SimpleTooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('podcasts.header.unfollow.dialog.title')}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('podcasts.header.unfollow.dialog.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('logout.dialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleUnfollow}>
            {t('logout.dialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppData } from '@/store/app.store'
import { useUser } from '@/app/hooks/use-user'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/app/components/ui/alert-dialog'
import { Button } from '@/app/components/ui/button'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Loader2, Key } from 'lucide-react'

interface ChangePasswordModalProps {
    isOpen: boolean
    onClose: () => void
    onSuccess?: () => void
    targetUsername?: string
}

export function ChangePasswordModal({
    isOpen,
    onClose,
    onSuccess,
    targetUsername,
}: ChangePasswordModalProps) {
    const { t } = useTranslation()
    const { userSetPassword } = useUser()
    const { username: currentUsername } = useAppData()

    const username = targetUsername || currentUsername
    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (isOpen) {
            setOldPassword('')
            setNewPassword('')
            setConfirmPassword('')
            setError('')
        }
    }, [isOpen])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')

        if (!oldPassword.trim()) {
            setError(t('userParams.form.passwordRequired'))
            return
        }

        if (!newPassword.trim()) {
            setError(t('userParams.form.passwordRequired'))
            return
        }

        if (newPassword !== confirmPassword) {
            setError(t('userParams.form.passwordsDoNotMatch'))
            return
        }

        if (newPassword.length < 8) {
            setError(t('userParams.form.passwordTooShort'))
            return
        }

        setIsLoading(true)

        try {
            const result = await userSetPassword(oldPassword, newPassword)

            if (result.success) {
                onSuccess?.()
                onClose()
            } else {
                setError(t(result.message))
            }
        } catch {
            setError(t('userParams.error.passwordChangeError'))
        } finally {
            setIsLoading(false)
        }
    }

    const isChangingOwnPassword = !targetUsername || targetUsername === currentUsername

    return (
        <AlertDialog open={isOpen} onOpenChange={onClose}>
        <AlertDialogContent className="sm:max-w-[500px]">
        <AlertDialogHeader>
        <div className="flex items-center gap-2">
        <Key className="h-5 w-5 text-primary" />
        <AlertDialogTitle>{t('userParams.form.changePassword')}</AlertDialogTitle>
        </div>
        <AlertDialogDescription>
        {isChangingOwnPassword ? (
            t('userParams.form.changingOwnPassword')
        ) : (
            <>
            {t('userParams.form.changingPasswordForUser')}:{' '}
            <span className="font-semibold text-foreground">{username}</span>
            </>
        )}
        </AlertDialogDescription>
        </AlertDialogHeader>

        <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">

        <div className="space-y-2">
        <Label htmlFor="oldPassword">{t('userParams.form.oldPassword')}</Label>
        <Input
        id="oldPassword"
        type="password"
        value={oldPassword}
        onChange={(e) => setOldPassword(e.target.value)}
        placeholder={t('userParams.form.enterOldPassword')}
        disabled={isLoading}
        autoComplete="new-password"
        autoFocus
        className={error ? 'border-destructive' : ''}

        />
        </div>

        <div className="space-y-2">
        <Label htmlFor="newPassword">{t('userParams.form.newPassword')}</Label>
        <Input
        id="newPassword"
        type="password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        placeholder={t('userParams.form.enterNewPassword')}
        disabled={isLoading}
        autoComplete="new-password"
        autoFocus
        className={error && newPassword !== confirmPassword ? 'border-destructive' : ''}
        />
        </div>

        <div className="space-y-2">
        <Label htmlFor="confirmPassword">{t('userParams.form.confirmPassword')}</Label>
        <Input
        id="confirmPassword"
        type="password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        placeholder={t('userParams.form.enterConfirmPassword')}
        disabled={isLoading}
        autoComplete="new-password"
        className={error && newPassword !== confirmPassword ? 'border-destructive' : ''}
        />
        </div>

        {error && (
            <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
            </div>
        )}
        </div>

        <AlertDialogFooter>
        <Button
        type="button"
        variant="outline"
        onClick={onClose}
        disabled={isLoading}
        >
        {t('userParams.form.cancel')}
        </Button>
        <Button
        type="submit"
        disabled={isLoading || !newPassword || !confirmPassword}
        >
        {isLoading ? (
            <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {t('userParams.form.changing')}
            </>
        ) : (
            t('userParams.form.changePasswordButton')
        )}
        </Button>
        </AlertDialogFooter>
        </form>
        </AlertDialogContent>
        </AlertDialog>
    )
}

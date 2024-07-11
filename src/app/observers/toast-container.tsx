import { XIcon } from 'lucide-react'
import { ToastContainer as Container } from 'react-toastify'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'
import { toastColors } from '@/utils/toastColors'

export function ToastContainer() {
  return (
    <Container
      toastClassName={(context) => {
        const type = context?.type === 'error' ? 'error' : 'default'

        return cn(
          toastColors[type],
          'mb-2 font-sans relative flex flex-row p-1 min-h-10 rounded-md justify-between overflow-hidden shadow-md',
        )
      }}
      bodyClassName="flex text-sm block p-3"
      pauseOnHover={false}
      autoClose={3000}
      closeButton={(props) => (
        <Button
          variant="link"
          size="icon"
          onClick={props.closeToast}
          aria-label={props.ariaLabel}
          className="w-6 h-6"
        >
          <XIcon className="w-4 h-4 text-foreground" />
        </Button>
      )}
    />
  )
}

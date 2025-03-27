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
          'flex font-sans min-h-toast rounded-md justify-between shadow-md overflow-hidden',
        )
      }}
      bodyClassName="flex text-sm block p-3"
      pauseOnHover={false}
      pauseOnFocusLoss={false}
      position="top-center"
      stacked={true}
      newestOnTop={true}
      autoClose={5000}
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

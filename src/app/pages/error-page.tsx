import { Link, useRouteError } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import { ROUTES } from '@/routes/routesList'

interface IError {
  status?: number
  statusText?: string
  internal?: boolean
  data?: string
}

export default function ErrorPage({ status, statusText }: IError) {
  const error = useRouteError() as IError

  return (
    <div className="w-full h-content flex flex-col justify-center items-center">
      <h1 className="scroll-m-20 text-4xl font-bold tracking-tight lg:text-5xl">
        Oops!
      </h1>

      <p className="leading-7 text-left mt-6">
        Status Code:{' '}
        <strong className="font-semibold">
          {(error?.status ?? status) || 'None'}
        </strong>
      </p>
      <p className="leading-7 mt-2 text-left">
        Description:{' '}
        <strong className="font-semibold">
          {(error?.data ?? statusText) || 'Unhandled Error'}
        </strong>
      </p>

      <Link to={ROUTES.LIBRARY.HOME}>
        <Button className="mt-6">Back to home</Button>
      </Link>
    </div>
  )
}

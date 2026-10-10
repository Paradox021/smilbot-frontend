import { Link } from 'react-router'
import { ROUTES } from '@/shared/config/routes'
import { Button } from '@/shared/ui/button'
import { Mascot } from '@/shared/ui/mascot'
import { appTexts } from '../texts'

interface MessagePageProps {
  title: string
  description: string
}

export function MessagePage({ title, description }: MessagePageProps) {
  return (
    <section className="flex flex-col items-center gap-3 py-12 text-center">
      <Mascot halo className="mb-6 size-36" sizes="144px" />
      <h1 className="text-2xl font-extrabold text-balance md:text-3xl">{title}</h1>
      <p className="text-body">{description}</p>
      <Button asChild variant="secondary" className="mt-3">
        <Link to={ROUTES.home}>{appTexts.backHome}</Link>
      </Button>
    </section>
  )
}

export function NotFoundPage() {
  return <MessagePage title={appTexts.notFoundTitle} description={appTexts.notFoundDescription} />
}

export function RouteErrorPage() {
  return (
    <main className="mx-auto max-w-4xl px-4">
      <MessagePage title={appTexts.routeErrorTitle} description={appTexts.routeErrorDescription} />
    </main>
  )
}

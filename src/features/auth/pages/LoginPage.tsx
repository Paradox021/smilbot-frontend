import { Navigate, useLocation } from 'react-router'
import { ROUTES } from '@/shared/config/routes'
import { Mascot } from '@/shared/ui/mascot'
import { LoginButton } from '../components/LoginButton'
import { SessionError, SessionLoading } from '../components/SessionStatus'
import { useCurrentUser } from '../queries'
import { getReturnTo } from '../returnTo'
import { authTexts } from '../texts'

/** Motas de luz fijas alrededor de la mascota: posición (%), tamaño (px) y opacidad. */
const MOTES = [
  { top: '4%', left: '88%', size: 8, opacity: 0.7 },
  { top: '22%', left: '-6%', size: 6, opacity: 0.5 },
  { top: '78%', left: '96%', size: 5, opacity: 0.45 },
  { top: '92%', left: '14%', size: 7, opacity: 0.6 },
  { top: '-4%', left: '30%', size: 4, opacity: 0.4 },
] as const

function LoginMascot() {
  return (
    <div className="relative">
      <Mascot halo className="size-48 md:size-70" sizes="(min-width: 768px) 280px, 192px" />
      {MOTES.map((mote) => (
        <span
          key={`${mote.top}-${mote.left}`}
          aria-hidden
          className="absolute rounded-full bg-primary"
          style={{
            top: mote.top,
            left: mote.left,
            width: mote.size,
            height: mote.size,
            opacity: mote.opacity,
            boxShadow: `0 0 ${mote.size * 2}px rgb(255 173 98 / 0.6)`,
          }}
        />
      ))}
    </div>
  )
}

export function LoginPage() {
  const { data: user, isPending, isError, refetch } = useCurrentUser()
  const location = useLocation()
  const returnTo = getReturnTo(location.state)

  if (isPending) return <SessionLoading />
  if (isError) return <SessionError onRetry={() => void refetch()} />
  if (user) return <Navigate to={returnTo ?? ROUTES.dashboard} replace />

  return (
    <section className="flex flex-1 flex-col items-center gap-10 py-4 text-center md:grid md:grid-cols-[auto_1fr] md:items-center md:gap-16 md:py-16 md:text-left">
      <LoginMascot />
      <div className="flex flex-col items-center gap-5 md:items-start">
        <p className="text-xs font-semibold tracking-[0.18em] text-primary uppercase">
          {authTexts.welcomeEyebrow}
        </p>
        <h1 className="max-w-[16ch] text-4xl leading-[1.05] font-extrabold text-balance md:text-[3.5rem]">
          {authTexts.welcomeTitle}
        </h1>
        <p className="max-w-[42ch] text-lg leading-relaxed text-body">
          {authTexts.welcomeDescription}
        </p>
        <div className="mt-3 flex w-full flex-col items-center gap-3 md:items-start">
          <LoginButton returnTo={returnTo} className="w-full max-w-xs md:w-auto" />
          <p className="text-sm text-muted-foreground">{authTexts.loginNote}</p>
        </div>
      </div>
    </section>
  )
}

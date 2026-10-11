import { cn } from 'cn'
import { PawPrint } from 'lucide-react'
import { STREAK_WEEK_DAYS, type StreakWeek } from '../streakWeek'
import { homeTexts as t } from '../texts'

interface StreakPawsProps {
  week: StreakWeek
  /** Hoy aún no se ha reclamado. */
  todayPending: boolean
  atRisk: boolean
}

function pawClass(index: number, { week, todayPending, atRisk }: StreakPawsProps): string {
  const done = index < week.filled
  const today = index === week.todayIndex
  if (today && todayPending) {
    return atRisk
      ? 'border-2 border-dashed border-warning text-warning'
      : 'border-2 border-dashed border-foreground/35 text-muted-foreground'
  }
  if (done) {
    return cn(
      'bg-foreground text-background',
      today && 'ring-2 ring-foreground/25 ring-offset-2 ring-offset-card',
    )
  }
  return 'bg-muted text-muted-foreground/40'
}

/** Tira de 7 huellas: los días de la racha de esta semana, con hoy marcado. */
export function StreakPaws(props: StreakPawsProps) {
  return (
    <div
      role="img"
      aria-label={t.streakPaws(props.week.filled)}
      className="grid max-w-xs grid-cols-7 gap-1.5"
    >
      {Array.from({ length: STREAK_WEEK_DAYS }, (_, index) => (
        <span
          key={index}
          className={cn(
            'flex aspect-square items-center justify-center rounded-full',
            pawClass(index, props),
          )}
        >
          <PawPrint aria-hidden className="size-[45%]" />
        </span>
      ))}
    </div>
  )
}

const LOCALE = 'es-ES'

const numberFormatter = new Intl.NumberFormat(LOCALE, { useGrouping: 'always' })

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

const percentFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  maximumFractionDigits: 1,
})
const signedPercentFormatter = new Intl.NumberFormat(LOCALE, {
  style: 'percent',
  maximumFractionDigits: 1,
  signDisplay: 'exceptZero',
})

/** Recibe puntos porcentuales (`138.5` → `138,5 %`). */
export function formatPercent(points: number, { signed = false } = {}): string {
  return (signed ? signedPercentFormatter : percentFormatter).format(points / 100)
}

const monthYearFormatter = new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' })

/** Mes y año (`2025-03-12T12:00:00Z` → `marzo de 2025`). */
export function formatMonthYear(value: string | Date): string {
  return monthYearFormatter.format(new Date(value))
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat(LOCALE, { numeric: 'auto' })

const RELATIVE_UNITS: [Intl.RelativeTimeFormatUnit, number][] = [
  ['day', 86_400_000],
  ['hour', 3_600_000],
  ['minute', 60_000],
]

/** Tiempo relativo respecto a `now` (`dentro de 3 horas`, `mañana`, `hace 5 minutos`). */
export function formatRelativeTime(value: string | Date, now: Date = new Date()): string {
  const diff = new Date(value).getTime() - now.getTime()
  for (const [unit, ms] of RELATIVE_UNITS) {
    if (Math.abs(diff) >= ms) return relativeTimeFormatter.format(Math.round(diff / ms), unit)
  }
  return relativeTimeFormatter.format(Math.round(diff / 1000), 'second')
}

const pad = (value: number) => String(value).padStart(2, '0')

/** Cuenta atrás `HH:MM:SS` hasta `target` (`00:00:00` si ya pasó). */
export function formatCountdown(target: string | Date, now: Date = new Date()): string {
  const totalSeconds = Math.max(0, Math.ceil((new Date(target).getTime() - now.getTime()) / 1000))
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  return `${pad(hours)}:${pad(minutes)}:${pad(totalSeconds % 60)}`
}

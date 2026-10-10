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

const dateFormatter = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long' })

/** Fecha larga en español (`2025-03-12T12:00:00Z` → `12 de marzo de 2025`). */
export function formatDate(value: string | Date): string {
  return dateFormatter.format(new Date(value))
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

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

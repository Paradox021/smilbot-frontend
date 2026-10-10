const LOCALE = 'es-ES'

const numberFormatter = new Intl.NumberFormat(LOCALE, { useGrouping: 'always' })
const dateFormatter = new Intl.DateTimeFormat(LOCALE, { dateStyle: 'long' })

export function formatNumber(value: number): string {
  return numberFormatter.format(value)
}

export function formatDate(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : dateFormatter.format(date)
}

import { formatDate, formatNumber, formatPercent, formatRelativeTime } from './format'

describe('format', () => {
  it('formatea números en español', () => {
    expect(formatNumber(1234567)).toBe('1.234.567')
    expect(formatNumber(1650)).toBe('1.650')
  })

  it('formatea puntos porcentuales', () => {
    expect(formatPercent(138.5)).toBe('138,5 %')
    expect(formatPercent(100)).toBe('100 %')
  })

  it('formatea porcentajes con signo', () => {
    expect(formatPercent(38.5, { signed: true })).toBe('+38,5 %')
    expect(formatPercent(-12, { signed: true })).toBe('-12 %')
    expect(formatPercent(0, { signed: true })).toBe('0 %')
  })

  it('formatea fechas largas en español', () => {
    expect(formatDate('2025-03-12T12:00:00.000Z')).toBe('12 de marzo de 2025')
  })

  it('formatea tiempo relativo con la unidad más grande que cabe', () => {
    const now = new Date('2025-06-01T12:00:00.000Z')
    const at = (ms: number) => new Date(now.getTime() + ms)
    expect(formatRelativeTime(at(3 * 3_600_000), now)).toBe('dentro de 3 horas')
    expect(formatRelativeTime(at(25 * 60_000), now)).toBe('dentro de 25 minutos')
    expect(formatRelativeTime(at(24 * 3_600_000), now)).toBe('mañana')
    expect(formatRelativeTime(at(3 * 86_400_000), now)).toBe('dentro de 3 días')
    expect(formatRelativeTime(at(-5 * 60_000), now)).toBe('hace 5 minutos')
    expect(formatRelativeTime(now.toISOString(), now)).toBe('ahora')
  })
})

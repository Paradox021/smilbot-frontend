import { formatNumber, formatPercent } from './format'

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
})

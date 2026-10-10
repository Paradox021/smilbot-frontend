import { formatDate, formatNumber } from './format'

describe('format', () => {
  it('formatea números en español', () => {
    expect(formatNumber(1234567)).toBe('1.234.567')
    expect(formatNumber(1650)).toBe('1.650')
  })

  it('formatea fechas ISO en español', () => {
    expect(formatDate('2026-01-15T12:00:00.000Z')).toBe('15 de enero de 2026')
  })

  it('devuelve un guion para fechas inválidas', () => {
    expect(formatDate('no-es-fecha')).toBe('—')
  })
})

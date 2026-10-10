import { buildReturnTo, getReturnTo, sanitizeReturnTo } from './returnTo'

describe('sanitizeReturnTo', () => {
  it.each(['/perfil', '/perfil?tab=stats', '/cartas/42'])('acepta rutas relativas: %s', (path) => {
    expect(sanitizeReturnTo(path)).toBe(path)
  })

  it.each(['/', '//evil.com', '/\\evil.com', 'https://evil.com', 'perfil', '', 42, null])(
    'rechaza %s',
    (value) => {
      expect(sanitizeReturnTo(value)).toBeNull()
    },
  )
})

describe('buildReturnTo', () => {
  it('conserva la query pero quita el parámetro login', () => {
    expect(buildReturnTo('/perfil', '?login=error&tab=stats')).toBe('/perfil?tab=stats')
    expect(buildReturnTo('/perfil', '?login=success')).toBe('/perfil')
  })

  it('no devuelve retorno para la raíz', () => {
    expect(buildReturnTo('/', '')).toBeNull()
  })
})

describe('getReturnTo', () => {
  it('lee y valida el estado de navegación', () => {
    expect(getReturnTo({ returnTo: '/perfil' })).toBe('/perfil')
    expect(getReturnTo({ returnTo: '//evil.com' })).toBeNull()
    expect(getReturnTo(null)).toBeNull()
  })
})

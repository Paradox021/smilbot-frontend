import { parseEnv } from './env'

describe('parseEnv', () => {
  it('acepta una URL válida y quita la barra final', () => {
    expect(parseEnv({ VITE_API_URL: 'http://localhost:3000/' })).toEqual({
      VITE_API_URL: 'http://localhost:3000',
    })
  })

  it('falla si falta VITE_API_URL', () => {
    expect(() => parseEnv({})).toThrow(/VITE_API_URL/)
  })

  it('falla si VITE_API_URL no es una URL http(s)', () => {
    expect(() => parseEnv({ VITE_API_URL: 'localhost:3000' })).toThrow(/VITE_API_URL/)
    expect(() => parseEnv({ VITE_API_URL: 'ftp://api.smilbot' })).toThrow(/VITE_API_URL/)
  })
})

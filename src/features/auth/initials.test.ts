import { getInitials } from './initials'

describe('getInitials', () => {
  it('saca las iniciales del nombre', () => {
    expect(getInitials('Gamer123')).toBe('GA')
    expect(getInitials('john doe')).toBe('JD')
    expect(getInitials('   ')).toBe('?')
  })
})

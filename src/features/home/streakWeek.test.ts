import { getStreakWeek } from './streakWeek'

describe('getStreakWeek', () => {
  it('sin racha, hoy es la primera huella por rellenar', () => {
    expect(getStreakWeek(0, false)).toEqual({ week: 1, filled: 0, todayIndex: 0 })
  })

  it('con el daily reclamado, hoy es la última huella rellena', () => {
    expect(getStreakWeek(4, true)).toEqual({ week: 1, filled: 4, todayIndex: 3 })
    expect(getStreakWeek(7, true)).toEqual({ week: 1, filled: 7, todayIndex: 6 })
  })

  it('con el daily pendiente, hoy es la siguiente huella', () => {
    expect(getStreakWeek(4, false)).toEqual({ week: 1, filled: 4, todayIndex: 4 })
  })

  it('pasada la primera semana cuenta semanas', () => {
    expect(getStreakWeek(11, true)).toEqual({ week: 2, filled: 4, todayIndex: 3 })
    expect(getStreakWeek(7, false)).toEqual({ week: 2, filled: 0, todayIndex: 0 })
    expect(getStreakWeek(15, true)).toEqual({ week: 3, filled: 1, todayIndex: 0 })
  })
})

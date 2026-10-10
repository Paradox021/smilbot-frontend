import {
  initialPullSequence,
  isAnimating,
  pullSequenceReducer as reduce,
  type PullSequenceState,
} from './sequence'
import type { PullOutcome } from './types'

const outcomeOf = (type: number): PullOutcome => ({
  isNew: true,
  result: {
    _id: 'c1',
    name: 'SwimmingLarry',
    description: '',
    type,
    roll: 3,
    isPity: false,
    pity: { current: 0, threshold: 250, remaining: 250 },
  },
})

const shuffling = reduce(initialPullSequence, { type: 'start' })
const resolve = (state: PullSequenceState, type: number, reducedMotion = false) =>
  reduce(state, { type: 'resolved', outcome: outcomeOf(type), reducedMotion })

describe('pullSequenceReducer', () => {
  it('al empezar baraja y cuenta una ronda nueva', () => {
    expect(shuffling).toMatchObject({ phase: 'shuffling', outcome: null, round: 1 })
    expect(reduce(shuffling, { type: 'start' }).round).toBe(2)
  })

  it('una mítica pasa por anticipación, giro y resultado', () => {
    const anticipation = resolve(shuffling, 4)
    expect(anticipation.phase).toBe('anticipation')
    const revealing = reduce(anticipation, { type: 'advance' })
    expect(revealing.phase).toBe('revealing')
    expect(reduce(revealing, { type: 'advance' }).phase).toBe('result')
  })

  it('una común gira directamente', () => {
    expect(resolve(shuffling, 0).phase).toBe('revealing')
  })

  it('con movimiento reducido va directa al resultado', () => {
    expect(resolve(shuffling, 4, true)).toMatchObject({ phase: 'result', skipped: false })
  })

  it('saltar durante la anticipación o el giro lleva al resultado', () => {
    const anticipation = resolve(shuffling, 4)
    expect(reduce(anticipation, { type: 'skip' })).toMatchObject({
      phase: 'result',
      skipped: true,
    })
    const revealing = reduce(anticipation, { type: 'advance' })
    expect(reduce(revealing, { type: 'skip' }).phase).toBe('result')
  })

  it('saltar mientras se baraja muestra el resultado en cuanto llega', () => {
    const skipped = reduce(shuffling, { type: 'skip' })
    expect(skipped.phase).toBe('shuffling')
    expect(resolve(skipped, 4)).toMatchObject({ phase: 'result', skipped: true })
  })

  it('un error vuelve al estado inicial', () => {
    expect(reduce(shuffling, { type: 'failed' })).toMatchObject({ phase: 'idle', outcome: null })
  })

  it('ignora respuestas y avances fuera de lugar', () => {
    expect(resolve(initialPullSequence, 4)).toBe(initialPullSequence)
    expect(reduce(initialPullSequence, { type: 'advance' })).toBe(initialPullSequence)
    expect(reduce(initialPullSequence, { type: 'skip' })).toBe(initialPullSequence)
  })
})

describe('isAnimating', () => {
  it('solo entre pulsar y ver el resultado', () => {
    expect(isAnimating('idle')).toBe(false)
    expect(isAnimating('shuffling')).toBe(true)
    expect(isAnimating('anticipation')).toBe(true)
    expect(isAnimating('revealing')).toBe(true)
    expect(isAnimating('result')).toBe(false)
  })
})

import { useCallback, useEffect, useReducer } from 'react'
import { getRevealTiming, PACK_OPEN_MS } from '../reveal'
import { initialPullSequence, isAnimating, pullSequenceReducer } from '../sequence'
import type { PullOutcome } from '../types'

/** Avanza la secuencia de la tirada con temporizadores y permite saltarla con cualquier tecla. */
export function usePullSequence() {
  const [state, dispatch] = useReducer(pullSequenceReducer, initialPullSequence)
  const { phase, outcome } = state
  const animating = isAnimating(phase)

  useEffect(() => {
    if (!outcome) return
    const timing = getRevealTiming(outcome.result.type)
    const delays: Partial<Record<typeof phase, number>> = {
      anticipation: timing.anticipationMs,
      opening: PACK_OPEN_MS,
      revealing: timing.flipMs,
    }
    const delay = delays[phase] ?? null
    if (delay === null) return
    const timer = window.setTimeout(() => dispatch({ type: 'advance' }), delay)
    return () => window.clearTimeout(timer)
  }, [phase, outcome])

  useEffect(() => {
    if (!animating) return
    const onKeyDown = () => dispatch({ type: 'skip' })
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [animating])

  return {
    state,
    animating,
    start: useCallback(() => dispatch({ type: 'start' }), []),
    resolve: useCallback(
      (resolved: PullOutcome, reducedMotion: boolean) =>
        dispatch({ type: 'resolved', outcome: resolved, reducedMotion }),
      [],
    ),
    fail: useCallback(() => dispatch({ type: 'failed' }), []),
    skip: useCallback(() => dispatch({ type: 'skip' }), []),
  }
}

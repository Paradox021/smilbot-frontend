import { getRevealTiming } from './reveal'
import type { PullOutcome } from './types'

/**
 * `shuffling`: petición en vuelo, el dorso se baraja.
 * `anticipation`: ya se conoce la carta, el dorso brilla con el color de su rareza.
 * `revealing`: la carta gira.
 */
export type PullPhase = 'idle' | 'shuffling' | 'anticipation' | 'revealing' | 'result'

export interface PullSequenceState {
  phase: PullPhase
  outcome: PullOutcome | null
  /** El usuario saltó la animación: se va al resultado sin transiciones. */
  skipped: boolean
  /** Sube en cada tirada; sirve de `key` para reiniciar las animaciones. */
  round: number
}

export type PullSequenceAction =
  | { type: 'start' }
  | { type: 'resolved'; outcome: PullOutcome; reducedMotion: boolean }
  | { type: 'advance' }
  | { type: 'skip' }
  | { type: 'failed' }

export const initialPullSequence: PullSequenceState = {
  phase: 'idle',
  outcome: null,
  skipped: false,
  round: 0,
}

export function isAnimating(phase: PullPhase): boolean {
  return phase === 'shuffling' || phase === 'anticipation' || phase === 'revealing'
}

export function pullSequenceReducer(
  state: PullSequenceState,
  action: PullSequenceAction,
): PullSequenceState {
  switch (action.type) {
    case 'start':
      return { phase: 'shuffling', outcome: null, skipped: false, round: state.round + 1 }
    case 'resolved': {
      if (state.phase !== 'shuffling') return state
      const { outcome } = action
      if (state.skipped || action.reducedMotion) return { ...state, phase: 'result', outcome }
      const { anticipationMs } = getRevealTiming(outcome.result.type)
      return { ...state, phase: anticipationMs > 0 ? 'anticipation' : 'revealing', outcome }
    }
    case 'advance':
      if (state.phase === 'anticipation') return { ...state, phase: 'revealing' }
      if (state.phase === 'revealing') return { ...state, phase: 'result' }
      return state
    case 'skip':
      if (state.phase === 'shuffling') return { ...state, skipped: true }
      if (state.phase === 'anticipation' || state.phase === 'revealing') {
        return { ...state, phase: 'result', skipped: true }
      }
      return state
    case 'failed':
      return { ...state, phase: 'idle', outcome: null, skipped: false }
  }
}

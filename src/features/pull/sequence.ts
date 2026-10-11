import { getRevealTiming } from './reveal'
import type { PullOutcome } from './types'

/**
 * `idle`: el sobre en reposo.
 * `shuffling`: petición en vuelo, el sobre tiembla.
 * `anticipation`: ya se conoce la carta, se escapa luz de su rareza por la línea de corte.
 * `opening`: la solapa se rasga y sale volando.
 * `revealing`: la carta sube desde dentro del sobre y gira.
 */
export type PullPhase = 'idle' | 'shuffling' | 'anticipation' | 'opening' | 'revealing' | 'result'

const ANIMATING_PHASES: readonly PullPhase[] = ['shuffling', 'anticipation', 'opening', 'revealing']

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
  return ANIMATING_PHASES.includes(phase)
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
      return { ...state, phase: anticipationMs > 0 ? 'anticipation' : 'opening', outcome }
    }
    case 'advance':
      if (state.phase === 'anticipation') return { ...state, phase: 'opening' }
      if (state.phase === 'opening') return { ...state, phase: 'revealing' }
      if (state.phase === 'revealing') return { ...state, phase: 'result' }
      return state
    case 'skip':
      if (state.phase === 'shuffling') return { ...state, skipped: true }
      if (isAnimating(state.phase)) {
        return { ...state, phase: 'result', skipped: true }
      }
      return state
    case 'failed':
      return { ...state, phase: 'idle', outcome: null, skipped: false }
  }
}

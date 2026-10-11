import { useEffect, useRef } from 'react'
import { getRevealTiming, getVibrationPattern } from '../reveal'
import type { PullSequenceState } from '../sequence'

/**
 * Vibra una vez por tirada al revelar una Épica o mejor, en el destello de la carta.
 * Solo donde el navegador lo soporta (`navigator.vibrate`; iOS Safari no lo tiene).
 */
export function useRevealVibration({ phase, outcome, skipped, round }: PullSequenceState) {
  const vibratedRound = useRef(0)

  useEffect(() => {
    if (!outcome || (phase !== 'revealing' && phase !== 'result')) return
    if (vibratedRound.current === round) return
    const pattern = getVibrationPattern(outcome.result.type)
    if (!pattern || typeof navigator.vibrate !== 'function') return

    vibratedRound.current = round
    const delay =
      phase === 'revealing' && !skipped ? getRevealTiming(outcome.result.type).flipMs * 0.45 : 0
    const timer = window.setTimeout(() => navigator.vibrate(pattern), delay)
    return () => window.clearTimeout(timer)
  }, [phase, outcome, skipped, round])
}

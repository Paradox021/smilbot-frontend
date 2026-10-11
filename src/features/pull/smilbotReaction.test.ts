import { getSmilbotReaction } from './smilbotReaction'
import type { PullOutcome } from './types'

const outcome = (type: number, extra: Partial<PullOutcome> = {}, isPity = false): PullOutcome => ({
  isNew: true,
  copies: 1,
  ...extra,
  result: {
    _id: 'c1',
    name: 'SwimmingLarry',
    description: '',
    type,
    roll: isPity ? null : 3,
    isPity,
    pity: { current: 0, threshold: 250, remaining: 250 },
  },
})

describe('getSmilbotReaction', () => {
  it('reacciona a Épica, Legendaria y Mítica', () => {
    expect(getSmilbotReaction(outcome(2))).toBe('epic')
    expect(getSmilbotReaction(outcome(3))).toBe('legendary')
    expect(getSmilbotReaction(outcome(4))).toBe('mythic')
    expect(getSmilbotReaction(outcome(4, {}, true))).toBe('pityMythic')
  })

  it('no dice nada de una común o rara nueva', () => {
    expect(getSmilbotReaction(outcome(0))).toBeNull()
    expect(getSmilbotReaction(outcome(1))).toBeNull()
    expect(getSmilbotReaction(outcome(1, { isNew: null, copies: null }))).toBeNull()
  })

  it('las repetidas, sin emoción; la rareza manda sobre la repetición', () => {
    expect(getSmilbotReaction(outcome(0, { isNew: false, copies: 3 }))).toBe('duplicate')
    expect(getSmilbotReaction(outcome(3, { isNew: false, copies: 2 }))).toBe('legendary')
  })
})

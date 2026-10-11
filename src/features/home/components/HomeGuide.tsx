import type { DailyStatus } from '@/features/daily'
import type { UserStats } from '@/features/stats'
import { DAILY_REWARD } from '@/shared/config/economy'
import { formatNumber, formatRelativeTime } from '@/shared/lib/format'
import { SmilbotSays } from '@/shared/ui/smilbot-says'
import { getSmilbotMessage, type SmilbotMessage } from '../smilbotMessage'
import { homeTexts } from '../texts'

const t = homeTexts.smilbot

function messageText(message: SmilbotMessage, username: string, now: Date): string {
  switch (message.kind) {
    case 'streakAtRisk':
      return t.streakAtRisk(
        formatNumber(message.streak),
        formatRelativeTime(message.expiresAt, now),
      )
    case 'dailyReady':
      return t.dailyReady(formatNumber(DAILY_REWARD))
    case 'pityClose':
      return message.remaining <= 0
        ? t.pityNext
        : t.pityClose(message.remaining, formatNumber(message.remaining))
    case 'firstPack':
      return t.firstPack
    case 'greeting':
      return (t.greetings[message.index] ?? t.greetings[0])(username)
  }
}

interface HomeGuideProps {
  stats: UserStats
  daily: DailyStatus
  now: Date
}

/** Smilbot dice lo más importante para el usuario ahora mismo. */
export function HomeGuide({ stats, daily, now }: HomeGuideProps) {
  const message = getSmilbotMessage(stats, daily, now, t.greetings.length)
  return (
    <SmilbotSays messageKey={message.kind}>{messageText(message, stats.username, now)}</SmilbotSays>
  )
}

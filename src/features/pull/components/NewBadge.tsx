import { PawPrint } from 'lucide-react'
import { motion } from 'motion/react'
import { SPRING } from '@/shared/config/motion'
import { Badge } from '@/shared/ui/badge'
import { pullTexts as t } from '../texts'

const CONFETTI = [
  { x: -46, y: -20, rotate: -35 },
  { x: -30, y: -34, rotate: 20 },
  { x: -8, y: -40, rotate: -10 },
  { x: 14, y: -38, rotate: 30 },
  { x: 34, y: -30, rotate: -25 },
  { x: 48, y: -16, rotate: 15 },
]

/** "Nueva" entra con un rebote y suelta unas huellas pequeñas como confeti. */
export function NewBadge() {
  return (
    <span className="relative inline-flex">
      <motion.span
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ ...SPRING.bouncy, delay: 0.15 }}
        className="inline-flex"
      >
        <Badge>{t.newBadge}</Badge>
      </motion.span>
      {CONFETTI.map(({ x, y, rotate }, index) => (
        <motion.span
          key={index}
          aria-hidden
          className="pointer-events-none absolute top-1/2 left-1/2 -mt-1.5 -ml-1.5 text-muted-foreground"
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4, rotate: 0 }}
          animate={{ x, y, opacity: [0, 1, 0], scale: 1, rotate }}
          transition={{ duration: 0.9, delay: 0.2 + index * 0.03, ease: 'easeOut' }}
        >
          <PawPrint className="size-3" />
        </motion.span>
      ))}
    </span>
  )
}

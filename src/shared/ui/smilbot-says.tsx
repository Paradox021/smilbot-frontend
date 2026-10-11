import type { ReactNode } from 'react'
import { cn } from 'cn'
import { Mascot } from './mascot'

interface SmilbotSaysProps {
  children: ReactNode
  /** Identifica el mensaje: al cambiar, el bocadillo vuelve a entrar con su rebote. */
  messageKey: string
  className?: string
}

/**
 * Smilbot como guía: la mascota pequeña con un bocadillo. Un solo mensaje cada vez.
 * Es texto normal para el lector de pantalla (sin `aria-live`). Ver DESIGN.md, "La mascota".
 */
export function SmilbotSays({ children, messageKey, className }: SmilbotSaysProps) {
  return (
    <div className={cn('flex items-end gap-3', className)}>
      <Mascot className="size-12 sm:size-14" sizes="56px" />
      <p
        key={messageKey}
        className="min-w-0 origin-bottom-left rounded-lg rounded-bl-xs bg-secondary px-4 py-3 text-[15px] leading-snug text-pretty text-body motion-safe:animate-pop-in"
      >
        {children}
      </p>
    </div>
  )
}

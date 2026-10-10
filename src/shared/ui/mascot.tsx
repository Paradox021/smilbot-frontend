import { cn } from 'cn'
import smilbot128 from '@/assets/mascot/smilbot-128.webp'
import smilbot320 from '@/assets/mascot/smilbot-320.webp'
import smilbot640 from '@/assets/mascot/smilbot-640.webp'

const SRC_SET = `${smilbot128} 128w, ${smilbot320} 320w, ${smilbot640} 640w`

interface MascotProps {
  /** Tamaño en pantalla con utilidades de Tailwind (p. ej. `size-8`, `size-48 md:size-70`). */
  className?: string
  /** Ancho mostrado, para que el navegador elija el fichero (atributo `sizes`). */
  sizes: string
  /** Halo naranja suave detrás del círculo. Solo en tamaños medianos y grandes. */
  halo?: boolean
  /** Decorativa por defecto: el texto de alrededor ya dice qué pasa. */
  alt?: string
}

/** Smilbot, el gato naranja: siempre en círculo, centrado en la cara. Ver DESIGN.md, "La mascota". */
export function Mascot({ className, sizes, halo = false, alt = '' }: MascotProps) {
  return (
    <span className={cn('relative inline-flex shrink-0', className)}>
      {halo && (
        <span
          aria-hidden
          className="absolute -inset-[35%] rounded-full bg-[radial-gradient(circle,rgb(255_173_98/0.22)_0%,rgb(255_173_98/0.08)_40%,transparent_70%)]"
        />
      )}
      <img
        src={smilbot320}
        srcSet={SRC_SET}
        sizes={sizes}
        alt={alt}
        draggable={false}
        className="relative size-full rounded-full object-cover ring-1 ring-foreground/15"
      />
    </span>
  )
}

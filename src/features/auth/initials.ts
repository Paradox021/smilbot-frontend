/** Iniciales a mostrar si no hay avatar o la imagen no carga. */
export function getInitials(username: string): string {
  const words = username
    .trim()
    .split(/[\s._-]+/)
    .filter(Boolean)
  const [first = '', second = ''] = words
  const initials = second ? `${first.charAt(0)}${second.charAt(0)}` : first.slice(0, 2)
  return initials.toUpperCase() || '?'
}

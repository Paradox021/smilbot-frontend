import { House, Sparkles, type LucideIcon } from 'lucide-react'
import { ROUTES } from '@/shared/config/routes'
import { appTexts } from '../texts'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

/** Destinos de la navegación principal. Cada fase del plan añade el suyo (ver `Frontend/Plan Frontend.md`). */
export const NAV_ITEMS: readonly NavItem[] = [
  { to: ROUTES.dashboard, label: appTexts.navHome, icon: House },
  { to: ROUTES.pull, label: appTexts.navPull, icon: Sparkles },
]

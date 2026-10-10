import { NavLink } from 'react-router'
import { appTexts } from '../texts'
import { NAV_ITEMS } from './navItems'

/** Navegación en la zona del pulgar, solo en móvil. En escritorio la nav va en la cabecera. */
export function BottomNav() {
  return (
    <nav
      aria-label={appTexts.sectionsNavigation}
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-card pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <ul
        className="mx-auto grid h-16 max-w-md"
        style={{ gridTemplateColumns: `repeat(${NAV_ITEMS.length}, minmax(0, 1fr))` }}
      >
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex">
            <NavLink
              to={to}
              className="flex flex-1 flex-col items-center justify-center gap-1 text-xs text-muted-foreground transition-colors focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-inset aria-[current=page]:font-medium aria-[current=page]:text-foreground [&[aria-current=page]_svg]:text-primary"
            >
              <Icon aria-hidden className="size-5" />
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}

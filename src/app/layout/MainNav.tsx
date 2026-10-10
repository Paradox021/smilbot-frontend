import { NavLink } from 'react-router'
import { NAV_ITEMS } from './navItems'

export function MainNav() {
  return (
    <ul className="hidden items-center gap-1 md:flex">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <li key={to}>
          <NavLink
            to={to}
            className="flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm text-body transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring focus-visible:outline-none aria-[current=page]:bg-secondary aria-[current=page]:text-foreground"
          >
            <Icon aria-hidden className="size-4" />
            {label}
          </NavLink>
        </li>
      ))}
    </ul>
  )
}

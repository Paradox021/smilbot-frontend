import type { RouteObject } from 'react-router'
import { LoginPage, RequireAuth } from '@/features/auth'
import { ProfilePage } from '@/features/profile'
import { ROUTES } from '@/shared/config/routes'
import { RootLayout } from './layout/RootLayout'
import { NotFoundPage, RouteErrorPage } from './pages/MessagePage'

export const routes: RouteObject[] = [
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: ROUTES.home, element: <LoginPage /> },
      {
        element: <RequireAuth />,
        children: [{ path: ROUTES.profile, element: <ProfilePage /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

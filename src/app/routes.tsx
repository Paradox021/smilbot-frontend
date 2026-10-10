import type { RouteObject } from 'react-router'
import { LoginPage, RequireAuth } from '@/features/auth'
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
        children: [
          {
            path: ROUTES.profile,
            lazy: async () => {
              const { ProfilePage } = await import('@/features/profile')
              return { Component: ProfilePage }
            },
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]

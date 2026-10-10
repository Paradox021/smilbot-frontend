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
            path: ROUTES.dashboard,
            lazy: async () => {
              const { HomePage } = await import('@/features/home')
              return { Component: HomePage }
            },
          },
          {
            path: ROUTES.pull,
            lazy: async () => {
              const { PullPage } = await import('@/features/pull')
              return { Component: PullPage }
            },
          },
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

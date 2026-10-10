import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'
import { authKeys } from '../queries'
import type { LoginResult } from '../types'

export const LOGIN_PARAM = 'login'

function parseLoginResult(value: string | null): LoginResult | null {
  return value === 'success' || value === 'error' ? value : null
}

/** Lee `?login=success|error` que pone el backend tras el OAuth y lo quita de la URL. */
export function useLoginResult() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryClient = useQueryClient()
  const paramResult = parseLoginResult(searchParams.get(LOGIN_PARAM))
  const [result, setResult] = useState<LoginResult | null>(paramResult)

  if (paramResult && paramResult !== result) setResult(paramResult)

  useEffect(() => {
    if (!paramResult) return
    if (paramResult === 'success') {
      void queryClient.invalidateQueries({ queryKey: authKeys.me() })
    }
    setSearchParams(
      (params) => {
        params.delete(LOGIN_PARAM)
        return params
      },
      { replace: true },
    )
  }, [paramResult, queryClient, setSearchParams])

  return { result, dismiss: () => setResult(null) }
}

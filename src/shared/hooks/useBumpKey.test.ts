import { renderHook } from '@testing-library/react'
import { useBumpKey } from './useBumpKey'

describe('useBumpKey', () => {
  it('solo sube cuando el valor aumenta', () => {
    const { result, rerender } = renderHook(({ value }) => useBumpKey(value), {
      initialProps: { value: 11 },
    })
    expect(result.current).toBe(0)
    rerender({ value: 12 })
    expect(result.current).toBe(1)
    rerender({ value: 1 })
    expect(result.current).toBe(1)
    rerender({ value: 2 })
    expect(result.current).toBe(2)
  })
})

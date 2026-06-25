/** @vitest-environment jsdom */

import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { RefreshButton } from './RefreshButton'

const invalidate = vi.fn()

vi.mock('@tanstack/react-router', () => ({
  useRouter: () => ({ invalidate }),
  useRouterState: ({
    select,
  }: {
    select: (state: {
      isLoading: boolean
      status: string
      matches: Array<{ isFetching: false | 'beforeLoad' | 'loader' }>
    }) => boolean
  }) => select({ isLoading: false, status: 'idle', matches: [] }),
}))

describe('RefreshButton', () => {
  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('calls router.invalidate when clicked', () => {
    render(<RefreshButton />)

    fireEvent.click(screen.getByRole('button', { name: 'Atualizar dados' }))

    expect(invalidate).toHaveBeenCalledWith({ forcePending: true })
    expect(invalidate).toHaveBeenCalledTimes(1)
  })
})

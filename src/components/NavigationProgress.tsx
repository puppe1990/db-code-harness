'use client'

import { useRouterState } from '@tanstack/react-router'

export function NavigationProgress() {
  const isPending = useRouterState({
    select: (state) => state.status === 'pending',
  })

  if (!isPending) return null

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 h-0.5 overflow-hidden"
      aria-hidden
    >
      <div className="navigation-progress-bar h-full bg-[var(--lagoon)]" />
    </div>
  )
}

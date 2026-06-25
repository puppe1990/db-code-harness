'use client'

import { useEffect, useRef } from 'react'
import { useRouterState } from '@tanstack/react-router'

function isBootstrapping(state: {
  isLoading: boolean
  matches: Array<{
    routeId: string
    status: string
    isFetching: false | 'beforeLoad' | 'loader'
  }>
}) {
  return (
    state.isLoading ||
    state.matches.some(
      (match) =>
        match.routeId !== '__root__' &&
        (match.status === 'pending' || match.isFetching === 'loader'),
    )
  )
}

export function AppReadyGate() {
  const dismissedRef = useRef(false)
  const bootstrapping = useRouterState({
    select: isBootstrapping,
  })

  useEffect(() => {
    if (dismissedRef.current || bootstrapping) return

    const loader = document.getElementById('app-startup-loader')
    if (!loader) {
      dismissedRef.current = true
      return
    }

    dismissedRef.current = true
    loader.classList.add('startup-loader--hide')
    document.documentElement.setAttribute('data-app-ready', 'true')

    const timeout = window.setTimeout(() => {
      loader.remove()
    }, 320)

    return () => window.clearTimeout(timeout)
  }, [bootstrapping])

  return null
}

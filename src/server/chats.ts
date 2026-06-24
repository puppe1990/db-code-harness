import { createServerFn } from '@tanstack/react-start'
import { getDataPaths } from '../lib/config'
import { aggregateChats } from '../lib/aggregator'

export const getChats = createServerFn({ method: 'GET' }).handler(async () => {
  const paths = getDataPaths()
  return aggregateChats(paths)
})

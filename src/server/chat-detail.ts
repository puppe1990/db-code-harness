import { createServerFn } from '@tanstack/react-start'
import { getDataPaths } from '../lib/config'
import { aggregateChats } from '../lib/aggregator'
import { fetchChatDetail } from '../lib/messages'

export const getChatDetail = createServerFn({ method: 'GET' })
  .validator((chatId: string) => chatId)
  .handler(async ({ data: chatId }) => {
    const paths = getDataPaths()
    const chats = await aggregateChats(paths)
    const session = chats.find((c) => c.id === chatId)
    if (!session) return null
    return fetchChatDetail(chatId, session, paths)
  })
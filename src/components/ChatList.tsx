'use client'
import { useMemo, useState } from 'react'
import type { ChatSession, ChatSource } from '../lib/types'
import { SOURCE_LABELS } from '../lib/types'
import { filterChats } from '../lib/filter-chats'
import { paginate } from '../lib/paginate'
import { ChatItem } from './ChatItem'
import { Pagination } from './Pagination'

const ALL_SOURCES: ChatSource[] = ['cursor', 'grok', 'codex', 'opencode', 'claude']
const PAGE_SIZE = 30

const CHIP_ACTIVE = 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900'
const CHIP_INACTIVE =
  'bg-white text-zinc-600 border border-zinc-200 hover:text-zinc-900 hover:border-zinc-300 dark:bg-zinc-800 dark:text-zinc-400 dark:border-transparent dark:hover:text-zinc-200'

export function ChatList({ chats }: { chats: ChatSession[] }) {
  const [filter, setFilter] = useState<ChatSource | 'all'>('all')
  const [query, setQuery] = useState('')
  const [page, setPage] = useState(1)

  const filtered = useMemo(
    () => filterChats(chats, { source: filter, query }),
    [chats, filter, query],
  )

  const pagination = useMemo(
    () => paginate(filtered, { page, pageSize: PAGE_SIZE }),
    [filtered, page],
  )

  const counts = useMemo(() => {
    const map = Object.fromEntries(ALL_SOURCES.map((s) => [s, 0])) as Record<
      ChatSource,
      number
    >
    for (const c of chats) map[c.source]++
    return map
  }, [chats])

  const hasActiveSearch = query.trim().length > 0

  return (
    <div>
      <div className="relative mb-4">
        <input
          type="search"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setPage(1)
          }}
          placeholder="Buscar por título, pasta, ferramenta ou modelo..."
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2.5 text-sm text-zinc-900 placeholder:text-zinc-400 shadow-sm focus:border-zinc-400 focus:outline-none focus:ring-1 focus:ring-zinc-300 dark:border-zinc-800 dark:bg-zinc-900/80 dark:text-zinc-100 dark:placeholder:text-zinc-600 dark:focus:border-zinc-600 dark:focus:ring-zinc-600"
        />
        {hasActiveSearch && (
          <button
            type="button"
            onClick={() => {
              setQuery('')
              setPage(1)
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          >
            Limpar
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => {
            setFilter('all')
            setPage(1)
          }}
          className={`rounded-full px-3 py-1 text-sm ${filter === 'all' ? CHIP_ACTIVE : CHIP_INACTIVE}`}
        >
          All ({chats.length})
        </button>
        {ALL_SOURCES.map((source) => (
          <button
            key={source}
            onClick={() => {
              setFilter(source)
              setPage(1)
            }}
            className={`rounded-full px-3 py-1 text-sm ${filter === source ? CHIP_ACTIVE : CHIP_INACTIVE}`}
          >
            {SOURCE_LABELS[source]} ({counts[source]})
          </button>
        ))}
      </div>

      {hasActiveSearch && (
        <p className="text-xs text-zinc-500 mb-4">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para &ldquo;
          {query.trim()}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="text-zinc-500 text-center py-12">
          {hasActiveSearch ? 'Nenhum chat corresponde à busca.' : 'No chats found'}
        </p>
      ) : (
        <>
          <ul className="space-y-2">
            {pagination.items.map((chat) => (
              <ChatItem key={chat.id} chat={chat} />
            ))}
          </ul>
          <Pagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            totalItems={pagination.totalItems}
            startIndex={pagination.startIndex}
            endIndex={pagination.endIndex}
            hasPreviousPage={pagination.hasPreviousPage}
            hasNextPage={pagination.hasNextPage}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  )
}

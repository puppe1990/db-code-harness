'use client'
import { useState, useMemo } from 'react'
import type { ChatSession, ChatSource } from '../lib/types'
import { SOURCE_LABELS } from '../lib/types'
import { filterChats } from '../lib/filter-chats'
import { ChatItem } from './ChatItem'

const ALL_SOURCES: ChatSource[] = ['cursor', 'grok', 'codex', 'opencode']

export function ChatList({ chats }: { chats: ChatSession[] }) {
  const [filter, setFilter] = useState<ChatSource | 'all'>('all')
  const [query, setQuery] = useState('')

  const filtered = useMemo(
    () => filterChats(chats, { source: filter, query }),
    [chats, filter, query],
  )

  const counts = useMemo(() => {
    const map = Object.fromEntries(ALL_SOURCES.map((s) => [s, 0])) as Record<ChatSource, number>
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
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por título, pasta, ferramenta ou modelo..."
          className="w-full rounded-lg border border-zinc-800 bg-zinc-900/80 px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
        />
        {hasActiveSearch && (
          <button
            type="button"
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500 hover:text-zinc-300"
          >
            Limpar
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setFilter('all')}
          className={`rounded-full px-3 py-1 text-sm ${filter === 'all' ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
        >
          All ({chats.length})
        </button>
        {ALL_SOURCES.map((source) => (
          <button
            key={source}
            onClick={() => setFilter(source)}
            className={`rounded-full px-3 py-1 text-sm ${filter === source ? 'bg-zinc-100 text-zinc-900' : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'}`}
          >
            {SOURCE_LABELS[source]} ({counts[source]})
          </button>
        ))}
      </div>

      {hasActiveSearch && (
        <p className="text-xs text-zinc-500 mb-4">
          {filtered.length} resultado{filtered.length !== 1 ? 's' : ''} para &ldquo;{query.trim()}&rdquo;
        </p>
      )}

      {filtered.length === 0 ? (
        <p className="text-zinc-500 text-center py-12">
          {hasActiveSearch
            ? 'Nenhum chat corresponde à busca.'
            : 'No chats found'}
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((chat) => (
            <ChatItem key={chat.id} chat={chat} />
          ))}
        </ul>
      )}
    </div>
  )
}
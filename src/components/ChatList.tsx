'use client'
import { useState, useMemo } from 'react'
import type { ChatSession, ChatSource } from '../lib/types'
import { SOURCE_LABELS } from '../lib/types'
import { ChatItem } from './ChatItem'

const ALL_SOURCES: ChatSource[] = ['cursor', 'grok', 'codex', 'opencode']

export function ChatList({ chats }: { chats: ChatSession[] }) {
  const [filter, setFilter] = useState<ChatSource | 'all'>('all')

  const filtered = useMemo(
    () => (filter === 'all' ? chats : chats.filter((c) => c.source === filter)),
    [chats, filter],
  )

  const counts = useMemo(() => {
    const map = Object.fromEntries(ALL_SOURCES.map((s) => [s, 0])) as Record<ChatSource, number>
    for (const c of chats) map[c.source]++
    return map
  }, [chats])

  return (
    <div>
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

      {filtered.length === 0 ? (
        <p className="text-zinc-500 text-center py-12">No chats found</p>
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
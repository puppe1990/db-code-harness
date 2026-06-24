import { Link } from '@tanstack/react-router'
import type { ChatSession } from '../lib/types'
import { SourceBadge } from './SourceBadge'

function formatRelative(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

export function ChatItem({ chat }: { chat: ChatSession }) {
  return (
    <li>
      <Link
        to="/chat/$chatId"
        params={{ chatId: chat.id }}
        className="group flex items-start gap-4 rounded-lg border border-zinc-200 bg-white/80 px-4 py-3 shadow-sm transition hover:border-zinc-300 hover:bg-white no-underline dark:border-zinc-800 dark:bg-zinc-900/50 dark:shadow-none dark:hover:border-zinc-700 dark:hover:bg-zinc-900"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <SourceBadge source={chat.source} />
            <span className="text-xs text-zinc-500">
              {formatRelative(chat.updatedAt)}
            </span>
          </div>
          <p className="font-medium text-zinc-900 truncate dark:text-zinc-100">
            {chat.title}
          </p>
          {chat.cwd && (
            <p className="text-xs text-zinc-500 truncate mt-0.5">{chat.cwd}</p>
          )}
        </div>
        {chat.messageCount != null && (
          <span className="text-xs text-zinc-400 tabular-nums dark:text-zinc-600">
            {chat.messageCount} msgs
          </span>
        )}
      </Link>
    </li>
  )
}

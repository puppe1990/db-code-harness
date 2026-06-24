import type { ChatMessage } from '../lib/types'
import { FormattedDate } from './FormattedDate'

const ROLE_STYLES: Record<ChatMessage['role'], string> = {
  user: 'bg-zinc-100 border-zinc-200 ml-8 dark:bg-zinc-800 dark:border-zinc-700',
  assistant: 'bg-white border-zinc-200 mr-8 dark:bg-zinc-900/80 dark:border-zinc-800',
  system:
    'bg-zinc-50 border-zinc-200 text-zinc-500 text-sm dark:bg-zinc-900/40 dark:border-zinc-800/50',
  tool: 'bg-zinc-50 border-zinc-200 text-zinc-500 text-xs font-mono dark:bg-zinc-900/40 dark:border-zinc-800/50',
}

const ROLE_LABELS: Record<ChatMessage['role'], string> = {
  user: 'Você',
  assistant: 'Assistente',
  system: 'Sistema',
  tool: 'Ferramenta',
}

export function MessageList({ messages }: { messages: ChatMessage[] }) {
  if (messages.length === 0) {
    return (
      <p className="text-zinc-500 text-center py-12">
        Nenhuma mensagem encontrada para este chat.
      </p>
    )
  }

  return (
    <ul className="space-y-4">
      {messages.map((msg) => (
        <li
          key={msg.id}
          className={`rounded-lg border px-4 py-3 shadow-sm dark:shadow-none ${ROLE_STYLES[msg.role]}`}
        >
          <p className="text-xs font-medium text-zinc-500 mb-1.5">
            {ROLE_LABELS[msg.role]}
            {msg.timestamp && (
              <FormattedDate iso={msg.timestamp} className="ml-2 font-normal" />
            )}
          </p>
          <p className="text-sm text-zinc-800 whitespace-pre-wrap break-words dark:text-zinc-200">
            {msg.content}
          </p>
        </li>
      ))}
    </ul>
  )
}

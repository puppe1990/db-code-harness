import type { ChatMessage } from '../lib/types'

const ROLE_STYLES: Record<ChatMessage['role'], string> = {
  user: 'bg-zinc-800 border-zinc-700 ml-8',
  assistant: 'bg-zinc-900/80 border-zinc-800 mr-8',
  system: 'bg-zinc-900/40 border-zinc-800/50 text-zinc-500 text-sm',
  tool: 'bg-zinc-900/40 border-zinc-800/50 text-zinc-500 text-xs font-mono',
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
          className={`rounded-lg border px-4 py-3 ${ROLE_STYLES[msg.role]}`}
        >
          <p className="text-xs font-medium text-zinc-500 mb-1.5">
            {ROLE_LABELS[msg.role]}
            {msg.timestamp && (
              <span className="ml-2 font-normal">
                {new Date(msg.timestamp).toLocaleString('pt-BR')}
              </span>
            )}
          </p>
          <p className="text-sm text-zinc-200 whitespace-pre-wrap break-words">
            {msg.content}
          </p>
        </li>
      ))}
    </ul>
  )
}
import { Link, createFileRoute } from '@tanstack/react-router'
import { fromChatRouteParams } from '../lib/chat-id'
import { getChatDetail } from '../server/chat-detail'
import { MessageList } from '../components/MessageList'
import { SourceBadge } from '../components/SourceBadge'

export const Route = createFileRoute('/chat/$source/$sessionId')({
  loader: ({ params }) =>
    getChatDetail({
      data: fromChatRouteParams(params.source, params.sessionId),
    }),
  component: ChatDetailPage,
})

function ChatDetailPage() {
  const detail = Route.useLoaderData()

  if (!detail) {
    return (
      <main className="min-h-screen text-[var(--sea-ink)]">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <p className="text-[var(--sea-ink-soft)]">Chat não encontrado.</p>
          <Link
            to="/"
            className="text-sm text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] mt-4 inline-block"
          >
            ← Voltar
          </Link>
        </div>
      </main>
    )
  }

  const { session, messages } = detail

  return (
    <main className="min-h-screen text-[var(--sea-ink)]">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          to="/"
          className="text-sm text-[var(--sea-ink-soft)] hover:text-[var(--sea-ink)] mb-6 inline-block"
        >
          ← Todos os chats
        </Link>

        <header className="mb-8 border-b border-[var(--line)] pb-6">
          <div className="flex items-center gap-2 mb-2">
            <SourceBadge source={session.source} />
            <span className="text-xs text-[var(--sea-ink-soft)]">
              {new Date(session.updatedAt).toLocaleString('pt-BR')}
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{session.title}</h1>
          {session.cwd && (
            <p className="text-sm text-[var(--sea-ink-soft)] mt-1 truncate">
              {session.cwd}
            </p>
          )}
          <p className="text-xs text-[var(--sea-ink-soft)] mt-2 opacity-80">
            {messages.length} mensagens
          </p>
        </header>

        <MessageList messages={messages} />
      </div>
    </main>
  )
}

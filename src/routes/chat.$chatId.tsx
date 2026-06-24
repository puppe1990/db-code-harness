import { Link, createFileRoute } from '@tanstack/react-router'
import { getChatDetail } from '../server/chat-detail'
import { MessageList } from '../components/MessageList'
import { SourceBadge } from '../components/SourceBadge'

export const Route = createFileRoute('/chat/$chatId')({
  loader: ({ params }) => getChatDetail({ data: params.chatId }),
  component: ChatDetailPage,
})

function ChatDetailPage() {
  const detail = Route.useLoaderData()

  if (!detail) {
    return (
      <main className="min-h-screen bg-zinc-950 text-zinc-100">
        <div className="mx-auto max-w-3xl px-6 py-10">
          <p className="text-zinc-500">Chat não encontrado.</p>
          <Link to="/" className="text-sm text-zinc-400 hover:text-zinc-200 mt-4 inline-block">
            ← Voltar
          </Link>
        </div>
      </main>
    )
  }

  const { session, messages } = detail

  return (
    <main className="min-h-screen bg-zinc-950 text-zinc-100">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <Link
          to="/"
          className="text-sm text-zinc-500 hover:text-zinc-300 mb-6 inline-block"
        >
          ← Todos os chats
        </Link>

        <header className="mb-8 border-b border-zinc-800 pb-6">
          <div className="flex items-center gap-2 mb-2">
            <SourceBadge source={session.source} />
            <span className="text-xs text-zinc-500">
              {new Date(session.updatedAt).toLocaleString('pt-BR')}
            </span>
          </div>
          <h1 className="text-xl font-semibold tracking-tight">{session.title}</h1>
          {session.cwd && (
            <p className="text-sm text-zinc-500 mt-1 truncate">{session.cwd}</p>
          )}
          <p className="text-xs text-zinc-600 mt-2">{messages.length} mensagens</p>
        </header>

        <MessageList messages={messages} />
      </div>
    </main>
  )
}
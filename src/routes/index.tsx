import { createFileRoute } from '@tanstack/react-router'
import { getChats } from '../server/chats'
import { ChatList } from '../components/ChatList'

export const Route = createFileRoute('/')({
  loader: () => getChats(),
  component: Home,
})

function Home() {
  const chats = Route.useLoaderData()
  return (
    <main className="min-h-screen text-[var(--sea-ink)]">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <header className="mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">AI Chats</h1>
          <p className="text-sm text-[var(--sea-ink-soft)] mt-1">
            Cursor, Grok, Codex & OpenCode — sorted by most recent
          </p>
        </header>
        <ChatList chats={chats} />
      </div>
    </main>
  )
}

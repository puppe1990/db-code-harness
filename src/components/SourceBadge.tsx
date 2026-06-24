import type { ChatSource } from '../lib/types'
import { SOURCE_LABELS } from '../lib/types'

const COLORS: Record<ChatSource, string> = {
  cursor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  grok: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  codex: 'bg-green-500/20 text-green-300 border-green-500/30',
  opencode: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
}

export function SourceBadge({ source }: { source: ChatSource }) {
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${COLORS[source]}`}
    >
      {SOURCE_LABELS[source]}
    </span>
  )
}
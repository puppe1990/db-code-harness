export type ChatSource = 'cursor' | 'grok' | 'codex' | 'opencode'

export interface ChatSession {
  id: string
  source: ChatSource
  title: string
  cwd?: string
  createdAt: string
  updatedAt: string
  messageCount?: number
  model?: string
}

export const SOURCE_LABELS: Record<ChatSource, string> = {
  cursor: 'Cursor',
  grok: 'Grok',
  codex: 'Codex',
  opencode: 'OpenCode',
}
import path from 'node:path'
import type { DataPaths } from './config'
import { sortByUpdatedAt } from './sort'
import type { ChatSession } from './types'
import { fetchCodexChats } from './providers/codex'
import { fetchCursorChats } from './providers/cursor'
import { fetchGrokChats } from './providers/grok'
import { fetchOpenCodeChats } from './providers/opencode'

export async function aggregateChats(paths: DataPaths): Promise<ChatSession[]> {
  const [grok, codex, cursor] = await Promise.all([
    fetchGrokChats(path.join(paths.grokHome, 'sessions')),
    fetchCodexChats(paths.codexHome),
    fetchCursorChats(path.join(paths.cursorHome, 'chats')),
  ])

  const opencode = fetchOpenCodeChats(path.join(paths.opencodeDataDir, 'opencode.db'))

  return sortByUpdatedAt([...grok, ...codex, ...cursor, ...opencode])
}
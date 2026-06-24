import fs from 'node:fs/promises'
import path from 'node:path'
import type { ChatSession } from '../types'

interface CodexIndexEntry {
  id: string
  thread_name?: string
  updated_at?: string
}

export async function fetchCodexChats(codexHome: string): Promise<ChatSession[]> {
  const indexPath = path.join(codexHome, 'session_index.jsonl')
  try {
    const content = await fs.readFile(indexPath, 'utf-8')
    const sessions: ChatSession[] = []

    for (const line of content.split('\n')) {
      if (!line.trim()) continue
      try {
        const entry: CodexIndexEntry = JSON.parse(line)
        sessions.push({
          id: `codex:${entry.id}`,
          source: 'codex',
          title: entry.thread_name?.trim() || `Codex ${entry.id.slice(0, 8)}`,
          createdAt: entry.updated_at ?? new Date(0).toISOString(),
          updatedAt: entry.updated_at ?? new Date(0).toISOString(),
        })
      } catch {
        // skip malformed line
      }
    }

    return sessions
  } catch {
    return []
  }
}
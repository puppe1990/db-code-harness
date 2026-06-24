import Database from 'better-sqlite3'
import type { ChatMessage } from '../types'
import { extractTextFromParts } from './extract-text'

function openDatabase(dbPath: string): Database.Database {
  try {
    return new Database(dbPath, { readonly: true, fileMustExist: true })
  } catch (firstErr) {
    const deadline = Date.now() + 100
    while (Date.now() < deadline) {
      /* brief wait */
    }
    try {
      return new Database(dbPath, { readonly: true, fileMustExist: true })
    } catch {
      throw firstErr
    }
  }
}

export function fetchOpenCodeMessages(
  dbPath: string,
  sessionId: string,
): ChatMessage[] {
  try {
    const db = openDatabase(dbPath)
    const rows = db
      .prepare(
        `SELECT m.id, m.data, GROUP_CONCAT(p.data, '|||') as parts
         FROM message m
         LEFT JOIN part p ON p.message_id = m.id
         WHERE m.session_id = ?
         GROUP BY m.id
         ORDER BY m.time_created ASC`,
      )
      .all(sessionId) as Array<{ id: string; data: string; parts: string | null }>
    db.close()

    const messages: ChatMessage[] = []

    for (const row of rows) {
      try {
        const meta = JSON.parse(row.data)
        const role = meta.role
        if (role !== 'user' && role !== 'assistant') continue

        const partChunks = (row.parts ?? '')
          .split('|||')
          .map((chunk) => {
            try {
              return JSON.parse(chunk)
            } catch {
              return null
            }
          })
          .filter(Boolean)

        const text = extractTextFromParts(partChunks)
        if (!text) continue

        messages.push({
          id: `opencode-msg-${row.id}`,
          role,
          content: text,
          timestamp: meta.time?.created
            ? new Date(meta.time.created).toISOString()
            : undefined,
        })
      } catch {
        // skip malformed row
      }
    }

    return messages
  } catch {
    return []
  }
}

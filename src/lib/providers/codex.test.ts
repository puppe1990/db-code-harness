import { describe, it, expect } from 'vitest'
import path from 'node:path'
import { fetchCodexChats } from './codex'

const FIXTURE_DIR = path.join(__dirname, '__fixtures__/codex')

describe('fetchCodexChats', () => {
  it('parses session_index.jsonl', async () => {
    const sessions = await fetchCodexChats(FIXTURE_DIR)
    expect(sessions).toHaveLength(2)
    expect(sessions[0]).toMatchObject({
      id: 'codex:019e45c9-4c4c-7783-a976-c0eec1cc306b',
      source: 'codex',
      title: 'Limpar HD com script',
      updatedAt: '2026-05-20T14:28:22.699524Z',
    })
  })

  it('returns empty array for missing index', async () => {
    expect(await fetchCodexChats('/nonexistent')).toEqual([])
  })
})
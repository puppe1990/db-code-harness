import { describe, it, expect, vi } from 'vitest'
import { aggregateChats } from './aggregator'
import type { ChatSession } from './types'

vi.mock('./providers/grok', () => ({
  fetchGrokChats: vi.fn().mockResolvedValue([
    {
      id: 'grok:1',
      source: 'grok',
      title: 'Grok chat',
      createdAt: '2026-06-24T10:00:00Z',
      updatedAt: '2026-06-24T12:00:00Z',
    },
  ] satisfies ChatSession[]),
}))
vi.mock('./providers/codex', () => ({
  fetchCodexChats: vi.fn().mockResolvedValue([
    {
      id: 'codex:1',
      source: 'codex',
      title: 'Codex chat',
      createdAt: '2026-06-24T08:00:00Z',
      updatedAt: '2026-06-24T14:00:00Z',
    },
  ] satisfies ChatSession[]),
}))
vi.mock('./providers/opencode', () => ({
  fetchOpenCodeChats: vi.fn().mockReturnValue([]),
}))
vi.mock('./providers/cursor', () => ({
  fetchCursorChats: vi.fn().mockResolvedValue([
    {
      id: 'cursor:1',
      source: 'cursor',
      title: 'Cursor chat',
      createdAt: '2026-06-24T06:00:00Z',
      updatedAt: '2026-06-24T11:00:00Z',
    },
  ] satisfies ChatSession[]),
}))

describe('aggregateChats', () => {
  it('merges all providers and sorts by updatedAt desc', async () => {
    const result = await aggregateChats({
      cursorHome: '/c',
      grokHome: '/g',
      codexHome: '/x',
      opencodeDataDir: '/o',
    })
    expect(result).toHaveLength(3)
    expect(result.map((s) => s.source)).toEqual(['codex', 'grok', 'cursor'])
  })
})

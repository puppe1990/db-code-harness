import { describe, it, expect } from 'vitest'
import { fromChatRouteParams, toChatRouteParams } from './chat-id'

describe('chat-id route helpers', () => {
  it('splits composite chat id into route params', () => {
    expect(toChatRouteParams('opencode:ses_10f6ac97bffeW0GdEvduSLGMSP')).toEqual({
      source: 'opencode',
      sessionId: 'ses_10f6ac97bffeW0GdEvduSLGMSP',
    })
  })

  it('rebuilds chat id from route params', () => {
    expect(fromChatRouteParams('opencode', 'ses_10f6ac97bffeW0GdEvduSLGMSP')).toBe(
      'opencode:ses_10f6ac97bffeW0GdEvduSLGMSP',
    )
  })
})

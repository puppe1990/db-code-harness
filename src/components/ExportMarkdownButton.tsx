'use client'

import { useState } from 'react'
import type { ChatDetail } from '../lib/types'
import { chatToMarkdown, markdownFilename } from '../lib/export-markdown'

export function ExportMarkdownButton({ detail }: { detail: ChatDetail }) {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle')

  const markdown = chatToMarkdown(detail)
  const filename = markdownFilename(detail.session)

  function download() {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const anchor = document.createElement('a')
    anchor.href = url
    anchor.download = filename
    anchor.click()
    URL.revokeObjectURL(url)
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(markdown)
      setStatus('copied')
      window.setTimeout(() => setStatus('idle'), 2000)
    } catch {
      setStatus('error')
      window.setTimeout(() => setStatus('idle'), 2000)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={download}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-800 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
      >
        Exportar .md
      </button>
      <button
        type="button"
        onClick={copy}
        className="rounded-lg border border-zinc-200 bg-white px-3 py-1.5 text-sm font-medium text-zinc-600 shadow-sm transition hover:border-zinc-300 hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:border-zinc-600 dark:hover:bg-zinc-800"
      >
        {status === 'copied'
          ? 'Copiado!'
          : status === 'error'
            ? 'Erro ao copiar'
            : 'Copiar MD'}
      </button>
    </div>
  )
}

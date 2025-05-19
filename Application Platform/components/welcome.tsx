// components/WelcomeContent.tsx
'use client'

import { useEffect, useState } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

export function WelcomeContent() {
  const [markdown, setMarkdown] = useState<string>('')

  useEffect(() => {
    fetch('/docs/consent.md')
      .then(res => res.text())
      .then(setMarkdown)
  }, [])

  return (
    <article className="prose min-w-full">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </ReactMarkdown>
    </article>
  )
}
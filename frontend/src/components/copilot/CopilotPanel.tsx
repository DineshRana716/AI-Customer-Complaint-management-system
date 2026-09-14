import { useEffect, useRef, useState } from 'react'
import {
  INITIAL_COPILOT_MESSAGES,
  MOCK_ASSISTANT_REPLIES,
} from '../../data/mockCopilotMessages'
import type { CopilotMessage } from '../../types/copilot'
import { CopilotInput } from './CopilotInput'
import { CopilotMessageList } from './CopilotMessageList'

function createId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
}

export function CopilotPanel() {
  const [messages, setMessages] = useState<CopilotMessage[]>(INITIAL_COPILOT_MESSAGES)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const replyIndex = useRef(0)
  const typingTimeout = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (typingTimeout.current !== null) {
        window.clearTimeout(typingTimeout.current)
      }
    }
  }, [])

  function handleSend() {
    const trimmed = input.trim()
    if (!trimmed || isTyping) return

    const userMessage: CopilotMessage = {
      id: createId(),
      role: 'user',
      content: trimmed,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsTyping(true)

    typingTimeout.current = window.setTimeout(() => {
      const reply =
        MOCK_ASSISTANT_REPLIES[replyIndex.current % MOCK_ASSISTANT_REPLIES.length]
      replyIndex.current += 1

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: 'assistant',
          content: reply,
        },
      ])
      setIsTyping(false)
    }, 900)
  }

  return (
    <aside className="copilot-panel">
      <header className="copilot-panel__header">
        <div className="copilot-panel__brand">
          <span className="copilot-panel__logo" aria-hidden="true">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none">
              <path
                d="M9 3v3M15 3v3M8 9h8l1 3v6a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2v-6l1-3Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M12 12v5M10.5 14.5 12 12l1.5 2.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <div>
            <h2 className="copilot-panel__title">AIVOA Copilot</h2>
            <p className="copilot-panel__hint">
              Drop complaint files or paste text below.
            </p>
          </div>
        </div>
        <span className="copilot-panel__badge" aria-hidden="true" />
      </header>

      <CopilotMessageList messages={messages} isTyping={isTyping} />

      <div className="copilot-panel__footer">
        <CopilotInput
          value={input}
          onChange={setInput}
          onSend={handleSend}
          disabled={isTyping}
        />
        <p className="copilot-panel__powered">POWERED BY LANGGRAPH</p>
      </div>
    </aside>
  )
}

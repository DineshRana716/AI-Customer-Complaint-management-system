import type { CopilotMessage } from '../../types/copilot'

type CopilotMessageListProps = {
  messages: CopilotMessage[]
  isTyping: boolean
}

function AssistantIcon() {
  return (
    <span className="copilot-avatar copilot-avatar--assistant" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
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
  )
}

function UserIcon() {
  return (
    <span className="copilot-avatar copilot-avatar--user" aria-hidden="true">
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none">
        <circle cx="12" cy="9" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path
          d="M5.5 19c1.6-3 4-4.5 6.5-4.5S17 16 18.5 19"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
      </svg>
    </span>
  )
}

export function CopilotMessageList({ messages, isTyping }: CopilotMessageListProps) {
  return (
    <div className="copilot-messages" role="log" aria-live="polite">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`copilot-row copilot-row--${message.role}`}
        >
          {message.role === 'assistant' && <AssistantIcon />}
          <div className={`copilot-bubble copilot-bubble--${message.role}`}>
            {message.content}
          </div>
          {message.role === 'user' && <UserIcon />}
        </div>
      ))}

      {isTyping && (
        <div className="copilot-row copilot-row--assistant">
          <AssistantIcon />
          <div className="copilot-bubble copilot-bubble--typing" aria-label="Assistant is typing">
            <span className="typing-dot" />
            <span className="typing-dot" />
            <span className="typing-dot" />
          </div>
        </div>
      )}
    </div>
  )
}

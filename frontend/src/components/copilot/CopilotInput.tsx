import type { FormEvent, KeyboardEvent } from 'react'

type CopilotInputProps = {
  value: string
  disabled?: boolean
  onChange: (value: string) => void
  onSend: () => void
}

export function CopilotInput({
  value,
  disabled = false,
  onChange,
  onSend,
}: CopilotInputProps) {
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSend()
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      onSend()
    }
  }

  return (
    <form className="copilot-input" onSubmit={handleSubmit}>
      <button
        type="button"
        className="copilot-input__attach"
        aria-label="Attach file (coming soon)"
        title="Attachment coming soon"
        disabled
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
          <path
            d="M15.5 7.5 9.2 13.8a2.5 2.5 0 1 0 3.5 3.5l7-7a4 4 0 0 0-5.7-5.7l-7.3 7.3a5.5 5.5 0 0 0 7.8 7.8l6-6"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <textarea
        className="copilot-input__field"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message or paste a complaint..."
        rows={1}
        disabled={disabled}
        aria-label="Copilot message"
      />

      <button
        type="submit"
        className="copilot-input__send"
        aria-label="Send message"
        disabled={disabled || !value.trim()}
      >
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
          <path
            d="m6 12 4.5 4.5L18 8"
            stroke="currentColor"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  )
}

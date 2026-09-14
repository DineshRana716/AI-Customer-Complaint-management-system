export type CopilotRole = 'assistant' | 'user'

export type CopilotMessage = {
  id: string
  role: CopilotRole
  content: string
}

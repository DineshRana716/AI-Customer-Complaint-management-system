import { useState } from "react";
import { INITIAL_COPILOT_MESSAGES } from "../../data/mockCopilotMessages";
import type { CopilotMessage } from "../../types/copilot";
import { CopilotInput } from "./CopilotInput";
import { CopilotMessageList } from "./CopilotMessageList";

function createId() {
  return `msg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

type StructuredComplaint = {
  customer_name: string | null;
  product_name: string | null;
  strength: string | null;
  batch_number: string | null;
  affected_quantity: string | null;
  manufacturing_date: string | null;
  expiry_date: string | null;
  originating_site: string | null;
  complaint_category: string | null;
  complaint_description: string | null;
};

export function CopilotPanel() {
  const [messages, setMessages] = useState<CopilotMessage[]>(
    INITIAL_COPILOT_MESSAGES,
  );
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  async function handleSend() {
    const trimmed = input.trim();

    if (!trimmed || isTyping) return;

    const userMessage: CopilotMessage = {
      id: createId(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/complaints/extract",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            complaint_text: trimmed,
          }),
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);

        throw new Error(
          errorData?.detail || `Request failed with status ${response.status}`,
        );
      }

      const result: StructuredComplaint = await response.json();

      const assistantMessage: CopilotMessage = {
        id: createId(),
        role: "assistant",
        content: JSON.stringify(result, null, 2),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Something went wrong while processing the complaint.";

      setMessages((prev) => [
        ...prev,
        {
          id: createId(),
          role: "assistant",
          content: `Error: ${errorMessage}`,
        },
      ]);
    } finally {
      setIsTyping(false);
    }
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
  );
}

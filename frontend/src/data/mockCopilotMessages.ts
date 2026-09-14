import type { CopilotMessage } from "../types/copilot";

export const INITIAL_COPILOT_MESSAGES: CopilotMessage[] = [
  {
    id: "msg-1",
    role: "assistant",
    content:
      "Ready to process new complaints. You can paste the raw email from the customer, or upload a PDF of the complaint report. I will extract the data and run the initial risk assessment.",
  },
];

export const MOCK_ASSISTANT_REPLIES = [
  "Thanks — I’ve noted that complaint. Fill in any remaining fields on the left, or paste more details and I’ll refine the draft.",
  "Got it. Once product and batch are confirmed, I can help draft the structured defect summary for triage.",
  "Received. Review the form fields and adjust anything that needs correction before triage.",
];

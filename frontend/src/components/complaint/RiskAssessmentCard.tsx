import type { ChangeEvent } from 'react'

type RiskAssessmentCardProps = {
  severitySuggested: string
  suggestedNextAction: string
  initialRiskAssessment: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
}

function ShieldIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
      <path
        d="M12 3 5.5 5.5v5.2c0 4.2 2.8 7.9 6.5 9.3 3.7-1.4 6.5-5.1 6.5-9.3V5.5L12 3Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path
        d="m9.2 12 2 2 3.8-4"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function RiskAssessmentCard({
  severitySuggested,
  suggestedNextAction,
  initialRiskAssessment,
  onChange,
}: RiskAssessmentCardProps) {
  return (
    <div className="risk-card">
      <div className="risk-card__header">
        <span className="risk-card__icon">
          <ShieldIcon />
        </span>
        <h3 className="risk-card__title">AI copilot risk assessment</h3>
      </div>

      <div className="risk-card__grid">
        <label className="field">
          <span className="field__label field__label--accent">Severity (Suggested)</span>
          <input
            className="field__control"
            type="text"
            name="severitySuggested"
            value={severitySuggested}
            onChange={onChange}
            placeholder="Suggested severity"
          />
        </label>

        <label className="field">
          <span className="field__label field__label--accent">Suggested Next Action</span>
          <input
            className="field__control"
            type="text"
            name="suggestedNextAction"
            value={suggestedNextAction}
            onChange={onChange}
            placeholder="Suggested next action"
          />
        </label>

        <label className="field field--full">
          <span className="field__label field__label--accent">Initial Risk Assessment</span>
          <input
            className="field__control"
            type="text"
            name="initialRiskAssessment"
            value={initialRiskAssessment}
            onChange={onChange}
            placeholder="Initial risk assessment"
          />
        </label>
      </div>
    </div>
  )
}

import { useState, type ChangeEvent, type FormEvent } from 'react'
import {
  INITIAL_COMPLAINT_FORM,
  type ComplaintFormData,
} from '../../types/complaint'
import { FormSection } from './FormSection'
import { RiskAssessmentCard } from './RiskAssessmentCard'

export function ComplaintForm() {
  const [form, setForm] = useState<ComplaintFormData>(INITIAL_COMPLAINT_FORM)
  const [commitMessage, setCommitMessage] = useState<string | null>(null)

  function handleChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))
    if (commitMessage) setCommitMessage(null)
  }

  function handleCommit(event: FormEvent) {
    event.preventDefault()
    // Visual-only for this milestone — no QMS / API persistence yet.
    setCommitMessage('Draft ready for QMS ledger (local only — not submitted).')
  }

  return (
    <form className="complaint-form" onSubmit={handleCommit}>
      <header className="complaint-form__header">
        <div>
          <h1 className="complaint-form__title">Log Customer Complaint</h1>
          <p className="complaint-form__subtitle">
            API &amp; FDF Quality Assurance Module
          </p>
        </div>
        <span className="status-badge">Pending Triage</span>
      </header>

      <FormSection title="1. ORIGIN & CUSTOMER DETAILS" columns={2}>
        <label className="field">
          <span className="field__label">Complaint Source</span>
          <input
            className="field__control"
            type="text"
            name="complaintSource"
            value={form.complaintSource}
            onChange={handleChange}
            placeholder="e.g., Email"
          />
        </label>

        <label className="field">
          <span className="field__label">Customer Name</span>
          <input
            className="field__control"
            type="text"
            name="customerName"
            value={form.customerName}
            onChange={handleChange}
            placeholder="Customer / company name"
          />
        </label>
      </FormSection>

      <FormSection title="2. PRODUCT & BATCH IDENTIFICATION" columns={2}>
        <label className="field">
          <span className="field__label">Product Name</span>
          <input
            className="field__control"
            type="text"
            name="productName"
            value={form.productName}
            onChange={handleChange}
            placeholder="Product name"
          />
        </label>

        <label className="field">
          <span className="field__label">Product Strength/Grade</span>
          <input
            className="field__control"
            type="text"
            name="productStrengthGrade"
            value={form.productStrengthGrade}
            onChange={handleChange}
            placeholder="e.g., IP/BP"
          />
        </label>

        <label className="field">
          <span className="field__label">Batch / Lot Number</span>
          <input
            className="field__control"
            type="text"
            name="batchLotNumber"
            value={form.batchLotNumber}
            onChange={handleChange}
            placeholder="Batch / lot number"
          />
        </label>

        <label className="field">
          <span className="field__label">Affected Quantity</span>
          <input
            className="field__control"
            type="text"
            name="affectedQuantity"
            value={form.affectedQuantity}
            onChange={handleChange}
            placeholder="e.g., 25 kg (1 HDPE Drum)"
          />
        </label>

        <label className="field">
          <span className="field__label">Manufacturing Date</span>
          <input
            className="field__control"
            type="text"
            name="manufacturingDate"
            value={form.manufacturingDate}
            onChange={handleChange}
            placeholder="Manufacturing date"
          />
        </label>

        <label className="field">
          <span className="field__label">Expiry Date</span>
          <input
            className="field__control"
            type="text"
            name="expiryDate"
            value={form.expiryDate}
            onChange={handleChange}
            placeholder="Expiry date"
          />
        </label>
      </FormSection>

      <FormSection title="4. DEFECT ANALYSIS">
        <label className="field field--full">
          <span className="field__label">Complaint Category</span>
          <input
            className="field__control"
            type="text"
            name="complaintCategory"
            value={form.complaintCategory}
            onChange={handleChange}
            placeholder="Complaint category"
          />
        </label>

        <label className="field field--full">
          <span className="field__label">Complaint Description</span>
          <textarea
            className="field__control field__control--textarea"
            name="complaintDescription"
            value={form.complaintDescription}
            onChange={handleChange}
            placeholder="Describe the complaint..."
            rows={4}
          />
        </label>

        <RiskAssessmentCard
          severitySuggested={form.severitySuggested}
          suggestedNextAction={form.suggestedNextAction}
          initialRiskAssessment={form.initialRiskAssessment}
          onChange={handleChange}
        />
      </FormSection>

      <div className="complaint-form__actions">
        {commitMessage && (
          <p className="complaint-form__commit-note" role="status">
            {commitMessage}
          </p>
        )}
        <button type="submit" className="commit-button">
          Commit to QMS Ledger
        </button>
      </div>
    </form>
  )
}

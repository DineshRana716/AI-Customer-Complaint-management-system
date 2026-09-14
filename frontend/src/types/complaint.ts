export type ComplaintFormData = {
  complaintSource: string
  customerName: string
  productName: string
  productStrengthGrade: string
  batchLotNumber: string
  affectedQuantity: string
  manufacturingDate: string
  expiryDate: string
  complaintCategory: string
  complaintDescription: string
  severitySuggested: string
  suggestedNextAction: string
  initialRiskAssessment: string
}

export const INITIAL_COMPLAINT_FORM: ComplaintFormData = {
  complaintSource: 'Email',
  customerName: 'ABC Formulations Ltd.',
  productName: 'Metformin Hydrochloride API',
  productStrengthGrade: 'IP/BP',
  batchLotNumber: 'MFH260712A',
  affectedQuantity: '25 kg (1 HDPE Drum)',
  manufacturingDate: '25 June 2026',
  expiryDate: 'Not Provided',
  complaintCategory: 'Foreign Matter Contamination',
  complaintDescription:
    'ABC Formulations Ltd. reported multiple dark foreign particles inside one sealed HDPE drum during incoming quality inspection. The drum had no visible external damage. Material quarantined.',
  severitySuggested: 'Critical',
  suggestedNextAction:
    'Laboratory investigation & manufacturing reco...',
  initialRiskAssessment:
    'Potential foreign matter contamination. High impact to API quality. Investigation of manufacturing',
}

export type ComplaintFormData = {
  customer_name: string;
  product_name: string;
  strength: string;
  batch_number: string;
  affected_quantity: string;
  manufacturing_date: string;
  expiry_date: string;
  originating_site: string;
  complaint_category: string;
  complaint_description: string;

  // These are currently frontend-only fields
  severitySuggested: string;
  suggestedNextAction: string;
  initialRiskAssessment: string;

  // Keep this because your form currently has it
  complaintSource: string;
};

export const INITIAL_COMPLAINT_FORM: ComplaintFormData = {
  customer_name: "",
  product_name: "",
  strength: "",
  batch_number: "",
  affected_quantity: "",
  manufacturing_date: "",
  expiry_date: "",
  originating_site: "",
  complaint_category: "",
  complaint_description: "",

  severitySuggested: "",
  suggestedNextAction: "",
  initialRiskAssessment: "",

  complaintSource: "",
};

import { useState } from "react";

import {
  INITIAL_COMPLAINT_FORM,
  type ComplaintFormData,
} from "../types/complaint";

import { ComplaintForm } from "../components/complaint/ComplaintForm";
import { CopilotPanel } from "../components/copilot/CopilotPanel";

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

export function ComplaintIntakePage() {
  const [form, setForm] = useState<ComplaintFormData>(INITIAL_COMPLAINT_FORM);

  function handleComplaintExtracted(result: StructuredComplaint) {
    setForm((currentForm) => ({
      ...currentForm,

      customer_name: result.customer_name ?? "",
      product_name: result.product_name ?? "",
      strength: result.strength ?? "",
      batch_number: result.batch_number ?? "",
      affected_quantity: result.affected_quantity ?? "",
      manufacturing_date: result.manufacturing_date ?? "",
      expiry_date: result.expiry_date ?? "",
      originating_site: result.originating_site ?? "",
      complaint_category: result.complaint_category ?? "",
      complaint_description: result.complaint_description ?? "",
    }));
  }

  return (
    <main className="intake-page">
      <section className="intake-page__form">
        <ComplaintForm form={form} setForm={setForm} />
      </section>

      <section className="intake-page__copilot">
        <CopilotPanel onExtracted={handleComplaintExtracted} />
      </section>
    </main>
  );
}

import { ComplaintForm } from '../components/complaint/ComplaintForm'
import { CopilotPanel } from '../components/copilot/CopilotPanel'

export function ComplaintIntakePage() {
  return (
    <main className="intake-page">
      <section className="intake-page__form">
        <ComplaintForm />
      </section>
      <section className="intake-page__copilot">
        <CopilotPanel />
      </section>
    </main>
  )
}

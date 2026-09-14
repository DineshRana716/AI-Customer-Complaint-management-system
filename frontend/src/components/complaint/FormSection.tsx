import type { ReactNode } from 'react'

type FormSectionProps = {
  title: string
  columns?: 1 | 2
  children: ReactNode
}

export function FormSection({ title, columns = 1, children }: FormSectionProps) {
  return (
    <section className="form-section">
      <h2 className="form-section__title">{title}</h2>
      <div
        className={`form-section__body${
          columns === 2 ? ' form-section__body--two-col' : ''
        }`}
      >
        {children}
      </div>
    </section>
  )
}

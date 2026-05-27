import { Suspense } from "react"
import { BibleClient } from "./BibleClient"

export default function BiblePage() {
  return (
    <Suspense fallback={<div className="p-6" style={{ color: 'var(--color-text-muted)' }}>Loading…</div>}>
      <BibleClient />
    </Suspense>
  )
}

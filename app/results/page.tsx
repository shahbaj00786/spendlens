import { notFound } from "next/navigation"
import connectDB from "@/lib/db/mongoose"
import Audit from "@/lib/models/Audit"
import Navbar from "@/components/shared/Navbar"
import AuditHero from "@/components/results/AuditHero"
import ToolBreakdownCard from "@/components/results/ToolBreakdownCard"
import AISummary from "@/components/results/AISummary"
import CredexCTA from "@/components/results/CredexCTA"
import ResultsActions from "@/components/results/ResultsActions"

interface ResultsPageProps {
  searchParams: Promise<{ id?: string }>
}

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { id } = await searchParams

  if (!id) notFound()

  await connectDB()
  const audit = await Audit.findById(id).lean()

  if (!audit) notFound()

  const results = audit.auditResults as any[]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <AuditHero
            totalMonthlySavings={audit.totalMonthlySavings}
            totalAnnualSavings={audit.totalAnnualSavings}
            isHighSavings={audit.isHighSavings}
            toolCount={results.length}
          />
          <AISummary
            auditId={id}
            initialSummary={audit.aiSummary || null}
          />
          <div className="space-y-3">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              Tool Breakdown
            </h2>
            {results.map((result, index) => (
              <ToolBreakdownCard key={index} result={result} />
            ))}
          </div>
          <CredexCTA
            totalMonthlySavings={audit.totalMonthlySavings}
            isHighSavings={audit.isHighSavings}
          />
          <ResultsActions
            auditId={id}
            monthlySavings={audit.totalMonthlySavings}
          />
        </div>
      </section>
    </main>
  )
}
import { notFound } from "next/navigation"
import connectDB from "@/lib/db/mongoose"
import Audit from "@/lib/models/Audit"
import Navbar from "@/components/shared/Navbar"
import AuditHero from "@/components/results/AuditHero"
import ToolBreakdownCard from "@/components/results/ToolBreakdownCard"
import CredexCTA from "@/components/results/CredexCTA"
import { Badge } from "@/components/ui/badge"
import { Eye } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"

interface PublicAuditPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: PublicAuditPageProps): Promise<Metadata> {
  const { id } = await params
  await connectDB()
  const audit = await Audit.findById(id).lean()

  if (!audit) return { title: "Audit Not Found — SpendLens" }

  const savings = audit.totalMonthlySavings
  const title = savings > 0
    ? `This team could save $${savings}/mo on AI tools — SpendLens`
    : "AI Spend Audit — Spending Well — SpendLens"

  const description = savings > 0
    ? `A free AI spend audit found $${savings}/month in potential savings. See the full breakdown.`
    : "A free AI spend audit found this team is well optimized."

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${process.env.NEXT_PUBLIC_APP_URL}/audit/${id}`,
      siteName: "SpendLens",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  }
}

export default async function PublicAuditPage({ params }: PublicAuditPageProps) {
  const { id } = await params

  await connectDB()
  const audit = await Audit.findById(id).lean()

  if (!audit) notFound()

  const results = audit.auditResults as any[]

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-24 pb-16 px-4">
        <div className="max-w-2xl mx-auto space-y-6">

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="gap-1">
              <Eye className="h-3 w-3" />
              Public Report
            </Badge>
            <span className="text-xs text-muted-foreground">
              Company and personal details are hidden
            </span>
          </div>

          <AuditHero
            totalMonthlySavings={audit.totalMonthlySavings}
            totalAnnualSavings={audit.totalAnnualSavings}
            isHighSavings={audit.isHighSavings}
            toolCount={results.length}
          />

          {audit.aiSummary && (
            <div className="p-4 rounded-lg border border-border bg-muted/30">
              <p className="text-sm leading-relaxed text-foreground/80">
                {audit.aiSummary}
              </p>
            </div>
          )}

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

          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-3">
              Want to audit your own AI spend?
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
            >
              Run Your Free Audit
            </Link>
          </div>

        </div>
      </section>
    </main>
  )
}
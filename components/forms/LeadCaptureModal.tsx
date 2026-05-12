"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, CheckCircle, Mail, Building2, Briefcase, TrendingDown } from "lucide-react"
import { toast } from "sonner"

interface LeadCaptureModalProps {
  auditId: string
  monthlySavings: number
  isOpen: boolean
  onClose: () => void
}

export default function LeadCaptureModal({
  auditId,
  monthlySavings,
  isOpen,
  onClose,
}: LeadCaptureModalProps) {
  const [email, setEmail] = useState("")
  const [companyName, setCompanyName] = useState("")
  const [role, setRole] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [honeypot, setHoneypot] = useState("")

  async function handleSubmit() {
    if (honeypot) { setIsSuccess(true); return }
    if (!email) { toast.error("Email is required"); return }

    setIsLoading(true)
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ auditId, email, companyName: companyName || null, role: role || null }),
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.error || "Failed to save")
      setIsSuccess(true)
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="p-0 overflow-hidden max-w-md border-0 shadow-2xl">
        {isSuccess ? (
          /* ── SUCCESS STATE ── */
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30 p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="font-bold text-xl mb-2">Report on its way!</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Check <span className="font-medium text-foreground">{email}</span> for your full audit report.
            </p>
            {monthlySavings > 500 && (
              <div className="mt-4 p-3 rounded-lg bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-800">
                <p className="text-xs text-violet-700 dark:text-violet-300 font-medium">
                  The Credex team will reach out to help you capture your ${monthlySavings}/mo in savings.
                </p>
              </div>
            )}
            <Button onClick={onClose} className="w-full mt-6 h-10">
              Back to Report
            </Button>
          </div>
        ) : (
          /* ── FORM STATE ── */
          <div className="flex flex-col">

            {/* Top gradient header */}
            <div className="bg-gradient-to-br from-violet-600 to-indigo-600 p-6 text-white">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                  <Mail className="h-4 w-4 text-white" />
                </div>
                <span className="font-semibold">Get Your Full Report</span>
              </div>
              {monthlySavings > 0 ? (
                <div className="flex items-center gap-3 bg-white/10 rounded-xl p-3">
                  <TrendingDown className="h-5 w-5 text-emerald-300 flex-shrink-0" />
                  <div>
                    <div className="text-2xl font-bold">${monthlySavings}<span className="text-sm font-normal opacity-80">/mo</span></div>
                    <div className="text-xs opacity-70">potential savings in your report</div>
                  </div>
                </div>
              ) : (
                <p className="text-sm opacity-80">
                  We will email you the complete audit with all recommendations.
                </p>
              )}
            </div>

            {/* Form body */}
            <div className="p-6 space-y-4 bg-background">

              {/* Honeypot */}
              <input
                type="text"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                style={{ display: "none" }}
                tabIndex={-1}
                aria-hidden="true"
              />

              {/* Email */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Work email <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="email"
                    placeholder="you@company.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-9 h-10"
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  />
                </div>
              </div>

              {/* Company */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Company <span className="text-muted-foreground/50">(optional)</span>
                </Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Acme Inc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>
              </div>

              {/* Role */}
              <div className="space-y-1.5">
                <Label className="text-xs font-medium text-muted-foreground">
                  Role <span className="text-muted-foreground/50">(optional)</span>
                </Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="CTO, Engineering Manager..."
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="pl-9 h-10"
                  />
                </div>
              </div>

              {/* Submit */}
              <Button
                className="w-full h-11 text-sm font-medium bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white border-0"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending report...
                  </>
                ) : (
                  "Send My Report"
                )}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                No spam. Unsubscribe anytime.
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
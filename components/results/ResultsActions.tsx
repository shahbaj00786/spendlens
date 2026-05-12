"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Share2, Mail, Check } from "lucide-react"
import { toast } from "sonner"
import LeadCaptureModal from "@/components/forms/LeadCaptureModal"

interface ResultsActionsProps {
  auditId: string
  monthlySavings: number
}

export default function ResultsActions({ auditId, monthlySavings }: ResultsActionsProps) {
  const [copied, setCopied] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)

  async function handleShare() {
    const url = `${window.location.origin}/audit/${auditId}`
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success("Share link copied!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.error("Could not copy link")
    }
  }

  return (
    <>
      <div className="flex flex-col sm:flex-row gap-3">
        <Button variant="outline" className="flex-1 h-10" onClick={handleShare}>
          {copied ? (
            <>
              <Check className="h-4 w-4 mr-2 text-emerald-600" />
              Copied!
            </>
          ) : (
            <>
              <Share2 className="h-4 w-4 mr-2" />
              Share Report
            </>
          )}
        </Button>
        <Button className="flex-1 h-10" onClick={() => setIsModalOpen(true)}>
          <Mail className="h-4 w-4 mr-2" />
          Email My Report
        </Button>
      </div>
      <LeadCaptureModal
        auditId={auditId}
        monthlySavings={monthlySavings}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"

interface CredexCTAProps {
  totalMonthlySavings: number
  isHighSavings: boolean
}

export default function CredexCTA({ totalMonthlySavings, isHighSavings }: CredexCTAProps) {
  if (!isHighSavings) {
    return (
      <Card className="border-border">
        <CardContent className="p-5">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-primary-foreground text-xs font-bold">S</span>
            </div>
            <div>
              <p className="text-sm font-medium mb-1">Stay ahead of AI pricing changes</p>
              <p className="text-xs text-muted-foreground mb-3">
                AI tool pricing changes frequently. We will notify you when new savings opportunities apply to your stack.
              </p>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Notify me of savings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-violet-200 bg-gradient-to-br from-violet-50 to-indigo-50 dark:from-violet-950/20 dark:to-indigo-950/20 dark:border-violet-800">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <Zap className="h-4 w-4 text-violet-600" />
          <Badge variant="secondary" className="bg-violet-100 text-violet-700 border-violet-200 text-xs">
            Credex Partnership
          </Badge>
        </div>

        <h3 className="font-semibold text-lg mb-2">
          Capture your ${totalMonthlySavings}/mo in savings
        </h3>

        <p className="text-sm text-muted-foreground mb-4">
          Credex sells discounted AI credits sourced from companies that overforecast.
          The discount is real and substantial. Book a free consultation to see exactly how much you can save.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button className="flex-1 bg-violet-600 hover:bg-violet-700 text-white" asChild>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
              Book Free Consultation
            </a>
          </Button>
          <Button variant="outline" className="flex-1" asChild>
            <a href="https://credex.rocks" target="_blank" rel="noopener noreferrer">
              Learn about Credex
            </a>
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          No commitment. Free 20-minute call with the Credex team.
        </p>
      </CardContent>
    </Card>
  )
}
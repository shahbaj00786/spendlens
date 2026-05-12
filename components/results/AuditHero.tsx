import { Badge } from "@/components/ui/badge";
import { TrendingDown, Calendar } from "lucide-react";

interface AuditHeroProps {
  totalMonthlySavings: number;
  totalAnnualSavings: number;
  isHighSavings: boolean;
  toolCount: number;
}

export default function AuditHero({
  totalMonthlySavings,
  totalAnnualSavings,
  isHighSavings,
  toolCount,
}: AuditHeroProps) {
  const isOptimal = totalMonthlySavings === 0;

  return (
    <div
      className={`rounded-2xl p-8 text-center ${
        isOptimal
          ? "bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 dark:from-emerald-950/20 dark:to-teal-950/20 dark:border-emerald-800"
          : isHighSavings
          ? "bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 dark:from-violet-950/20 dark:to-indigo-950/20 dark:border-violet-800"
          : "bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 dark:from-amber-950/20 dark:to-orange-950/20 dark:border-amber-800"
      }`}
    >
      {isOptimal ? (
        <>
          <Badge
            variant="secondary"
            className="mb-4 bg-emerald-100 text-emerald-700 border-emerald-200"
          >
            ✓ Well Optimized
          </Badge>
          <h1 className="text-4xl font-bold mb-2">
            You're spending well 🎉
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your AI tool stack looks optimized for your team size and use case.
            We analyzed {toolCount} tool{toolCount !== 1 ? "s" : ""} and found
            no significant overspend.
          </p>
        </>
      ) : (
        <>
          <Badge
            variant="secondary"
            className={
              isHighSavings
                ? "mb-4 bg-violet-100 text-violet-700 border-violet-200"
                : "mb-4 bg-amber-100 text-amber-700 border-amber-200"
            }
          >
            {isHighSavings ? "🔥 High Savings Opportunity" : "💡 Savings Found"}
          </Badge>

          <h1 className="text-5xl sm:text-6xl font-bold mb-2 tracking-tight">
            ${totalMonthlySavings.toFixed(0)}
            <span className="text-2xl sm:text-3xl font-medium text-muted-foreground">
              /mo
            </span>
          </h1>

          <p className="text-muted-foreground mb-6">
            in potential savings across {toolCount} tool
            {toolCount !== 1 ? "s" : ""}
          </p>

          {/* Monthly + Annual breakdown */}
          <div className="flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 bg-background/60 rounded-lg px-4 py-2">
              <TrendingDown className="h-4 w-4 text-emerald-600" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Monthly</div>
                <div className="font-semibold">
                  ${totalMonthlySavings.toFixed(0)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-background/60 rounded-lg px-4 py-2">
              <Calendar className="h-4 w-4 text-violet-600" />
              <div className="text-left">
                <div className="text-xs text-muted-foreground">Annual</div>
                <div className="font-semibold">
                  ${totalAnnualSavings.toFixed(0)}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
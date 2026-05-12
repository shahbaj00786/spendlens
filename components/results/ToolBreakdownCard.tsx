import { ToolAuditResult } from "@/lib/audit-engine/types";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingDown,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  XCircle,
} from "lucide-react";
import { PRICING } from "@/lib/audit-engine/pricing";

interface ToolBreakdownCardProps {
  result: ToolAuditResult;
}

const SEVERITY_CONFIG = {
  high: {
    badge: "bg-red-100 text-red-700 border-red-200",
    icon: XCircle,
    iconColor: "text-red-500",
    label: "High Priority",
  },
  medium: {
    badge: "bg-amber-100 text-amber-700 border-amber-200",
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    label: "Medium Priority",
  },
  low: {
    badge: "bg-blue-100 text-blue-700 border-blue-200",
    icon: TrendingDown,
    iconColor: "text-blue-500",
    label: "Low Priority",
  },
  optimal: {
    badge: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle,
    iconColor: "text-emerald-500",
    label: "Optimal",
  },
};

const ACTION_LABELS = {
  downgrade: "Downgrade to",
  upgrade: "Upgrade to",
  switch: "Switch to",
  keep: "Keep current plan",
};

export default function ToolBreakdownCard({ result }: ToolBreakdownCardProps) {
  const config = SEVERITY_CONFIG[result.severity];
  const Icon = config.icon;
  const toolDisplayName =
    PRICING[result.tool]?.displayName || result.tool;
  const recommendedToolName = result.recommendedTool
    ? PRICING[result.recommendedTool]?.displayName || result.recommendedTool
    : null;

  return (
    <Card className="border-border">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          {/* Left: tool info */}
          <div className="flex items-start gap-3 flex-1 min-w-0">
            <div className={`mt-0.5 ${config.iconColor}`}>
              <Icon className="h-5 w-5 flex-shrink-0" />
            </div>

            <div className="flex-1 min-w-0">
              {/* Tool name + severity */}
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-semibold text-sm">{toolDisplayName}</span>
                <Badge variant="outline" className={`text-xs ${config.badge}`}>
                  {config.label}
                </Badge>
              </div>

              {/* Current → Recommended */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2 flex-wrap">
                <span className="bg-muted px-2 py-0.5 rounded">
                  {result.currentPlan} · ${result.currentSpend}/mo
                </span>
                {result.recommendedAction !== "keep" && (
                  <>
                    <ArrowRight className="h-3 w-3 flex-shrink-0" />
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                      {ACTION_LABELS[result.recommendedAction]}{" "}
                      {result.recommendedAction === "switch"
                        ? recommendedToolName
                        : result.recommendedPlan}{" "}
                      · ${result.estimatedMonthlyCost}/mo
                    </span>
                  </>
                )}
              </div>

              {/* Reason */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {result.reason}
              </p>
            </div>
          </div>

          {/* Right: savings */}
          {result.monthlySavings > 0 && (
            <div className="text-right flex-shrink-0">
              <div className="text-lg font-bold text-emerald-600">
                -${result.monthlySavings}/mo
              </div>
              <div className="text-xs text-muted-foreground">
                ${result.annualSavings}/yr
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
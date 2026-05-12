"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Loader2 } from "lucide-react";

interface AISummaryProps {
  auditId: string;
  initialSummary: string | null;
}

export default function AISummary({ auditId, initialSummary }: AISummaryProps) {
  const [summary, setSummary] = useState<string | null>(initialSummary);
  const [isLoading, setIsLoading] = useState(!initialSummary);

  useEffect(() => {
    // If we already have a summary, no need to poll
    if (initialSummary) return;

    // Poll every 2 seconds until summary is ready
    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/audit/${auditId}/summary`);
        if (res.ok) {
          const data = await res.json();
          if (data.summary) {
            setSummary(data.summary);
            setIsLoading(false);
            clearInterval(interval);
          }
        }
      } catch {
        // Keep polling on error
      }
    }, 2000);

    // Stop polling after 30 seconds
    const timeout = setTimeout(() => {
      clearInterval(interval);
      setIsLoading(false);
      setSummary(
        "Your audit is complete. Review the recommendations below to start saving on your AI tools."
      );
    }, 30000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [auditId, initialSummary]);

  return (
    <Card className="border-border bg-gradient-to-br from-violet-50/50 to-indigo-50/50 dark:from-violet-950/10 dark:to-indigo-950/10">
      <CardContent className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4 text-violet-600" />
          <span className="text-sm font-medium">AI Summary</span>
          <span className="text-xs text-muted-foreground">
            — personalized for your stack
          </span>
        </div>

        {isLoading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating personalized summary...
          </div>
        ) : (
          <p className="text-sm leading-relaxed text-foreground/80">
            {summary}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
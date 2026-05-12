"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ToolInput, UseCaseType } from "@/lib/audit-engine/types";
import ToolRow from "./ToolRow";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus, Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const STORAGE_KEY = "spendlens_form_state";

const DEFAULT_TOOL: ToolInput = {
  tool: "cursor",
  plan: "pro",
  seats: 1,
  monthlySpend: 20,
};

const USE_CASES: { value: UseCaseType; label: string }[] = [
  { value: "coding", label: "Software Development" },
  { value: "writing", label: "Content & Writing" },
  { value: "data", label: "Data & Analytics" },
  { value: "research", label: "Research" },
  { value: "mixed", label: "Mixed / General" },
];

export default function SpendForm() {
  const router = useRouter();
  const [tools, setTools] = useState<ToolInput[]>([{ ...DEFAULT_TOOL }]);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<UseCaseType>("coding");
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.tools) setTools(parsed.tools);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.useCase) setUseCase(parsed.useCase);
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Save to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ tools, teamSize, useCase })
      );
    } catch {
      // Ignore storage errors
    }
  }, [tools, teamSize, useCase]);

  function handleToolChange(index: number, updated: ToolInput) {
    setTools((prev) => prev.map((t, i) => (i === index ? updated : t)));
  }

  function handleToolRemove(index: number) {
    setTools((prev) => prev.filter((_, i) => i !== index));
  }

  function handleAddTool() {
    if (tools.length >= 8) {
      toast.error("Maximum 8 tools allowed");
      return;
    }
    setTools((prev) => [...prev, { ...DEFAULT_TOOL }]);
  }

  const totalMonthlySpend = tools.reduce((sum, t) => sum + t.monthlySpend, 0);

  async function handleSubmit() {
    if (tools.length === 0) {
      toast.error("Please add at least one tool");
      return;
    }

    if (teamSize < 1) {
      toast.error("Team size must be at least 1");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tools, teamSize, useCase }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to run audit");
      }

      // Clear localStorage after successful audit
      localStorage.removeItem(STORAGE_KEY);

      // Redirect to results page
      router.push(`/results?id=${data.auditId}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="border-border shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">Audit Your AI Spend</CardTitle>
        <CardDescription>
          Add every AI tool your team pays for. We'll find where you're
          overspending.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Team info */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Team Size
            </Label>
            <Input
              type="number"
              min={1}
              value={teamSize}
              onChange={(e) =>
                setTeamSize(Math.max(1, parseInt(e.target.value) || 1))
              }
              className="h-9"
              placeholder="e.g. 5"
            />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground mb-1.5 block">
              Primary Use Case
            </Label>
            <Select
              value={useCase}
              onValueChange={(v) => setUseCase(v as UseCaseType)}
            >
              <SelectTrigger className="h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {USE_CASES.map((uc) => (
                  <SelectItem key={uc.value} value={uc.value}>
                    {uc.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Tool rows */}
        <div className="space-y-3">
          <Label className="text-xs text-muted-foreground block">
            AI Tools ({tools.length}/8)
          </Label>
          {tools.map((tool, index) => (
            <ToolRow
              key={index}
              tool={tool}
              index={index}
              onChange={handleToolChange}
              onRemove={handleToolRemove}
              canRemove={tools.length > 1}
            />
          ))}
        </div>

        {/* Add tool button */}
        <Button
          variant="outline"
          className="w-full h-9 border-dashed"
          onClick={handleAddTool}
          disabled={tools.length >= 8}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Another Tool
        </Button>

        {/* Total spend summary */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <span className="text-sm text-muted-foreground">
            Total monthly spend
          </span>
          <span className="text-sm font-semibold">
            ${totalMonthlySpend.toFixed(2)}/mo
          </span>
        </div>

        {/* Submit */}
        <Button
          className="w-full h-11 text-sm font-medium"
          onClick={handleSubmit}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Running Audit...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Run Free Audit
            </>
          )}
        </Button>

        <p className="text-xs text-center text-muted-foreground">
          No account required. Results are instant.
        </p>
      </CardContent>
    </Card>
  );
}
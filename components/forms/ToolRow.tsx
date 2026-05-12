"use client";

import { ToolInput, ToolName } from "@/lib/audit-engine/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PRICING } from "@/lib/audit-engine/pricing";

interface ToolRowProps {
  tool: ToolInput;
  index: number;
  onChange: (index: number, updated: ToolInput) => void;
  onRemove: (index: number) => void;
  canRemove: boolean;
}

const TOOL_OPTIONS: { value: ToolName; label: string }[] = [
  { value: "cursor", label: "Cursor" },
  { value: "github-copilot", label: "GitHub Copilot" },
  { value: "claude", label: "Claude" },
  { value: "chatgpt", label: "ChatGPT" },
  { value: "anthropic-api", label: "Anthropic API" },
  { value: "openai-api", label: "OpenAI API" },
  { value: "gemini", label: "Gemini" },
  { value: "windsurf", label: "Windsurf" },
];

export default function ToolRow({
  tool,
  index,
  onChange,
  onRemove,
  canRemove,
}: ToolRowProps) {
  const toolPricing = PRICING[tool.tool];
  const planOptions = toolPricing
    ? Object.entries(toolPricing.plans).map(([key, val]) => ({
        value: key,
        label: val.name,
        price: val.pricePerSeat,
      }))
    : [];

  function handleToolChange(value: ToolName) {
    const firstPlan = Object.keys(PRICING[value]?.plans || {})[0] || "";
    const firstPlanPrice = PRICING[value]?.plans[firstPlan]?.pricePerSeat || 0;
    onChange(index, {
      ...tool,
      tool: value,
      plan: firstPlan,
      monthlySpend: firstPlanPrice * tool.seats,
    });
  }

  function handlePlanChange(value: string) {
    const planPrice = toolPricing?.plans[value]?.pricePerSeat || 0;
    onChange(index, {
      ...tool,
      plan: value,
      monthlySpend: planPrice * tool.seats,
    });
  }

  function handleSeatsChange(value: string) {
    const seats = Math.max(1, parseInt(value) || 1);
    const planPrice = toolPricing?.plans[tool.plan]?.pricePerSeat || 0;
    onChange(index, {
      ...tool,
      seats,
      monthlySpend: planPrice * seats,
    });
  }

  function handleSpendChange(value: string) {
    onChange(index, {
      ...tool,
      monthlySpend: parseFloat(value) || 0,
    });
  }

  return (
    <div className="grid grid-cols-12 gap-3 items-end p-4 rounded-lg border border-border bg-card">
      {/* Tool selector */}
      <div className="col-span-12 sm:col-span-4">
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          Tool
        </Label>
        <Select value={tool.tool} onValueChange={handleToolChange}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {TOOL_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Plan selector */}
      <div className="col-span-12 sm:col-span-3">
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          Plan
        </Label>
        <Select value={tool.plan} onValueChange={handlePlanChange}>
          <SelectTrigger className="h-9">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {planOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label} — ${opt.price}/seat
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Seats */}
      <div className="col-span-5 sm:col-span-2">
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          Seats
        </Label>
        <Input
          type="number"
          min={1}
          value={tool.seats}
          onChange={(e) => handleSeatsChange(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Monthly spend */}
      <div className="col-span-6 sm:col-span-2">
        <Label className="text-xs text-muted-foreground mb-1.5 block">
          $/month
        </Label>
        <Input
          type="number"
          min={0}
          value={tool.monthlySpend}
          onChange={(e) => handleSpendChange(e.target.value)}
          className="h-9"
        />
      </div>

      {/* Remove button */}
      <div className="col-span-1 flex justify-end">
        {canRemove && (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(index)}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
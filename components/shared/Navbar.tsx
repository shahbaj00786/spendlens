import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-xs font-bold">S</span>
          </div>
          <span className="font-semibold text-sm tracking-tight">
            SpendLens
          </span>
          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4">
            Beta
          </Badge>
        </Link>

        {/* Right side */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-muted-foreground hidden sm:block">
            Free AI spend audit
          </span>
          <Link
            href="/#audit"
            className="text-xs font-medium bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:opacity-90 transition-opacity"
          >
            Run Audit →
          </Link>
        </div>
      </div>
    </nav>
  );
}
import Navbar from "@/components/shared/Navbar";
import SpendForm from "@/components/forms/SpendForm";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            Free AI Spend Audit
          </Badge>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-6">
            Are you overpaying for{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
              AI tools?
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-8">
            Enter your AI subscriptions and get an instant audit. Find out
            exactly where you're overspending and how much you could save.
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 mb-12">
            <div className="text-center">
              <div className="text-2xl font-bold">$2,400</div>
              <div className="text-xs text-muted-foreground">avg annual savings</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold">8+</div>
              <div className="text-xs text-muted-foreground">tools analyzed</div>
            </div>
            <div className="w-px h-8 bg-border" />
            <div className="text-center">
              <div className="text-2xl font-bold">Free</div>
              <div className="text-xs text-muted-foreground">always</div>
            </div>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section id="audit" className="pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <SpendForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 px-4">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <span className="text-sm text-muted-foreground">
            © 2025 SpendLens by{" "}
            
              href="https://credex.rocks"
              className="underline underline-offset-2"
              target="_blank"
              rel="noopener noreferrer"
            >
              Credex
            </a>
          </span>
          <span className="text-xs text-muted-foreground">
            Pricing data verified weekly from official vendor pages
          </span>
        </div>
      </footer>
    </main>
  );
}
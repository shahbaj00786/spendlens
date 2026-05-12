import Navbar from "@/components/shared/Navbar"
import SpendForm from "@/components/forms/SpendForm"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="pt-32 pb-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-6">
            Are you overpaying for AI tools?
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto mb-12">
            Enter your AI subscriptions and get an instant audit.
          </p>
        </div>
      </section>
      <section id="audit" className="pb-24 px-4">
        <div className="max-w-3xl mx-auto">
          <SpendForm />
        </div>
      </section>
    </main>
  )
}
import { Brain, MapPin, MessageSquareText, ShieldCheck } from "lucide-react";

const STEPS = [
  {
    number: "01",
    title: "Report",
    icon: MessageSquareText,
    description: "Citizen describes the problem in their own words.",
  },
  {
    number: "02",
    title: "AI Understands",
    icon: Brain,
    description: "AI identifies category, issue, priority, summary and sentiment.",
  },
  {
    number: "03",
    title: "Location Intelligence",
    icon: MapPin,
    description: "The citizen's location is captured securely.",
  },
  {
    number: "04",
    title: "Governance Insight",
    icon: ShieldCheck,
    description: "Structured data becomes useful for administrators and analytics.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="num-tag">How It Works</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-offwhite lg:text-4xl">
            From a sentence to structured governance data.
          </h2>
        </div>

        <div className="relative mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <div
            className="pointer-events-none absolute left-0 right-0 top-8 hidden h-px bg-gradient-to-r from-transparent via-navy-border to-transparent lg:block"
            aria-hidden="true"
          />
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div key={step.number} className="relative animate-fade-up">
                <div className="flex items-center gap-4">
                  <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-navy-border bg-navy-light">
                    <Icon className="h-6 w-6 text-cyan" strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="font-mono text-3xl font-semibold text-white/10">{step.number}</span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold text-offwhite">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-soft">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

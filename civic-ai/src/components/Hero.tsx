import { ArrowRight, PlayCircle } from "lucide-react";
import { Button } from "./ui/primitives";
import { PipelineVisual } from "./PipelineVisual";

export function Hero() {
  return (
    <section id="home" className="relative overflow-hidden px-6 pb-24 pt-16 lg:px-10 lg:pt-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="animate-fade-up">
          <span className="num-tag inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Civic Governance, Powered by AI
          </span>

          <h1 className="mt-6 max-w-xl font-display text-5xl font-semibold leading-[1.08] tracking-tight text-offwhite lg:text-6xl">
            Turn Civic Problems Into <span className="text-gradient">Action.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-soft">
            Describe a problem in your area. CIVIC AI uses artificial intelligence to
            understand, prioritize and structure citizen complaints for smarter
            governance.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Button
              size="lg"
              onClick={() => document.getElementById("report")?.scrollIntoView({ behavior: "smooth" })}
            >
              Report a Civic Issue <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })}
            >
              <PlayCircle className="h-4 w-4" aria-hidden="true" /> See How It Works
            </Button>
          </div>
        </div>

        <div className="animate-fade-up [animation-delay:150ms]">
          <PipelineVisual />
        </div>
      </div>
    </section>
  );
}

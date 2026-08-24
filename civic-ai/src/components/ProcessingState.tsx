import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

const STAGES = [
  "Analyzing complaint",
  "Identifying issue",
  "Determining priority",
  "Processing location",
  "Creating governance record",
];

const STAGE_INTERVAL_MS = 1400;

export function ProcessingState() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((i) => Math.min(i + 1, STAGES.length - 1));
    }, STAGE_INTERVAL_MS);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col items-center py-6 text-center" role="status" aria-live="polite">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 animate-spin-slow rounded-full border-2 border-transparent border-t-cyan border-r-electric" />
        <span className="h-3 w-3 rounded-full bg-cyan shadow-glow-cyan" />
      </div>

      <h3 className="mt-6 font-display text-lg font-semibold text-offwhite">
        Understanding your complaint...
      </h3>

      <ul className="mt-8 flex w-full max-w-xs flex-col gap-3 text-left">
        {STAGES.map((stage, i) => {
          const isDone = i < activeIndex;
          const isActive = i === activeIndex;
          return (
            <li key={stage} className="flex items-center gap-3">
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 shrink-0 text-priority-low" aria-hidden="true" />
              ) : isActive ? (
                <Loader2 className="h-4 w-4 shrink-0 animate-spin text-cyan" aria-hidden="true" />
              ) : (
                <span className="h-4 w-4 shrink-0 rounded-full border border-white/15" aria-hidden="true" />
              )}
              <span
                className={
                  isDone
                    ? "text-sm text-slate-soft line-through decoration-white/20"
                    : isActive
                      ? "text-sm font-medium text-offwhite"
                      : "text-sm text-slate-soft/60"
                }
              >
                {stage}
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

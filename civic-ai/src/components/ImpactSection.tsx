import { useEffect, useRef, useState } from "react";
import { AlertTriangle, Brain, MapPinned, MessageSquareText } from "lucide-react";

const METRICS = [
  { label: "Citizen Reports", value: 4820, icon: MessageSquareText },
  { label: "AI Analyzed", value: 4820, icon: Brain },
  { label: "High Priority Issues", value: 612, icon: AlertTriangle },
  { label: "Locations Mapped", value: 1370, icon: MapPinned },
];

function useCountUp(target: number, active: boolean, durationMs = 1400) {
  const [value, setValue] = useState(0);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    if (!active) return;
    let frame: number;
    const step = (timestamp: number) => {
      if (startRef.current === null) startRef.current = timestamp;
      const progress = Math.min((timestamp - startRef.current) / durationMs, 1);
      setValue(Math.round(target * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [active, target, durationMs]);

  return value;
}

export function ImpactSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setActive(true);
      },
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="impact" className="px-6 py-24 lg:px-10">
      <div ref={sectionRef} className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="num-tag">Impact</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-offwhite lg:text-4xl">
            From Citizen Voices to Governance Intelligence
          </h2>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((metric) => (
            <MetricCard key={metric.label} {...metric} active={active} />
          ))}
        </div>

        <p className="mt-6 text-xs text-slate-soft/70">
          Illustrative demo values — not yet connected to a live analytics endpoint.
        </p>
      </div>
    </section>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  active,
}: {
  label: string;
  value: number;
  icon: typeof MessageSquareText;
  active: boolean;
}) {
  const displayValue = useCountUp(value, active);
  return (
    <div className="rounded-2xl border border-navy-border bg-navy/50 p-6">
      <Icon className="h-5 w-5 text-cyan" strokeWidth={1.75} aria-hidden="true" />
      <p className="mt-4 font-display text-3xl font-semibold text-offwhite">
        {displayValue.toLocaleString()}
        <span className="text-cyan">+</span>
      </p>
      <p className="mt-1.5 text-sm text-slate-soft">{label}</p>
      <p className="mt-1 text-[10px] uppercase tracking-widest text-slate-soft/50">Demo value</p>
    </div>
  );
}

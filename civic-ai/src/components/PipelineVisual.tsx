import { AlertTriangle, Landmark, MapPin, MessageSquare, Sparkles } from "lucide-react";

const STAGES = [
  { label: "Citizen Report", icon: MessageSquare },
  { label: "AI Analysis", icon: Sparkles },
  { label: "Priority Detection", icon: AlertTriangle },
  { label: "Location Intelligence", icon: MapPin },
  { label: "Governance Action", icon: Landmark },
];

export function PipelineVisual() {
  return (
    <div
      className="relative mx-auto w-full max-w-sm rounded-3xl border border-navy-border bg-navy/50 p-6 shadow-card backdrop-blur-sm"
      role="img"
      aria-label="Pipeline showing a citizen report flowing through AI analysis, priority detection and location intelligence into a governance action"
    >
      <div className="absolute left-[38px] top-10 bottom-10 w-px bg-gradient-to-b from-electric/60 via-cyan/40 to-electric/10" />
      <ul className="relative flex flex-col gap-7">
        {STAGES.map((stage, i) => {
          const Icon = stage.icon;
          return (
            <li key={stage.label} className="flex items-center gap-4">
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-electric/40 bg-midnight">
                <span
                  className="absolute inset-0 rounded-full bg-electric/20 animate-pulse-dot"
                  style={{ animationDelay: `${i * 0.35}s` }}
                  aria-hidden="true"
                />
                <Icon className="relative h-5 w-5 text-cyan" strokeWidth={1.75} aria-hidden="true" />
              </span>
              <div>
                <p className="num-tag">{String(i + 1).padStart(2, "0")}</p>
                <p className="font-display text-sm font-medium text-offwhite">{stage.label}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

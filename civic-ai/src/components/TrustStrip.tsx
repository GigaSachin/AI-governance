import { BrainCircuit, Database, MapPinned, Radio } from "lucide-react";

const ITEMS = [
  { label: "AI Powered", icon: BrainCircuit },
  { label: "Location Aware", icon: MapPinned },
  { label: "Real-time Citizen Reporting", icon: Radio },
  { label: "Data-driven Governance", icon: Database },
];

export function TrustStrip() {
  return (
    <section aria-label="Platform capabilities" className="border-y border-white/5 bg-navy/30">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-6 py-8 lg:grid-cols-4 lg:px-10">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-3">
              <Icon className="h-5 w-5 shrink-0 text-cyan" strokeWidth={1.75} aria-hidden="true" />
              <span className="text-sm font-medium text-slate-soft">{item.label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

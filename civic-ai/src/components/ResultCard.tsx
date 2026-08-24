import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  Database,
  FileText,
  Frown,
  Layers,
  MapPin,
  Meh,
  Smile,
  Tag,
} from "lucide-react";
import type { AnalyzeResponse } from "../lib/api";
import { Badge, Button, priorityTone, type PriorityTone } from "./ui/primitives";

interface ResultCardProps {
  result: AnalyzeResponse;
  onReportAnother: () => void;
  onBackHome: () => void;
}

function sentimentIcon(sentiment?: string) {
  const s = (sentiment ?? "").toLowerCase();
  if (s.includes("neg")) return Frown;
  if (s.includes("pos")) return Smile;
  return Meh;
}

export function ResultCard({ result, onReportAnother, onBackHome }: ResultCardProps) {
  const [showDetails, setShowDetails] = useState(false);
  const SentimentIcon = sentimentIcon(result.sentiment);
  const tone = priorityTone(result.priority);

  const fields: { label: string; value: string; icon: typeof Tag }[] = [
    { label: "Category", value: result.category ?? "Not classified", icon: Layers },
    { label: "Sub-category", value: result.subCategory ?? "—", icon: Tag },
    { label: "Issue", value: result.issue ?? "—", icon: FileText },
  ];

  return (
    <div className="animate-fade-up text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-priority-low/40 bg-priority-low/10">
        <CheckCircle2 className="h-7 w-7 text-priority-low" aria-hidden="true" />
      </div>

      <h3 className="mt-5 font-display text-2xl font-semibold text-offwhite">
        Complaint Successfully Analyzed
      </h3>
      <p className="mt-2 text-sm text-slate-soft">
        Your complaint has been successfully recorded.
      </p>
      <p className="mx-auto mt-1 max-w-md text-sm text-slate-soft">
        Your report has been analyzed by AI and securely added to the governance system.
      </p>

      {result.complaintId && (
        <p className="mt-4 font-mono text-xs text-slate-soft">
          Complaint ID <span className="text-cyan">{result.complaintId}</span>
        </p>
      )}

      {/* Priority — visually prominent */}
      <div className="mt-8 flex justify-center">
        <div
          className={
            "flex items-center gap-2 rounded-2xl border px-6 py-3 " +
            {
              critical: "border-priority-critical/50 bg-priority-critical/10",
              high: "border-priority-high/50 bg-priority-high/10",
              medium: "border-priority-medium/50 bg-priority-medium/10",
              low: "border-priority-low/50 bg-priority-low/10",
              neutral: "border-white/15 bg-white/5",
            }[tone]
          }
        >
          <AlertTriangle
            className={
              "h-5 w-5 " +
              {
                critical: "text-priority-critical",
                high: "text-priority-high",
                medium: "text-priority-medium",
                low: "text-priority-low",
                neutral: "text-slate-soft",
              }[tone]
            }
            aria-hidden="true"
          />
          <span className="text-left">
            <span className="block text-[10px] uppercase tracking-widest text-slate-soft">
              Priority
            </span>
            <span className="font-display text-lg font-semibold text-offwhite">
              {result.priority ?? "Unclassified"}
            </span>
          </span>
        </div>
      </div>

      <div className="mt-8 grid gap-3 text-left sm:grid-cols-2">
        {fields.map((field) => {
          const Icon = field.icon;
          return (
            <div key={field.label} className="rounded-xl border border-navy-border bg-navy-light/50 p-4">
              <p className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-soft">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" /> {field.label}
              </p>
              <p className="mt-1.5 text-sm font-medium text-offwhite">{field.value}</p>
            </div>
          );
        })}

        <div className="rounded-xl border border-navy-border bg-navy-light/50 p-4">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-soft">
            <SentimentIcon className="h-3.5 w-3.5" aria-hidden="true" /> Sentiment
          </p>
          <p className="mt-1.5 text-sm font-medium text-offwhite">{result.sentiment ?? "—"}</p>
        </div>

        <div className="rounded-xl border border-navy-border bg-navy-light/50 p-4">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-slate-soft">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> Location
          </p>
          <p className="mt-1.5 text-sm font-medium text-offwhite">
            {result.locationCaptured === false ? "Not captured" : "Captured"}
          </p>
        </div>
      </div>

      {result.summary && (
        <div className="mt-4 rounded-xl border border-navy-border bg-navy-light/50 p-4 text-left">
          <p className="text-[10px] uppercase tracking-widest text-slate-soft">Summary</p>
          <p className="mt-1.5 text-sm leading-relaxed text-offwhite/90">{result.summary}</p>
        </div>
      )}

      <div className="mt-6 flex items-center justify-center gap-3">
        <Badge tone={result.database?.firebase ? "low" : "neutral"}>
          <Database className="h-3 w-3" aria-hidden="true" />
          Firebase {result.database?.firebase ? "synced" : "pending"}
        </Badge>
        <Badge tone={result.database?.bigQuery ? "low" : "neutral"}>
          <Database className="h-3 w-3" aria-hidden="true" />
          BigQuery {result.database?.bigQuery ? "synced" : "pending"}
        </Badge>
      </div>

      <button
        type="button"
        onClick={() => setShowDetails((v) => !v)}
        className="mt-6 inline-flex items-center gap-1.5 text-xs font-medium text-slate-soft hover:text-cyan focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"
        aria-expanded={showDetails}
      >
        <ChevronDown
          className={`h-3.5 w-3.5 transition-transform ${showDetails ? "rotate-180" : ""}`}
          aria-hidden="true"
        />
        {showDetails ? "Hide full response" : "View full complaint record"}
      </button>

      {showDetails && (
        <pre className="mt-3 max-h-64 overflow-auto rounded-xl border border-navy-border bg-midnight p-4 text-left font-mono text-[11px] leading-relaxed text-slate-soft">
          {JSON.stringify(result.raw, null, 2)}
        </pre>
      )}

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Button onClick={onReportAnother}>Report Another Issue</Button>
        <Button variant="secondary" onClick={() => setShowDetails(true)}>
          View Complaint
        </Button>
        <Button variant="ghost" onClick={onBackHome}>
          Back to Home
        </Button>
      </div>
    </div>
  );
}

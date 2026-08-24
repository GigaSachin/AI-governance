import { CheckCircle2, Loader2, MapPin, MapPinOff, ShieldAlert } from "lucide-react";
import { Button } from "./ui/primitives";

type GeoState = {
  status: "idle" | "loading" | "success" | "denied" | "error" | "unsupported";
  latitude?: number;
  longitude?: number;
};

interface LocationCardProps {
  geo: GeoState;
  onDetect: () => void;
  skipped: boolean;
  onSkip: () => void;
  onUndoSkip: () => void;
}

export function LocationCard({ geo, onDetect, skipped, onSkip, onUndoSkip }: LocationCardProps) {
  return (
    <div className="rounded-2xl border border-navy-border bg-navy-light/60 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-display text-base font-semibold text-offwhite">Your Location</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-soft">
            Your location helps us understand where the problem is happening and enables
            location-based governance insights.
          </p>
        </div>
        <MapPin className="mt-1 h-5 w-5 shrink-0 text-cyan" aria-hidden="true" />
      </div>

      <div className="mt-5" aria-live="polite">
        {geo.status === "idle" && (
          <p className="text-sm text-slate-soft">Location not detected.</p>
        )}

        {geo.status === "loading" && (
          <p className="flex items-center gap-2 text-sm text-cyan">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Detecting your location...
          </p>
        )}

        {geo.status === "success" && (
          <div className="rounded-xl border border-priority-low/30 bg-priority-low/10 p-4">
            <p className="flex items-center gap-2 text-sm font-semibold text-priority-low">
              <CheckCircle2 className="h-4 w-4" aria-hidden="true" /> Location captured
            </p>
            <dl className="mt-3 grid grid-cols-2 gap-3 font-mono text-xs text-slate-soft">
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-slate-soft/70">Latitude</dt>
                <dd className="mt-0.5 text-offwhite">{geo.latitude?.toFixed(6)}</dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widest text-slate-soft/70">Longitude</dt>
                <dd className="mt-0.5 text-offwhite">{geo.longitude?.toFixed(6)}</dd>
              </div>
            </dl>
          </div>
        )}

        {geo.status === "denied" && (
          <p className="flex items-start gap-2 text-sm text-priority-high">
            <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Location permission was denied. Please allow location access and try again.
          </p>
        )}

        {(geo.status === "error" || geo.status === "unsupported") && (
          <p className="flex items-start gap-2 text-sm text-priority-high">
            <MapPinOff className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            Unable to detect your location.
          </p>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3">
        <Button
          variant="secondary"
          size="sm"
          onClick={onDetect}
          disabled={geo.status === "loading"}
          aria-label="Detect my location"
        >
          {geo.status === "loading" ? "Detecting..." : "Detect My Location"}
        </Button>

        {geo.status !== "success" && !skipped && (
          <Button variant="ghost" size="sm" onClick={onSkip}>
            Continue without location
          </Button>
        )}

        {skipped && (
          <span className="flex items-center gap-2 text-xs text-slate-soft">
            Continuing without location.
            <button
              type="button"
              onClick={onUndoSkip}
              className="font-semibold text-cyan underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan"
            >
              Undo
            </button>
          </span>
        )}
      </div>
    </div>
  );
}

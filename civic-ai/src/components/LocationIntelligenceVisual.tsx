import { ComplaintMap } from "./ComplaintMap";

export function LocationIntelligenceVisual() {
  return (
    <section className="px-6 py-24 lg:px-10">
      <div className="mx-auto max-w-7xl">
        {/* ================================
            SECTION HEADER
        ================================= */}

        <div className="max-w-3xl">
          <p className="num-tag">Location Intelligence</p>

          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-offwhite lg:text-4xl">
            Individual reports become geographic hotspots.
          </h2>

          <p className="mt-4 max-w-2xl text-slate-soft">
            As reports accumulate, CIVIC AI maps them by location and
            identifies geographic patterns that administrators can act on.
          </p>

          <p className="mt-4 text-xs text-slate-soft/60">
            Live complaint data powered by citizen GPS reports.
          </p>
        </div>

        {/* ================================
            LIVE MAP
        ================================= */}

        <div className="mt-10 w-full overflow-hidden rounded-3xl border border-navy-border bg-navy/40">
          <ComplaintMap />
        </div>
      </div>
    </section>
  );
}
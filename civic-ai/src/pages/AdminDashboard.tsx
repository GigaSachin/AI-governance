import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileWarning,
  MapPin,
} from "lucide-react";

import { StatCard } from "../components/admin/StatCard";
import { ComplaintTable } from "../components/admin/ComplaintTable";
import { ComplaintFilters } from "../components/admin/ComplaintFilters";
import { ComplaintMap } from "../components/ComplaintMap";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-slate-950/90 px-6 py-5">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div>
            <p className="text-sm font-medium text-cyan-400">
              CIVIC AI
            </p>

            <h1 className="mt-1 text-2xl font-bold">
              Admin Dashboard
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Monitor and manage citizen complaints
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2">
            <span className="h-2 w-2 rounded-full bg-green-400" />
            <span className="text-sm text-slate-300">
              System Online
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-6 py-8">

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            title="Total Complaints"
            value="—"
            icon={<FileWarning size={20} />}
          />

          <StatCard
            title="Pending"
            value="—"
            icon={<Clock3 size={20} />}
          />

          <StatCard
            title="High Priority"
            value="—"
            icon={<AlertTriangle size={20} />}
          />

          <StatCard
            title="Resolved"
            value="—"
            icon={<CheckCircle2 size={20} />}
          />
        </section>

        {/* Map */}
        <section className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex items-center gap-2">
              <MapPin size={20} className="text-cyan-400" />

              <div>
                <h2 className="font-semibold">
                  Live Complaint Map
                </h2>

                <p className="text-sm text-slate-400">
                  Location-based civic issues
                </p>
              </div>
            </div>
          </div>

          <ComplaintMap />
        </section>

        {/* Complaints */}
        <section className="rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="border-b border-white/10 px-5 py-4">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="font-semibold">
                  Citizen Complaints
                </h2>

                <p className="text-sm text-slate-400">
                  Review and manage submitted complaints
                </p>
              </div>

              <ComplaintFilters />
            </div>
          </div>

          <ComplaintTable />
        </section>

      </main>
    </div>
  );
}
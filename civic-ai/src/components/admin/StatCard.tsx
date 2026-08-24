import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
}

export function StatCard({
  title,
  value,
  icon,
}: StatCardProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-400">
          {icon}
        </div>

        <span className="text-2xl font-bold">
          {value}
        </span>
      </div>

      <p className="mt-4 text-sm text-slate-400">
        {title}
      </p>
    </div>
  );
}
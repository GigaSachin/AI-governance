export function ComplaintFilters() {
  return (
    <div className="flex flex-wrap gap-2">
      <select className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none">
        <option>All Priority</option>
        <option>Critical</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <select className="rounded-lg border border-white/10 bg-slate-900 px-3 py-2 text-sm text-slate-300 outline-none">
        <option>All Status</option>
        <option>Submitted</option>
        <option>In Progress</option>
        <option>Resolved</option>
      </select>
    </div>
  );
}
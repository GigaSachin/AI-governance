import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  MapPin,
  RefreshCw,
  Search,
  ShieldCheck,
} from "lucide-react";

// =========================================================
// TYPES
// =========================================================

type Complaint = {
  request_id: string;
  raw_text?: string;
  category?: string;
  sub_category?: string;
  priority?: string;
  issue?: string;
  summary?: string;
  location?: string | null;
  latitude?: number;
  longitude?: number;
  sentiment?: string;
  status?: string;
  created_at?: string | null;
};

type ApiResponse = {
  success: boolean;
  count: number;
  complaints: Complaint[];
};

type StatusValue = "submitted" | "in_progress" | "resolved";

// =========================================================
// API
// =========================================================

const API_URL = "https://ai-governance-odgx.onrender.com/api/complaints";

const STATUS_API_URL = "https://ai-governance-odgx.onrender.com";

// =========================================================
// ADMIN DASHBOARD
// =========================================================

export function AdminDashboard() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] = useState(false);

  const [error, setError] = useState("");

  const [search, setSearch] = useState("");

  const [priority, setPriority] = useState("all");

  const [status, setStatus] = useState("all");

  const [category, setCategory] = useState("all");

  // ID of complaint whose status is currently being updated
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(
    null
  );

  // =======================================================
  // LOAD COMPLAINTS
  // =======================================================

  async function loadComplaints() {
    try {
      setError("");

      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch complaints: ${response.status}`
        );
      }

      const data: ApiResponse = await response.json();

      setComplaints(
        Array.isArray(data.complaints)
          ? data.complaints
          : []
      );
    } catch (err) {
      console.error("Admin dashboard error:", err);

      setError(
        "Could not load complaints. Make sure FastAPI is running."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // =======================================================
  // INITIAL LOAD
  // =======================================================

  useEffect(() => {
    loadComplaints();
  }, []);

  // =======================================================
  // REFRESH
  // =======================================================

  async function handleRefresh() {
    setRefreshing(true);
    await loadComplaints();
  }

  // =======================================================
  // UPDATE COMPLAINT STATUS
  // =======================================================

  async function updateComplaintStatus(
    requestId: string,
    newStatus: StatusValue
  ) {
    try {
      setUpdatingStatusId(requestId);
      setError("");

      const response = await fetch(
        `${STATUS_API_URL}/${encodeURIComponent(
          requestId
        )}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            `Failed to update status (${response.status})`
        );
      }

      if (!data?.success) {
        throw new Error(
          data?.message || "Status update failed."
        );
      }

      // Update UI immediately without waiting for refresh
      setComplaints((currentComplaints) =>
        currentComplaints.map((complaint) =>
          complaint.request_id === requestId
            ? {
                ...complaint,
                status: newStatus,
              }
            : complaint
        )
      );
    } catch (err) {
      console.error(
        "Complaint status update error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Could not update complaint status."
      );
    } finally {
      setUpdatingStatusId(null);
    }
  }

  // =======================================================
  // STATISTICS
  // =======================================================

  const stats = useMemo(() => {
    const total = complaints.length;

    const high = complaints.filter(
      (complaint) =>
        complaint.priority?.toLowerCase() === "high"
    ).length;

    const submitted = complaints.filter(
      (complaint) =>
        complaint.status?.toLowerCase() ===
        "submitted"
    ).length;

    const inProgress = complaints.filter(
      (complaint) => {
        const value =
          complaint.status?.toLowerCase();

        return (
          value === "in progress" ||
          value === "in_progress"
        );
      }
    ).length;

    const resolved = complaints.filter(
      (complaint) =>
        complaint.status?.toLowerCase() ===
        "resolved"
    ).length;

    return {
      total,
      high,
      submitted,
      inProgress,
      resolved,
    };
  }, [complaints]);

  // =======================================================
  // CATEGORY LIST
  // =======================================================

  const categories = useMemo(() => {
    return Array.from(
      new Set(
        complaints
          .map((complaint) => complaint.category)
          .filter(Boolean)
      )
    );
  }, [complaints]);

  // =======================================================
  // FILTERED COMPLAINTS
  // =======================================================

  const filteredComplaints = useMemo(() => {
    const query = search.toLowerCase().trim();

    return complaints.filter((complaint) => {
      const matchesSearch =
        !query ||
        complaint.raw_text
          ?.toLowerCase()
          .includes(query) ||
        complaint.issue
          ?.toLowerCase()
          .includes(query) ||
        complaint.summary
          ?.toLowerCase()
          .includes(query) ||
        complaint.category
          ?.toLowerCase()
          .includes(query) ||
        complaint.sub_category
          ?.toLowerCase()
          .includes(query) ||
        complaint.request_id
          ?.toLowerCase()
          .includes(query);

      const matchesPriority =
        priority === "all" ||
        complaint.priority?.toLowerCase() ===
          priority.toLowerCase();

      const normalizedStatus =
        complaint.status
          ?.toLowerCase()
          .replace("_", " ");

      const matchesStatus =
        status === "all" ||
        normalizedStatus ===
          status.toLowerCase();

      const matchesCategory =
        category === "all" ||
        complaint.category === category;

      return (
        matchesSearch &&
        matchesPriority &&
        matchesStatus &&
        matchesCategory
      );
    });
  }, [
    complaints,
    search,
    priority,
    status,
    category,
  ]);

  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <section className="min-h-screen bg-midnight px-6 py-24 text-offwhite lg:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-center py-32">
          <div className="flex items-center gap-3 text-cyan">
            <RefreshCw className="h-5 w-5 animate-spin" />
            Loading governance data...
          </div>
        </div>
      </section>
    );
  }

  // =======================================================
  // DASHBOARD
  // =======================================================

  return (
    <section className="min-h-screen bg-midnight px-6 py-20 text-offwhite lg:px-10">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}

        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="num-tag">
              ADMIN / 05
            </p>

            <h1 className="mt-3 font-display text-4xl font-semibold tracking-tight">
              Governance Dashboard
            </h1>

            <p className="mt-3 max-w-2xl text-slate-soft">
              Monitor citizen complaints, AI classifications,
              priorities and governance activity.
            </p>
          </div>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex w-fit items-center gap-2 rounded-xl border border-navy-border bg-navy/50 px-4 py-2.5 text-sm text-slate-soft transition hover:border-electric/50 hover:text-cyan disabled:opacity-50"
          >
            <RefreshCw
              className={
                refreshing
                  ? "h-4 w-4 animate-spin"
                  : "h-4 w-4"
              }
            />

            Refresh
          </button>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* STAT CARDS */}

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          <DashboardStat
            icon={
              <FileText className="h-5 w-5" />
            }
            label="Total Reports"
            value={stats.total}
          />

          <DashboardStat
            icon={
              <AlertTriangle className="h-5 w-5" />
            }
            label="High Priority"
            value={stats.high}
          />

          <DashboardStat
            icon={
              <Clock3 className="h-5 w-5" />
            }
            label="Submitted"
            value={stats.submitted}
          />

          <DashboardStat
            icon={
              <CheckCircle2 className="h-5 w-5" />
            }
            label="Resolved"
            value={stats.resolved}
          />

        </div>

        {/* FILTERS */}

        <div className="mt-8 rounded-2xl border border-navy-border bg-navy/30 p-4">
          <div className="grid gap-3 lg:grid-cols-4">

            {/* SEARCH */}

            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-soft/50" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search complaints..."
                className="w-full rounded-xl border border-navy-border bg-midnight px-10 py-2.5 text-sm text-offwhite outline-none placeholder:text-slate-soft/50 focus:border-electric"
              />
            </div>

            {/* PRIORITY */}

            <select
              value={priority}
              onChange={(event) =>
                setPriority(event.target.value)
              }
              className="rounded-xl border border-navy-border bg-midnight px-3 py-2.5 text-sm text-slate-soft outline-none focus:border-electric"
            >
              <option value="all">
                All Priorities
              </option>

              <option value="high">
                High
              </option>

              <option value="medium">
                Medium
              </option>

              <option value="low">
                Low
              </option>
            </select>

            {/* STATUS FILTER */}

            <select
              value={status}
              onChange={(event) =>
                setStatus(event.target.value)
              }
              className="rounded-xl border border-navy-border bg-midnight px-3 py-2.5 text-sm text-slate-soft outline-none focus:border-electric"
            >
              <option value="all">
                All Status
              </option>

              <option value="submitted">
                Submitted
              </option>

              <option value="in progress">
                In Progress
              </option>

              <option value="resolved">
                Resolved
              </option>
            </select>

            {/* CATEGORY */}

            <select
              value={category}
              onChange={(event) =>
                setCategory(event.target.value)
              }
              className="rounded-xl border border-navy-border bg-midnight px-3 py-2.5 text-sm text-slate-soft outline-none focus:border-electric"
            >
              <option value="all">
                All Categories
              </option>

              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>

          </div>
        </div>

        {/* LIVE COMPLAINT MAP */}

        <div className="mt-6 rounded-2xl border border-navy-border bg-navy/30 p-5">

          <div className="mb-5 flex items-center justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold">
                Complaint Map
              </h2>

              <p className="mt-1 text-xs text-slate-soft/60">
                Live geographic distribution of citizen reports
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs text-cyan">
              <MapPin className="h-4 w-4" />
              {filteredComplaints.length} reports
            </div>
          </div>

          <ComplaintMap
            complaints={filteredComplaints}
          />

        </div>

        {/* COMPLAINT TABLE */}

        <div className="mt-6 overflow-hidden rounded-2xl border border-navy-border bg-navy/30">

          <div className="flex items-center justify-between border-b border-navy-border px-5 py-4">

            <div>
              <h2 className="font-display text-lg font-semibold">
                Citizen Complaints
              </h2>

              <p className="mt-1 text-xs text-slate-soft/60">
                Showing {filteredComplaints.length} of{" "}
                {complaints.length} reports
              </p>
            </div>

            <ShieldCheck className="h-5 w-5 text-cyan" />

          </div>

          {/* NO RESULTS */}

          {filteredComplaints.length === 0 ? (
            <div className="flex min-h-[220px] items-center justify-center text-sm text-slate-soft">
              No complaints found.
            </div>
          ) : (
            <div className="overflow-x-auto">

              <table className="w-full min-w-[1050px]">

                {/* TABLE HEADER */}

                <thead className="border-b border-navy-border bg-midnight/60">
                  <tr className="text-left text-xs uppercase tracking-wider text-slate-soft/60">

                    <th className="px-5 py-4">
                      Issue
                    </th>

                    <th className="px-5 py-4">
                      Category
                    </th>

                    <th className="px-5 py-4">
                      Priority
                    </th>

                    <th className="px-5 py-4">
                      Location
                    </th>

                    <th className="px-5 py-4">
                      Status
                    </th>

                  </tr>
                </thead>

                {/* TABLE BODY */}

                <tbody>

                  {filteredComplaints.map(
                    (complaint) => (
                      <tr
                        key={complaint.request_id}
                        className="border-b border-navy-border/50 transition hover:bg-electric/5"
                      >

                        {/* ISSUE */}

                        <td className="max-w-[320px] px-5 py-5">

                          <p className="text-sm font-medium text-offwhite">
                            {complaint.issue ||
                              "Civic Issue"}
                          </p>

                          <p className="mt-1 line-clamp-2 text-xs text-slate-soft">
                            {complaint.summary ||
                              complaint.raw_text ||
                              "No description"}
                          </p>

                          <p className="mt-2 font-mono text-[10px] text-cyan/60">
                            {complaint.request_id}
                          </p>

                        </td>

                        {/* CATEGORY */}

                        <td className="px-5 py-5">

                          <p className="text-sm">
                            {complaint.category ||
                              "—"}
                          </p>

                          <p className="mt-1 text-xs text-slate-soft">
                            {complaint.sub_category ||
                              "—"}
                          </p>

                        </td>

                        {/* PRIORITY */}

                        <td className="px-5 py-5">
                          <PriorityBadge
                            priority={
                              complaint.priority
                            }
                          />
                        </td>

                        {/* LOCATION */}

                        <td className="px-5 py-5">

                          {complaint.latitude != null &&
                          complaint.longitude != null ? (
                            <div className="flex items-center gap-2">

                              <MapPin className="h-4 w-4 text-cyan" />

                              <div className="text-xs">

                                <p>
                                  {complaint.latitude.toFixed(
                                    4
                                  )}
                                </p>

                                <p className="text-slate-soft">
                                  {complaint.longitude.toFixed(
                                    4
                                  )}
                                </p>

                              </div>

                            </div>
                          ) : (
                            <span className="text-xs text-slate-soft">
                              Not captured
                            </span>
                          )}

                        </td>

                        {/* STATUS */}

                        <td className="px-5 py-5">

                          <div className="flex flex-col gap-2">

                            <StatusBadge
                              status={
                                complaint.status
                              }
                            />

                            {/* STATUS UPDATE */}

                            <select
                              value={normalizeStatus(
                                complaint.status
                              )}
                              disabled={
                                updatingStatusId ===
                                complaint.request_id
                              }
                              onChange={(event) =>
                                updateComplaintStatus(
                                  complaint.request_id,
                                  event.target
                                    .value as StatusValue
                                )
                              }
                              className="w-fit min-w-[145px] rounded-lg border border-navy-border bg-midnight px-3 py-2 text-xs text-slate-soft outline-none transition focus:border-electric disabled:cursor-not-allowed disabled:opacity-50"
                            >

                              <option value="submitted">
                                Submitted
                              </option>

                              <option value="in_progress">
                                In Progress
                              </option>

                              <option value="resolved">
                                Resolved
                              </option>

                            </select>

                            {updatingStatusId ===
                              complaint.request_id && (
                              <div className="flex items-center gap-2 text-[11px] text-cyan">
                                <RefreshCw className="h-3 w-3 animate-spin" />
                                Updating...
                              </div>
                            )}

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>
          )}

        </div>

        {/* FOOTER INFO */}

        <div className="mt-6 flex flex-col gap-2 border-t border-navy-border pt-5 text-xs text-slate-soft/50 sm:flex-row sm:items-center sm:justify-between">

          <span>
            CIVIC AI Governance Intelligence
          </span>

          <span>
            {complaints.length} total reports
          </span>

        </div>

      </div>
    </section>
  );
}

// =========================================================
// NORMALIZE STATUS
// =========================================================

function normalizeStatus(
  status?: string
): StatusValue {
  const value =
    status?.toLowerCase().trim();

  if (
    value === "in_progress" ||
    value === "in progress"
  ) {
    return "in_progress";
  }

  if (value === "resolved") {
    return "resolved";
  }

  return "submitted";
}

// =========================================================
// COMPLAINT MAP
// =========================================================

function ComplaintMap({
  complaints,
}: {
  complaints: Complaint[];
}) {
  const locatedComplaints =
    complaints.filter(
      (complaint) =>
        Number.isFinite(
          complaint.latitude
        ) &&
        Number.isFinite(
          complaint.longitude
        )
    );

  if (locatedComplaints.length === 0) {
    return (
      <div className="flex h-72 items-center justify-center rounded-xl border border-navy-border bg-midnight/80 text-sm text-slate-soft">
        No geographic data available
      </div>
    );
  }

  const latitudes =
    locatedComplaints.map(
      (complaint) =>
        complaint.latitude as number
    );

  const longitudes =
    locatedComplaints.map(
      (complaint) =>
        complaint.longitude as number
    );

  const minLatitude =
    Math.min(...latitudes);

  const maxLatitude =
    Math.max(...latitudes);

  const minLongitude =
    Math.min(...longitudes);

  const maxLongitude =
    Math.max(...longitudes);

  const latitudeRange =
    maxLatitude - minLatitude || 1;

  const longitudeRange =
    maxLongitude - minLongitude || 1;

  return (
    <div className="relative h-72 overflow-hidden rounded-xl border border-navy-border bg-midnight/80">

      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,#64748b_1px,transparent_1px),linear-gradient(to_bottom,#64748b_1px,transparent_1px)] [background-size:10%_25%]" />

      {locatedComplaints.map(
        (complaint) => {
          const left =
            (((complaint.longitude as number) -
              minLongitude) /
              longitudeRange) *
              86 +
            7;

          const top =
            (1 -
              ((complaint.latitude as number) -
                minLatitude) /
                latitudeRange) *
              76 +
            12;

          return (
            <div
              key={complaint.request_id}
              title={`${complaint.issue || complaint.category || "Complaint"} (${complaint.latitude}, ${complaint.longitude})`}
              className="absolute h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cyan bg-electric shadow-[0_0_12px_rgba(34,211,238,0.8)]"
              style={{
                left: `${left}%`,
                top: `${top}%`,
              }}
            />
          );
        }
      )}

      <div className="absolute bottom-3 left-3 text-[10px] uppercase tracking-wider text-slate-soft/60">
        Complaint locations
      </div>

    </div>
  );
}

// =========================================================
// STAT CARD
// =========================================================

function DashboardStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number;
}) {
  return (
    <div className="rounded-2xl border border-navy-border bg-navy/40 p-5">

      <div className="flex items-center justify-between">

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-electric/30 bg-electric/10 text-cyan">
          {icon}
        </div>

        <span className="font-display text-2xl font-semibold">
          {value}
        </span>

      </div>

      <p className="mt-4 text-sm text-slate-soft">
        {label}
      </p>

    </div>
  );
}

// =========================================================
// PRIORITY BADGE
// =========================================================

function PriorityBadge({
  priority,
}: {
  priority?: string;
}) {
  const value =
    priority || "Unknown";

  const normalized =
    value.toLowerCase();

  let classes =
    "border-slate-500/30 bg-slate-500/10 text-slate-300";

  if (normalized === "high") {
    classes =
      "border-red-500/30 bg-red-500/10 text-red-300";
  } else if (
    normalized === "medium"
  ) {
    classes =
      "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";
  } else if (
    normalized === "low"
  ) {
    classes =
      "border-green-500/30 bg-green-500/10 text-green-300";
  }

  return (
    <span
      className={`rounded-full border px-3 py-1 text-xs ${classes}`}
    >
      {value}
    </span>
  );
}

// =========================================================
// STATUS BADGE
// =========================================================

function StatusBadge({
  status,
}: {
  status?: string;
}) {
  const value =
    status || "submitted";

  const displayValue =
    value
      .replace("_", " ")
      .replace(/\b\w/g, (char) =>
        char.toUpperCase()
      );

  let classes =
    "border-yellow-500/30 bg-yellow-500/10 text-yellow-300";

  if (
    value.toLowerCase() ===
    "resolved"
  ) {
    classes =
      "border-green-500/30 bg-green-500/10 text-green-300";
  } else if (
    value.toLowerCase() ===
      "in progress" ||
    value.toLowerCase() ===
      "in_progress"
  ) {
    classes =
      "border-cyan-500/30 bg-cyan-500/10 text-cyan";
  }

  return (
    <span
      className={`w-fit rounded-full border px-3 py-1 text-xs ${classes}`}
    >
      {displayValue}
    </span>
  );
}
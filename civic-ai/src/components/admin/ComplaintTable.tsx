import { useEffect, useState } from "react";
import { auth } from "../../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";

interface Complaint {
  request_id: string;
  raw_text?: string;
  category?: string;
  sub_category?: string;
  priority?: string;
  issue?: string;
  summary?: string;
  location?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  sentiment?: string;
  status?: string;
  image_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

type ComplaintStatus =
  | "submitted"
  | "in_progress"
  | "resolved";

export function ComplaintTable() {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  // =========================================================
  // FETCH COMPLAINTS
  // =========================================================

  async function fetchComplaints() {
    try {
      setError("");

      const response = await fetch(
        "https://ai-governance-odgx.onrender.com"
      );

      if (!response.ok) {
        throw new Error("Failed to load complaints.");
      }

      const data = await response.json();

      setComplaints(data.complaints || []);
    } catch (err) {
      console.error("Fetch complaints error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Failed to load complaints."
      );
    } finally {
      setLoading(false);
    }
  }

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {
    fetchComplaints();
  }, []);

  // =========================================================
  // UPDATE STATUS
  // =========================================================

  async function handleStatusChange(
    requestId: string,
    newStatus: ComplaintStatus
  ) {
    try {
      setError("");
      setUpdatingId(requestId);

      // -----------------------------------------------------
      // CHECK FIREBASE ADMIN LOGIN
      // -----------------------------------------------------

      const user = auth.currentUser;

      if (!user) {
        throw new Error(
          "Admin session expired. Please login again."
        );
      }

      // -----------------------------------------------------
      // GET FIREBASE ID TOKEN
      // -----------------------------------------------------

      const token = await user.getIdToken(true);

      // -----------------------------------------------------
      // UPDATE BACKEND
      // -----------------------------------------------------

      const response = await fetch(
        `https://ai-governance-odgx.onrender.com/complaints/${requestId}/status`,
        {
          method: "PATCH",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        throw new Error(
          data?.detail ||
            "Failed to update complaint status."
        );
      }

      // -----------------------------------------------------
      // UPDATE UI IMMEDIATELY
      // -----------------------------------------------------

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
        "Update complaint status error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Failed to update complaint status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  // =========================================================
  // STATUS LABEL
  // =========================================================

  function getStatusLabel(status?: string) {
    switch (status) {
      case "in_progress":
        return "In Progress";

      case "resolved":
        return "Resolved";

      case "submitted":
      default:
        return "Submitted";
    }
  }

  // =========================================================
  // STATUS STYLE
  // =========================================================

  function getStatusClass(status?: string) {
    switch (status) {
      case "in_progress":
        return "border-blue-400/30 bg-blue-500/10 text-blue-300";

      case "resolved":
        return "border-emerald-400/30 bg-emerald-500/10 text-emerald-300";

      case "submitted":
      default:
        return "border-yellow-400/30 bg-yellow-500/10 text-yellow-300";
    }
  }

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="px-5 py-10 text-center text-slate-500">
        Loading complaints...
      </div>
    );
  }

  // =========================================================
  // RENDER
  // =========================================================

  return (
    <div className="overflow-x-auto">

      {/* ERROR MESSAGE */}

      {error && (
        <div className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
          {error}
        </div>
      )}

      <table className="w-full text-left text-sm">

        {/* =================================================
            HEADER
        ================================================= */}

        <thead className="border-b border-white/10 text-slate-400">

          <tr>

            <th className="px-5 py-4">
              Request ID
            </th>

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

        {/* =================================================
            BODY
        ================================================= */}

        <tbody>

          {complaints.length === 0 ? (

            <tr>

              <td
                colSpan={6}
                className="px-5 py-10 text-center text-slate-500"
              >
                No complaints found.
              </td>

            </tr>

          ) : (

            complaints.map((complaint) => {

              const status =
                (complaint.status ||
                  "submitted") as ComplaintStatus;

              const isUpdating =
                updatingId ===
                complaint.request_id;

              return (

                <tr
                  key={complaint.request_id}
                  className="border-b border-white/5 hover:bg-white/[0.02]"
                >

                  {/* REQUEST ID */}

                  <td className="px-5 py-5">

                    <div className="max-w-[180px]">

                      <div
                        className="truncate font-mono text-xs text-cyan-400"
                        title={complaint.request_id}
                      >
                        {complaint.request_id}
                      </div>

                    </div>

                  </td>

                  {/* ISSUE */}

                  <td className="px-5 py-5">

                    <div className="min-w-[220px]">

                      <div className="font-medium text-white">
                        {complaint.issue ||
                          "Civic complaint"}
                      </div>

                      <div className="mt-1 text-xs text-slate-500">
                        {complaint.summary ||
                          complaint.raw_text ||
                          "No description"}
                      </div>

                    </div>

                  </td>

                  {/* CATEGORY */}

                  <td className="px-5 py-5">

                    <div className="text-white">
                      {complaint.category ||
                        "Unknown"}
                    </div>

                    {complaint.sub_category && (
                      <div className="mt-1 text-xs text-slate-500">
                        {complaint.sub_category}
                      </div>
                    )}

                  </td>

                  {/* PRIORITY */}

                  <td className="px-5 py-5">

                    <span
                      className={`
                        inline-flex
                        rounded-full
                        border
                        px-3
                        py-1
                        text-xs
                        font-medium
                        ${
                          complaint.priority?.toLowerCase() ===
                          "high"
                            ? "border-red-400/30 bg-red-500/10 text-red-300"
                            : complaint.priority?.toLowerCase() ===
                              "medium"
                            ? "border-yellow-400/30 bg-yellow-500/10 text-yellow-300"
                            : "border-slate-400/20 bg-slate-500/10 text-slate-300"
                        }
                      `}
                    >
                      {complaint.priority ||
                        "Low"}

                    </span>

                  </td>

                  {/* LOCATION */}

                  <td className="px-5 py-5">

                    <div className="text-xs text-slate-300">

                      {complaint.latitude != null &&
                      complaint.longitude != null ? (

                        <>
                          <div>
                            📍{" "}
                            {complaint.latitude.toFixed(
                              4
                            )}
                          </div>

                          <div className="text-slate-500">
                            {complaint.longitude.toFixed(
                              4
                            )}
                          </div>
                        </>

                      ) : (

                        <span className="text-slate-500">
                          Not available
                        </span>

                      )}

                    </div>

                  </td>

                  {/* STATUS */}

                  <td className="px-5 py-5">

                    <div className="flex min-w-[150px] flex-col gap-2">

                      {/* CURRENT STATUS */}

                      <span
                        className={`
                          inline-flex
                          w-fit
                          rounded-full
                          border
                          px-3
                          py-1
                          text-xs
                          font-medium
                          ${getStatusClass(status)}
                        `}
                      >
                        {getStatusLabel(status)}
                      </span>

                      {/* DROPDOWN */}

                      <select
                        value={status}
                        disabled={isUpdating}
                        onChange={(e) =>
                          handleStatusChange(
                            complaint.request_id,
                            e.target.value as ComplaintStatus
                          )
                        }
                        className="
                          rounded-lg
                          border
                          border-white/10
                          bg-[#070d27]
                          px-3
                          py-2
                          text-xs
                          text-white
                          outline-none
                          transition
                          focus:border-cyan-400
                          disabled:cursor-not-allowed
                          disabled:opacity-50
                        "
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

                      {isUpdating && (
                        <span className="text-[11px] text-cyan-400">
                          Updating...
                        </span>
                      )}

                    </div>

                  </td>

                </tr>

              );
            })

          )}

        </tbody>

      </table>

    </div>
  );
}
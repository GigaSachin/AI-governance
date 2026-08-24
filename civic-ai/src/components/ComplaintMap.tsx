import { useEffect, useMemo, useState } from "react";

import {
  MapContainer,
  TileLayer,
  CircleMarker,
  Popup,
  useMap,
} from "react-leaflet";

// Leaflet provides CSS at runtime but does not ship TypeScript declarations for it.
// @ts-expect-error -- side-effect CSS import
import "leaflet/dist/leaflet.css";

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

type ComplaintMapProps = {
  complaints?: Complaint[];
};

const API_URL = "http://127.0.0.1:8000/api/complaints";

// Default map center
const DEFAULT_CENTER: [number, number] = [
  21.4669,
  84.0167,
];


// =========================================================
// MAP VIEW CONTROLLER
// =========================================================

function MapViewController({
  complaints,
}: {
  complaints: Complaint[];
}) {
  const map = useMap();

  useEffect(() => {
    if (complaints.length === 0) {
      return;
    }

    const validComplaints = complaints.filter(
      (complaint) =>
        typeof complaint.latitude === "number" &&
        typeof complaint.longitude === "number"
    );

    if (validComplaints.length === 0) {
      return;
    }

    if (validComplaints.length === 1) {
      map.setView(
        [
          validComplaints[0].latitude!,
          validComplaints[0].longitude!,
        ],
        14
      );

      return;
    }

    const bounds = validComplaints.map(
      (complaint) =>
        [
          complaint.latitude!,
          complaint.longitude!,
        ] as [number, number]
    );

    map.fitBounds(bounds, {
      padding: [40, 40],
      maxZoom: 14,
    });
  }, [complaints, map]);

  return null;
}


// =========================================================
// PRIORITY COLOR
// =========================================================

function getPriorityColor(priority?: string) {
  switch (priority?.toLowerCase()) {
    case "high":
      return "#ef4444";

    case "medium":
      return "#f59e0b";

    case "low":
      return "#22c55e";

    default:
      return "#22d3ee";
  }
}


// =========================================================
// MAIN COMPONENT
// =========================================================

export function ComplaintMap({
  complaints: incomingComplaints,
}: ComplaintMapProps) {
  const [complaints, setComplaints] = useState<Complaint[]>(
    incomingComplaints || []
  );

  const [loading, setLoading] = useState(
    !incomingComplaints
  );

  const [error, setError] = useState("");


  // =======================================================
  // FETCH COMPLAINTS
  // =======================================================

  useEffect(() => {
    if (incomingComplaints) {
      setComplaints(incomingComplaints);
      setLoading(false);
      return;
    }

    async function fetchComplaints() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(
            `HTTP ${response.status}`
          );
        }

        const data = await response.json();

        setComplaints(
          Array.isArray(data.complaints)
            ? data.complaints
            : []
        );
      } catch (err) {
        console.error(
          "Complaint map error:",
          err
        );

        setError(
          "Unable to load complaint locations."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchComplaints();
  }, [incomingComplaints]);


  // =======================================================
  // ONLY VALID GPS COMPLAINTS
  // =======================================================

  const validComplaints = useMemo(() => {
    return complaints.filter(
      (complaint) =>
        typeof complaint.latitude === "number" &&
        typeof complaint.longitude === "number" &&
        Number.isFinite(complaint.latitude) &&
        Number.isFinite(complaint.longitude)
    );
  }, [complaints]);


  // =======================================================
  // LOADING
  // =======================================================

  if (loading) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border border-navy-border bg-midnight text-sm text-slate-soft">
        Loading complaint locations...
      </div>
    );
  }


  // =======================================================
  // ERROR
  // =======================================================

  if (error) {
    return (
      <div className="flex h-[500px] items-center justify-center rounded-2xl border border-red-500/20 bg-red-500/5 text-sm text-red-300">
        {error}
      </div>
    );
  }


  // =======================================================
  // NO GPS DATA
  // =======================================================

  if (validComplaints.length === 0) {
    return (
      <div className="flex h-[500px] flex-col items-center justify-center rounded-2xl border border-navy-border bg-midnight text-center">

        <div className="mb-3 text-3xl">
          📍
        </div>

        <p className="text-sm font-medium text-offwhite">
          No complaint locations available
        </p>

        <p className="mt-1 max-w-sm text-xs text-slate-soft">
          Complaints without valid GPS coordinates
          are not displayed on the map.
        </p>

      </div>
    );
  }


  // =======================================================
  // MAP
  // =======================================================

  return (
    <div className="relative overflow-hidden rounded-2xl border border-navy-border">

      {/* MAP */}

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={12}
        scrollWheelZoom={true}
        className="h-[500px] w-full"
      >

        {/* OPENSTREETMAP */}

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />


        {/* AUTO FIT MAP */}

        <MapViewController
          complaints={validComplaints}
        />


        {/* COMPLAINT MARKERS */}

        {validComplaints.map(
          (complaint) => {

            const color =
              getPriorityColor(
                complaint.priority
              );

            return (
              <CircleMarker
                key={complaint.request_id}
                center={[
                  complaint.latitude!,
                  complaint.longitude!,
                ]}
                radius={9}
                pathOptions={{
                  color,
                  fillColor: color,
                  fillOpacity: 0.75,
                  weight: 2,
                }}
              >

                <Popup>

                  <div className="min-w-[220px] text-slate-900">

                    {/* CATEGORY */}

                    <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                      {complaint.category ||
                        "Civic Issue"}
                    </p>


                    {/* ISSUE */}

                    <h3 className="mt-1 text-sm font-semibold">
                      {complaint.issue ||
                        "Reported Issue"}
                    </h3>


                    {/* SUMMARY */}

                    {complaint.summary && (
                      <p className="mt-2 text-xs leading-5 text-gray-600">
                        {complaint.summary}
                      </p>
                    )}


                    {/* PRIORITY */}

                    <div className="mt-3 flex items-center justify-between">

                      <span className="text-xs text-gray-500">
                        Priority
                      </span>

                      <span
                        className="rounded-full px-2 py-1 text-[10px] font-semibold"
                        style={{
                          backgroundColor:
                            `${color}20`,
                          color,
                        }}
                      >
                        {complaint.priority ||
                          "Unknown"}
                      </span>

                    </div>


                    {/* STATUS */}

                    <div className="mt-2 flex items-center justify-between">

                      <span className="text-xs text-gray-500">
                        Status
                      </span>

                      <span className="text-xs font-medium">
                        {complaint.status ||
                          "submitted"}
                      </span>

                    </div>


                    {/* GPS */}

                    <div className="mt-3 border-t border-gray-200 pt-2">

                      <p className="text-[10px] text-gray-500">
                        GPS Location
                      </p>

                      <p className="mt-1 font-mono text-[10px] text-gray-700">
                        {complaint.latitude?.toFixed(
                          6
                        )}
                        {" , "}
                        {complaint.longitude?.toFixed(
                          6
                        )}
                      </p>

                    </div>


                    {/* REQUEST ID */}

                    <p className="mt-2 font-mono text-[9px] text-gray-400">
                      ID: {complaint.request_id}
                    </p>

                  </div>

                </Popup>

              </CircleMarker>
            );
          }
        )}

      </MapContainer>


      {/* =================================================
          MAP LEGEND
      ================================================= */}

      <div className="absolute bottom-4 left-4 z-[1000] rounded-xl border border-white/10 bg-midnight/90 p-3 shadow-xl backdrop-blur">

        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-soft">
          Priority
        </p>

        <div className="space-y-1.5">

          <LegendItem
            color="#ef4444"
            label="High"
          />

          <LegendItem
            color="#f59e0b"
            label="Medium"
          />

          <LegendItem
            color="#22c55e"
            label="Low"
          />

        </div>

      </div>


      {/* =================================================
          COUNT
      ================================================= */}

      <div className="absolute right-4 top-4 z-[1000] rounded-xl border border-white/10 bg-midnight/90 px-3 py-2 backdrop-blur">

        <p className="text-[10px] uppercase tracking-wider text-slate-soft">
          Mapped Reports
        </p>

        <p className="mt-0.5 text-lg font-semibold text-cyan">
          {validComplaints.length}
        </p>

      </div>

    </div>
  );
}


// =========================================================
// LEGEND ITEM
// =========================================================

function LegendItem({
  color,
  label,
}: {
  color: string;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">

      <span
        className="h-2.5 w-2.5 rounded-full"
        style={{
          backgroundColor: color,
        }}
      />

      <span className="text-[10px] text-slate-soft">
        {label}
      </span>

    </div>
  );
}
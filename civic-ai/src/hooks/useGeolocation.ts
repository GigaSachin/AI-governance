import { useState } from "react";

type GeoStatus = "idle" | "loading" | "success" | "error";

export function useGeolocation() {
  const [status, setStatus] = useState<GeoStatus>("idle");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  const [error, setError] = useState<string | null>(null);

  function detect() {
    if (!navigator.geolocation) {
      setStatus("error");
      setError("Geolocation is not supported by this browser.");
      return;
    }

    setStatus("loading");
    setError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = position.coords;

        console.log("========== LOCATION ==========");
        console.log("Latitude:", coords.latitude);
        console.log("Longitude:", coords.longitude);
        console.log("Accuracy:", coords.accuracy, "meters");
        console.log("==============================");

        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        setAccuracy(coords.accuracy);

        setStatus("success");
      },

      (err) => {
        console.error("Geolocation Error:", err);

        setStatus("error");

        if (err.code === 1) {
          setError(
            "Location permission denied. Please allow location access."
          );
        } else if (err.code === 2) {
          setError(
            "Location unavailable. Please check your GPS or internet connection."
          );
        } else if (err.code === 3) {
          setError(
            "Location request timed out. Please try again."
          );
        } else {
          setError("Unable to detect your location.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  }

  function reset() {
    setStatus("idle");

    setLatitude(null);
    setLongitude(null);
    setAccuracy(null);

    setError(null);
  }

  return {
    status,

    latitude,
    longitude,
    accuracy,

    error,

    detect,
    reset,
  };
}
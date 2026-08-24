// @ts-expect-error Leaflet's CSS is handled by the bundler at runtime.
import "leaflet/dist/leaflet.css";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
// @ts-expect-error CSS is handled by the bundler at runtime.
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

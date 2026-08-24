import { useState, type FormEvent } from "react";
import {
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";

import { auth } from "../../lib/firebase";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      // ==========================================
      // STEP 1 — FIREBASE LOGIN
      // ==========================================

      const credential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );

      console.log("Firebase login successful:", credential.user.email);

      // ==========================================
      // STEP 2 — GET FIREBASE ID TOKEN
      // ==========================================

      const token = await credential.user.getIdToken(true);

      console.log("Firebase token received");

      // ==========================================
      // STEP 3 — VERIFY ADMIN WITH BACKEND
      // ==========================================

      const response = await fetch(
        "https://ai-governance-odgx.onrender.com",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      const data = await response.json().catch(() => null);

      console.log("Admin verification response:", data);

      // ==========================================
      // STEP 4 — BACKEND REJECTED USER
      // ==========================================

      if (!response.ok) {
        await signOut(auth);

        throw new Error(
          data?.detail ||
            "Firebase login succeeded, but this account is not an administrator."
        );
      }

      // ==========================================
      // STEP 5 — ADMIN VERIFIED
      // ==========================================

      console.log("ADMIN VERIFIED SUCCESSFULLY");

      onLogin();

    } catch (err: any) {
      console.error("Admin login error:", err);
      console.log("FIREBASE ERROR CODE:", err?.code);
      console.log("FIREBASE ERROR MESSAGE:", err?.message);

      // Firebase authentication errors
      if (err?.code === "auth/invalid-credential") {
        setError(
          "Wrong email or password. Check the Firebase Authentication user."
        );
      } else if (err?.code === "auth/invalid-email") {
        setError("Please enter a valid email address.");
      } else if (err?.code === "auth/user-not-found") {
        setError("No Firebase account exists with this email.");
      } else if (err?.code === "auth/wrong-password") {
        setError("Incorrect password.");
      } else if (err?.code === "auth/too-many-requests") {
        setError(
          "Too many login attempts. Please wait and try again."
        );
      } else if (err?.code === "auth/network-request-failed") {
        setError(
          "Network error. Check your internet connection."
        );
      } else {
        // Backend / other errors
        setError(
          err?.message ||
            "Unable to login. Please try again."
        );
      }

    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#05091f] flex items-center justify-center px-4">

      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8">

          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-blue-600/10 border border-cyan-400/30 mb-5">
            <span className="text-2xl">🔐</span>
          </div>

          <div className="text-cyan-400 text-xs tracking-[0.35em] uppercase mb-3">
            CIVIC AI
          </div>

          <h1 className="text-3xl font-bold text-white">
            Admin Portal
          </h1>

          <p className="text-slate-400 mt-3">
            Authorized administrators only
          </p>

        </div>

        {/* LOGIN CARD */}
        <form
          onSubmit={handleLogin}
          className="bg-[#0a112e] border border-white/10 rounded-2xl p-7 shadow-2xl"
        >

          {/* EMAIL */}
          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Admin Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              autoComplete="email"
              required
              className="
                w-full
                rounded-lg
                bg-[#070d27]
                border
                border-white/10
                px-4
                py-3
                text-white
                placeholder-slate-600
                outline-none
                focus:border-cyan-400
              "
            />

          </div>

          {/* PASSWORD */}
          <div className="mb-5">

            <label className="block text-sm font-medium text-slate-300 mb-2">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              required
              className="
                w-full
                rounded-lg
                bg-[#070d27]
                border
                border-white/10
                px-4
                py-3
                text-white
                placeholder-slate-600
                outline-none
                focus:border-cyan-400
              "
            />

          </div>

          {/* ERROR */}
          {error && (
            <div
              className="
                mb-5
                rounded-lg
                border
                border-red-500/30
                bg-red-500/10
                px-4
                py-3
                text-sm
                text-red-300
              "
            >
              {error}
            </div>
          )}

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              rounded-lg
              bg-blue-600
              hover:bg-blue-500
              disabled:opacity-50
              disabled:cursor-not-allowed
              text-white
              font-semibold
              py-3
              transition
            "
          >
            {loading
              ? "Authenticating..."
              : "Sign in to Dashboard"}
          </button>

          {/* SECURITY INFO */}
          <div className="mt-5 text-center">
            <p className="text-xs text-slate-500">
              🔒 Firebase protected administration
            </p>
          </div>

        </form>

      </div>

    </div>
  );
}
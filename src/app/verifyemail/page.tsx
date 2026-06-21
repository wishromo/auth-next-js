"use client";

import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const verifyUserEmail = async () => {
    if (!token || verified || loading) return;

    try {
      setLoading(true);
      setError(false);

      await axios.post("/api/users/verifyemail", { token });

      setVerified(true);
    } catch (error: any) {
      console.log(error?.response?.data || error.message);
      setError(true);
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      setToken(urlToken);
    }
  }, []);

  useEffect(() => {
    if (token && !verified) {
      verifyUserEmail();
    }
  }, [token]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-md border border-slate-700 rounded-xl p-6 bg-slate-800/50 backdrop-blur-sm shadow-xl text-center">
        <h1 className="text-3xl font-bold text-amber-400">
          Verify Email
        </h1>

        <p className="text-slate-300 mt-2">
          {loading
            ? "Verifying your email..."
            : verified
            ? "Your email has been verified."
            : "Enter your verification token"}
        </p>

        {!verified && (
          <>
            <input
              className="w-full mt-4 p-2 rounded bg-slate-700 text-white outline-none"
              placeholder="Enter token..."
              value={token}
              onChange={(e) => setToken(e.target.value)}
            />

            <button
              onClick={verifyUserEmail}
              disabled={loading || !token}
              className="w-full mt-4 py-2 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </>
        )}

        {verified && (
          <>
            <p className="mt-4 text-green-400 font-semibold">
              Email verified successfully ✔
            </p>

            <Link href="/login" className="text-blue-400 mt-4 block hover:underline">
              Go to Login
            </Link>
          </>
        )}

        {error && !verified && (
          <p className="mt-4 text-red-400 font-semibold">
            Verification failed ❌
          </p>
        )}
      </div>
    </div>
  );
}
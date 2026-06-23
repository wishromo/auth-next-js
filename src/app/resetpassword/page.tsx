"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

export default function ResetPasswordPage() {
    const [token, setToken] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlToken = params.get("token");

        if (urlToken) {
            setToken(urlToken);
        }
    }, []);

    const resetPassword = async () => {
        try {
            setLoading(true);

            const response = await axios.post("/api/users/resetpassword", {
                token,
                password,
            });

            toast.success(response.data.message);
            setSuccess(true);
        } catch (error: any) {
            console.log(error);
            toast.error(error.response?.data?.error || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <div className="w-full max-w-md border border-slate-700 rounded-xl p-6 bg-slate-800 shadow-xl">
                <h1 className="text-3xl font-bold text-center text-amber-400 flex items-center justify-center gap-2">
                    {loading && (
                        <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    Reset Password
                </h1>

                <p className="text-center text-slate-300 mt-2">
                    Enter your new password
                </p>

                <input
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading || success}
                    className="w-full mt-6 px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white disabled:opacity-50"
                />

                {!success && (
                    <button
                        onClick={resetPassword}
                        disabled={!password || loading || !token}
                        className="w-full mt-4 py-2 rounded-lg bg-amber-500 text-black font-bold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && (
                            <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        )}

                        {loading ? "Updating..." : "Reset Password"}
                    </button>
                )}

                {success && (
                    <div className="text-center mt-4">
                        <p className="text-green-400 font-semibold">
                            Password updated successfully ✔
                        </p>

                        <Link
                            href="/login"
                            className="text-blue-400 hover:underline block mt-2"
                        >
                            Go to Login
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
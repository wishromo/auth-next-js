"use client";

import axios from "axios";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "react-hot-toast";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);

    const forgotPassword = async () => {
        try {
            setLoading(true);

            const response = await axios.post(
                "/api/users/forgotpassword",
                { email }
            );

            toast.success(response.data.message);
            setEmailSent(true);
        } catch (error: any) {
            toast.error(
                error.response?.data?.error || "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <div className="w-full max-w-md bg-slate-800 p-6 rounded-xl shadow-lg">

                <h1 className="text-3xl font-bold text-center text-amber-400">
                    Forgot Password
                </h1>

                <p className="text-center text-slate-300 mt-2">
                    Enter your email address to receive a password reset link.
                </p>

                <div className="mt-6">
                    <label className="block mb-2 text-sm">
                        Email Address
                    </label>

                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full p-3 rounded-lg bg-slate-700 outline-none border border-slate-600"
                    />
                </div>

                <button
                    onClick={forgotPassword}
                    disabled={loading || !email}
                    className="w-full mt-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-600 text-black font-bold disabled:opacity-50"
                >
                    {loading ? "Sending..." : "Send Reset Link"}
                </button>

                {emailSent && (
                    <p className="mt-4 text-center text-green-400">
                        Password reset email sent successfully.
                    </p>
                )}

                <div className="mt-6 text-center">
                    <Link
                        href="/login"
                        className="text-blue-400 hover:underline"
                    >
                        Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
}
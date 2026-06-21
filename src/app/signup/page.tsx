"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SignupPage() {
    const router = useRouter();

    const [user, setUser] = useState({
        username: "",
        email: "",
        password: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const onSignup = async () => {
        try {
            setLoading(true);

            const response = await axios.post("/api/users/signup", user);

            console.log("Signup success", response.data);
            toast.success("Signup successful");

            router.push("/login");
        } catch (error: unknown) {
            console.log("Signup failed", error);

            if (axios.isAxiosError(error)) {
                toast.error(
                    error.response?.data?.error ||
                    error.response?.data?.message ||
                    error.message ||
                    "Signup failed"
                );
            } else {
                toast.error("Signup failed");
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (
            user.username.trim().length > 0 &&
            user.email.trim().length > 0 &&
            user.password.trim().length > 0
        ) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <div className="w-full max-w-sm border border-slate-700 rounded-xl p-6 bg-slate-800/50 backdrop-blur-sm shadow-xl flex flex-col gap-4">

                <h1 className="text-3xl font-bold text-center text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)] flex items-center justify-center gap-2">
                    {loading && (
                        <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    {loading ? "Processing..." : "Sign Up"}
                </h1>

                <hr className="border-slate-700" />

                <div className="flex flex-col gap-1">
                    <label htmlFor="username" className="text-sm font-medium text-slate-300">
                        Username
                    </label>
                    <input
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-amber-400 outline-none text-white transition duration-150"
                        id="username"
                        type="text"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        placeholder="Enter username"
                        disabled={loading}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="email" className="text-sm font-medium text-slate-300">
                        Email
                    </label>
                    <input
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-amber-400 outline-none text-white transition duration-150"
                        id="email"
                        type="email"
                        value={user.email}
                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                        placeholder="Enter email"
                        disabled={loading}
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label htmlFor="password" className="text-sm font-medium text-slate-300">
                        Password
                    </label>
                    <input
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-amber-400 outline-none text-white transition duration-150"
                        id="password"
                        type="password"
                        value={user.password}
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                        placeholder="Enter password"
                        disabled={loading}
                    />
                </div>

                <button
                    onClick={onSignup}
                    disabled={buttonDisabled || loading}
                    className="mt-2 w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 disabled:opacity-50 text-slate-950 font-bold transition duration-150 shadow-md flex items-center justify-center gap-2"
                >
                    {loading && (
                        <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                    )}

                    {loading
                        ? "Processing..."
                        : buttonDisabled
                        ? "Fill All Fields"
                        : "Register"}
                </button>

                <p className="text-sm text-center text-slate-400 mt-2">
                    Already have an account?{" "}
                    <Link href="/login" className="text-amber-400 hover:underline transition duration-150">
                        Login here
                    </Link>
                </p>
            </div>
        </div>
    );
}
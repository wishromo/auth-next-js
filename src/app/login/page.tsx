"use client";

import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
    const router = useRouter();

    const [user, setUser] = useState({
        email: "",
        password: "",
    });

    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [loading, setLoading] = useState(false);

    const onLogin = async () => {
        try {
            setLoading(true);

            const response = await axios.post("/api/users/login", user);

            console.log("Login Success:", response.data);
            toast.success("Login Successful");

            // redirect after login
            router.push("/profile");

        } catch (error: any) {
            console.log("Login Failed:", error);
            toast.error(
                error.response?.data?.error || "Login Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user.email.trim() && user.password.trim()) {
            setButtonDisabled(false);
        } else {
            setButtonDisabled(true);
        }
    }, [user]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !buttonDisabled && !loading) {
            onLogin();
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <div className="w-full max-w-sm border border-slate-700 rounded-xl p-6 bg-slate-800/50 backdrop-blur-sm shadow-xl flex flex-col gap-4">

                {/* TITLE */}
                <h1 className="text-3xl font-bold text-center text-amber-400">
                    {loading ? "Processing..." : "Login"}
                </h1>

                <hr className="border-slate-700" />

                {/* EMAIL */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-300">Email</label>
                    <input
                        type="email"
                        value={user.email}
                        onChange={(e) =>
                            setUser({ ...user, email: e.target.value })
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Enter email"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />
                </div>

                {/* PASSWORD */}
                <div className="flex flex-col gap-1">
                    <label className="text-sm text-slate-300">Password</label>
                    <input
                        type="password"
                        value={user.password}
                        onChange={(e) =>
                            setUser({ ...user, password: e.target.value })
                        }
                        onKeyDown={handleKeyDown}
                        placeholder="Enter password"
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white"
                    />

                    {/* FORGOT PASSWORD */}
                    <div className="text-right text-sm mt-1">
                        <Link
                            href="/forgotpassword"
                            className="text-amber-400 hover:underline"
                        >
                            Forgot Password?
                        </Link>
                    </div>
                </div>

                {/* LOGIN BUTTON */}
                <button
                    onClick={onLogin}
                    disabled={buttonDisabled || loading}
                    className="w-full py-2 rounded-lg bg-amber-500 text-black font-bold disabled:opacity-50"
                >
                    {loading
                        ? "Logging in..."
                        : buttonDisabled
                        ? "Fill All Fields"
                        : "Login"}
                </button>

                {/* SIGNUP LINK */}
                <p className="text-sm text-center text-slate-400">
                    Don't have an account?{" "}
                    <Link href="/signup" className="text-amber-400">
                        Sign Up
                    </Link>
                </p>

            </div>
        </div>
    );
}
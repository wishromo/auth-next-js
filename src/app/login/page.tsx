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

            router.push("/profile");
        } catch (error) {
            console.log("Login Failed:", error);
            toast.error("Login Failed");
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
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <div className="w-full max-w-sm border border-slate-700 rounded-xl p-6 bg-slate-800/50 backdrop-blur-sm shadow-xl flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-center text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]">
                    {loading ? "Processing..." : "Login"}
                </h1>

                <hr className="border-slate-700" />

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="email"
                        className="text-sm font-medium text-slate-300"
                    >
                        Email
                    </label>

                    <input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        value={user.email}
                        onChange={(e) =>
                            setUser((prev) => ({
                                ...prev,
                                email: e.target.value,
                            }))
                        }
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-amber-400 outline-none text-white transition duration-150"
                    />
                </div>

                <div className="flex flex-col gap-1">
                    <label
                        htmlFor="password"
                        className="text-sm font-medium text-slate-300"
                    >
                        Password
                    </label>

                    <input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        value={user.password}
                        onChange={(e) =>
                            setUser((prev) => ({
                                ...prev,
                                password: e.target.value,
                            }))
                        }
                        onKeyDown={handleKeyDown}
                        className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-amber-400 outline-none text-white transition duration-150"
                    />
                </div>

                <button
                    onClick={onLogin}
                    disabled={buttonDisabled || loading}
                    className="mt-2 w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:bg-amber-800 disabled:opacity-50 text-slate-950 font-bold transition duration-150 shadow-md"
                >
                    {buttonDisabled
                        ? "Fill All Fields"
                        : loading
                        ? "Logging In..."
                        : "Login"}
                </button>

                <p className="text-sm text-center text-slate-400 mt-2">
                    Don't have an account?{" "}
                    <Link
                        href="/signup"
                        className="text-amber-400 hover:underline transition duration-150"
                    >
                        Sign Up Here
                    </Link>
                </p>
            </div>
        </div>
    );
} 
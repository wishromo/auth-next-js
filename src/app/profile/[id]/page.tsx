"use client";

import axios from "axios";
import React, { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { toast } from "react-hot-toast";

export default function UserProfile() {
    const router = useRouter();
    const params = useParams();

    const id = params?.id as string;

    const [loading, setLoading] = useState(false);

    const logout = async () => {
        try {
            setLoading(true);

            await axios.get("/api/users/logout");

            toast.success("Logout successful");

            router.push("/login");
        } catch (error: any) {
            console.log(error.message);
            toast.error("Logout failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">

            <div className="w-full max-w-md border border-slate-700 rounded-xl p-6 bg-slate-800/50 backdrop-blur-sm shadow-xl">

                {/* Title */}
                <h1 className="text-3xl font-bold text-center text-amber-400 flex items-center justify-center gap-2">
                    {loading && (
                        <div className="w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin"></div>
                    )}
                    Profile
                </h1>

                <hr className="my-4 border-slate-700" />

                {/* User Info */}
                <div className="text-center">
                    <p className="text-lg text-slate-300 mb-3">
                        User Profile ID
                    </p>

                    <div className="inline-block px-4 py-2 rounded-lg bg-amber-500 text-slate-950 font-bold break-all">
                        {id}
                    </div>
                </div>

                {/* Logout Button */}
                <button
                    onClick={logout}
                    disabled={loading}
                    className="w-full mt-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition duration-150 shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                    {loading && (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    )}

                    {loading ? "Logging out..." : "Logout"}
                </button>

            </div>
        </div>
    );
}
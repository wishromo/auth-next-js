"use client";

import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [data, setData] = useState("nothing");

  const logout = async () => {
    try {
      await axios.get("/api/users/logout");
      toast.success("Logout successful");
      router.push("/login");
    } catch (error: any) {
      console.log(error.message);
      toast.error("Logout failed");
    }
  };

  const getUserDetails = async () => {
    try {
      const res = await axios.get("/api/users/me");
      console.log(res.data);

      setData(res.data.data._id);
    } catch (error: any) {
      console.log(error.message);
      toast.error("Could not get user details");
      router.push("/login");
    }
  };

  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
      <div className="w-full max-w-sm border border-slate-700 rounded-xl p-6 bg-slate-800/50 shadow-xl flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-center text-amber-400">
          Profile
        </h1>

        <hr className="border-slate-700" />

        <p className="text-center text-slate-300">
          Welcome to your profile page
        </p>

        <div className="w-full rounded-lg bg-slate-900 border border-slate-700 p-4 text-center">
          <p className="text-sm text-slate-400 mb-2">User ID</p>

          <h2 className="break-words text-amber-400 font-semibold">
            {data === "nothing" ? (
              "Loading..."
            ) : (
              <Link href={`/profile/${data}`} className="hover:underline">
                {data}
              </Link>
            )}
          </h2>
        </div>

        <button
          onClick={logout}
          className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
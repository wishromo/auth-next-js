// "use client";

// import axios from "axios";
// import Link from "next/link";
// import React, { useState } from "react";
// import { toast } from "react-hot-toast";
// import { useRouter } from "next/navigation";

// export default function ProfilePage() {
//     const router = useRouter();
//     const [data, setData] = useState("nothing");

//     const logout = async () => {
//         try {
//             await axios.get("/api/users/logout");
//             toast.success("Logout successful");
//             router.push("/login");
//         } catch (error: any) {
//             console.log(error.message);
//             toast.error(error.message);
//         }
//     };

//     const getUserDetails = async () => {
//         try {
//             const res = await axios.get("/api/users/me");
//             console.log(res.data);
//             setData(res.data.data._id);
//         } catch (error: any) {
//             console.log(error.message);
//             toast.error("Could not get user details");
//         }
//     };

//     return (
//         <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
//             <div className="w-full max-w-sm border border-slate-700 rounded-xl p-6 bg-slate-800/50 backdrop-blur-sm shadow-xl flex flex-col gap-4">
//                 <h1 className="text-3xl font-bold text-center text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]">
//                     Profile
//                 </h1>

//                 <hr className="border-slate-700" />

//                 <p className="text-center text-slate-300">
//                     Welcome to your profile page
//                 </p>

//                 <div className="w-full rounded-lg bg-slate-900 border border-slate-700 p-4 text-center">
//                     <p className="text-sm text-slate-400 mb-2">User ID</p>

//                     <h2 className="break-words text-amber-400 font-semibold">
//                         {data === "nothing" ? (
//                             "Nothing"
//                         ) : (
//                             <Link
//                                 href={`/profile/${data}`}
//                                 className="hover:underline"
//                             >
//                                 {data}
//                             </Link>
//                         )}
//                     </h2>
//                 </div>

//                 <button
//                     onClick={getUserDetails}
//                     className="w-full py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold transition duration-150 shadow-md"
//                 >
//                     Get User Details
//                 </button>

//                 <button
//                     onClick={logout}
//                     className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition duration-150 shadow-md"
//                 >
//                     Logout
//                 </button>
//             </div>
//         </div>
//     );
// }

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
            toast.error(error.message);
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
        }
    };

    useEffect(() => {
        getUserDetails();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-4">
            <div className="w-full max-w-sm border border-slate-700 rounded-xl p-6 bg-slate-800/50 backdrop-blur-sm shadow-xl flex flex-col gap-4">
                <h1 className="text-3xl font-bold text-center text-amber-400 drop-shadow-[0_2px_8px_rgba(251,191,36,0.5)]">
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
                            <Link
                                href={`/profile/${data}`}
                                className="hover:underline"
                            >
                                {data}
                            </Link>
                        )}
                    </h2>
                </div>

                <button
                    onClick={logout}
                    className="w-full py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-bold transition duration-150 shadow-md"
                >
                    Logout
                </button>
            </div>
        </div>
    );
}
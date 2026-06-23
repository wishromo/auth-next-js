// import { connect } from "@/dbconfig/dbconfig";
// import User from "@/models/userModel";
// import { sendEmail } from "@/helpers/mailer";
// import { NextRequest, NextResponse } from "next/server";

// connect();

// export async function POST(request: NextRequest) {
//     try {
//         const { email } = await request.json();

//         if (!email) {
//             return NextResponse.json(
//                 { error: "Email is required" },
//                 { status: 400 }
//             );
//         }

//         const user = await User.findOne({ email });

//         if (!user) {
//             return NextResponse.json(
//                 { error: "User not found" },
//                 { status: 404 }
//             );
//         }

//         await sendEmail({
//             email,
//             emailType: "RESET",
//             userId: user._id,
//         });

//         return NextResponse.json({
//             message: "Password reset email sent successfully",
//             success: true,
//         });
//     } catch (error: any) {
//         return NextResponse.json(
//             { error: error.message },
//             { status: 500 }
//         );
//     }
// }
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { sendEmail } from "@/helpers/mailer";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();

        console.log("========== FORGOT PASSWORD ==========");
        console.log("EMAIL:", email);
        console.log("VERCEL DOMAIN:", process.env.DOMAIN);

        if (!email) {
            return NextResponse.json(
                { error: "Email is required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({ email });

        if (!user) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        console.log("USER FOUND:", user.email);

        await sendEmail({
            email,
            emailType: "RESET",
            userId: user._id,
        });

        console.log("RESET EMAIL SENT");

        return NextResponse.json({
            message: "Password reset email sent successfully",
            success: true,
        });
    } catch (error: any) {
        console.error("FORGOT PASSWORD ERROR:", error);

        return NextResponse.json(
            { error: error.message || "Server Error" },
            { status: 500 }
        );
    }
}
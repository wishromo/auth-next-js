import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";

connect();

export async function POST(request: NextRequest) {
    try {
        const { token, password } = await request.json();

        console.log("========== RESET PASSWORD STARTED ==========");
        console.log("TOKEN FROM FRONTEND:", token);
        console.log("PASSWORD RECEIVED:", password ? "YES" : "NO");

        if (!token || !password) {
            return NextResponse.json(
                { error: "Token and password are required" },
                { status: 400 }
            );
        }

        const user = await User.findOne({
            forgotPasswordToken: token,
            forgotPasswordTokenExpiry: { $gt: Date.now() },
        });

        console.log("USER FOUND:", user ? "YES" : "NO");

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            );
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        user.password = hashedPassword;

        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;

        await user.save();

        console.log("PASSWORD RESET SUCCESSFUL");
        console.log("========== RESET PASSWORD COMPLETED ==========");

        return NextResponse.json({
            message: "Password reset successful",
            success: true,
        });
    } catch (error: any) {
        console.error("RESET PASSWORD ERROR:", error);

        return NextResponse.json(
            { error: error.message || "Server Error" },
            { status: 500 }
        );
    }
}
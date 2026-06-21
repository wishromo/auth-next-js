import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcryptjs from "bcryptjs";
import { sendEmail } from "@/helpers/mailer";

connect();

export async function POST(request: NextRequest) {
    try {
        // ✅ safe JSON parsing
        let reqBody;
        try {
            reqBody = await request.json();
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON body" },
                { status: 400 }
            );
        }

        const { username, email, password } = reqBody || {};

        // 🔴 validate fields
        if (!username || !email || !password) {
            return NextResponse.json(
                { error: "All fields are required" },
                { status: 400 }
            );
        }

        // 🔴 email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "Invalid email format" },
                { status: 400 }
            );
        }

        // 🔴 check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists" },
                { status: 400 }
            );
        }

        // 🔐 hash password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // 🧾 create user
        const newUser = new User({
            username,
            email,
            password: hashedPassword,
            isVerified: false,
        });

        const savedUser = await newUser.save();

        // 📧 send verification email
        await sendEmail({
            email,
            emailType: "VERIFY",
            userId: savedUser._id,
        });

        // ❌ NEVER return password or full user
        return NextResponse.json({
            message: "User created successfully",
            success: true,
        });

    } catch (error: any) {
        console.error("SIGNUP ERROR:", error);

        return NextResponse.json(
            { error: error.message || "Server Error" },
            { status: 500 }
        );
    }
}
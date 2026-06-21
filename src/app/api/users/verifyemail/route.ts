// import {connect} from "@/dbconfig/dbconfig";
// import { NextRequest, NextResponse } from "next/server";
// import User from "@/models/userModel";



//  await connect()


// export async function POST(request: NextRequest){

//     try {
//         const reqBody = await request.json()
//         const {token} = reqBody
//         console.log(token);

//         const user = await User.findOne({verifyToken: token, verifyTokenExpiry: {$gt: Date.now()}});

//         if (!user) {
//             return NextResponse.json({error: "Invalid token"}, {status: 400})
//         }
//         console.log(user);

//         user.isVerified = true;
//         user.verifyToken = undefined;
//         user.verifyTokenExpiry = undefined;
//         await user.save();
        
//         return NextResponse.json({
//             message: "Email verified successfully",
//             success: true
//         })


//     } catch (error:any) {
//         return NextResponse.json({error: error.message}, {status: 500})
//     }

// }


// import { connect } from "@/dbconfig/dbconfig";
// import User from "@/models/userModel";
// import { NextRequest, NextResponse } from "next/server";
// import bcrypt from "bcryptjs";
// import crypto from "crypto";

// connect();

// export async function POST(request: NextRequest) {
//     try {
//         const body = await request.json();
//         const { username, email, password } = body;

//         // check if user exists
//         const existingUser = await User.findOne({ email });

//         if (existingUser) {
//             return NextResponse.json(
//                 { error: "User already exists" },
//                 { status: 400 }
//             );
//         }

//         // hash password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // ✅ generate verification token (FIXED)
//         const verifyToken = crypto.randomBytes(32).toString("hex");

//         // token expiry (1 hour)
//         const verifyTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

//         // create user
//         const newUser = new User({
//             username,
//             email,
//             password: hashedPassword,
//             verifyToken,
//             verifyTokenExpiry,
//             isVerified: false,
//         });

//         await newUser.save();

//         // ✅ verification link
//         const verificationLink = `http://localhost:3000/verify-email?token=${verifyToken}`;

//         console.log("Verification Link:", verificationLink);

//         return NextResponse.json({
//             message: "User created successfully. Check email for verification.",
//             success: true,
//             verificationLink, // (remove in production)
//         });
//     } catch (error: any) {
//         return NextResponse.json(
//             { error: error.message },
//             { status: 500 }
//         );
//     }
// }
import { connect } from "@/dbconfig/dbconfig";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
    try {
        const reqBody = await request.json();
        const { token } = reqBody;

        if (!token) {
            return NextResponse.json(
                { error: "Token is required" },
                { status: 400 }
            );
        }

        console.log("Received token:", token);

        // find user with valid token + not expired
        const user = await User.findOne({
            verifyToken: token,
            verifyTokenExpiry: { $gt: new Date() },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid or expired token" },
                { status: 400 }
            );
        }

        // update user
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save();

        return NextResponse.json({
            message: "Email verified successfully",
            success: true,
        });

    } catch (error: any) {
        return NextResponse.json(
            { error: error.message },
            { status: 500 }
        );
    }
}
// // import nodemailer from "nodemailer";
// const nodemailer = require("nodemailer");
// import User from "@/models/userModel";
// import bcryptjs from "bcryptjs";

// export const sendEmail = async ({ email, emailType, userId }: any) => {
//     try {
//         console.log("========== EMAIL PROCESS STARTED ==========");
//         console.log("Email:", email);
//         console.log("Email Type:", emailType);
//         console.log("User ID:", userId);

//         const hashedToken = await bcryptjs.hash(userId.toString(), 10);

//         console.log("Generated Token:", hashedToken);

//         if (emailType === "VERIFY") {
//             await User.findByIdAndUpdate(userId, {
//                 verifyToken: hashedToken,
//                 verifyTokenExpiry: Date.now() + 3600000,
//             });
//         } else if (emailType === "RESET") {
//             await User.findByIdAndUpdate(userId, {
//                 forgotPasswordToken: hashedToken,
//                 forgotPasswordTokenExpiry: Date.now() + 3600000,
//             });
//         }

//         const transport = nodemailer.createTransport({
//             host: "sandbox.smtp.mailtrap.io",
//             port: 2525,
//             auth: {
//                 user: process.env.MAILTRAP_USER!,
//                 pass: process.env.MAILTRAP_PASS!,
//             },
//         });

//         await transport.verify();

//         const baseUrl = process.env.DOMAIN;

//         console.log("DOMAIN =", baseUrl);

//         if (!baseUrl) {
//             throw new Error("DOMAIN environment variable is missing");
//         }

//         const verificationLink =
//             emailType === "VERIFY"
//                 ? `${baseUrl}/verifyemail?token=${encodeURIComponent(hashedToken)}`
//                 : `${baseUrl}/resetpassword?token=${encodeURIComponent(hashedToken)}`;

//         console.log("Verification Link:", verificationLink);

//         const mailOptions = {
//             from: process.env.MAILTRAP_SENDER || "noreply@example.com",
//             to: email,
//             subject:
//                 emailType === "VERIFY"
//                     ? "Verify your email"
//                     : "Reset your password",
//             html: `
//                 <p>Click <a href="${verificationLink}">here</a>
//                 to ${
//                     emailType === "VERIFY"
//                         ? "verify your email"
//                         : "reset your password"
//                 }</p>

//                 <p>Or copy this link:</p>
//                 <p>${verificationLink}</p>
//             `,
//         };

//         const mailResponse = await transport.sendMail(mailOptions);

//         console.log("✅ Email sent successfully");
//         return mailResponse;
//     } catch (error: any) {
//         console.log("❌ EMAIL PROCESS FAILED");
//         console.log("Error Message:", error.message);
//         throw new Error(error.message);
//     }
// };
import { Resend } from "resend";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        if (emailType === "VERIFY") {
            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000,
            });
        } else if (emailType === "RESET") {
            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000,
            });
        }

        const baseUrl = process.env.DOMAIN;

        const link =
            emailType === "VERIFY"
                ? `${baseUrl}/verifyemail?token=${encodeURIComponent(hashedToken)}`
                : `${baseUrl}/resetpassword?token=${encodeURIComponent(hashedToken)}`;

        await resend.emails.send({
            from: "onboarding@resend.dev",
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify your email"
                    : "Reset your password",
            html: `
                <p>Click <a href="${link}">here</a> to ${
                    emailType === "VERIFY"
                        ? "verify your email"
                        : "reset your password"
                }</p>
                <p>Or copy this link:</p>
                <p>${link}</p>
            `,
        });

        return true;
    } catch (error: any) {
        console.error(error);
        throw new Error(error.message);
    }
};
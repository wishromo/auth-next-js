// // // import nodemailer from "nodemailer";
// // const nodemailer = require("nodemailer");
// // import User from "@/models/userModel";
// // import bcryptjs from "bcryptjs";

// // export const sendEmail = async ({ email, emailType, userId }: any) => {
// //     try {
// //         console.log("========== EMAIL PROCESS STARTED ==========");
// //         console.log("Email:", email);
// //         console.log("Email Type:", emailType);
// //         console.log("User ID:", userId);
// //         console.log("DOMAIN =", process.env.DOMAIN); // <-- ADD THIS LINE

// //         const hashedToken = await bcryptjs.hash(userId.toString(), 10);

// //         console.log("Generated Token:", hashedToken);

// //         if (emailType === "VERIFY") {
// //             console.log("Updating verify token in database...");

// //             await User.findByIdAndUpdate(userId, {
// //                 verifyToken: hashedToken,
// //                 verifyTokenExpiry: Date.now() + 3600000,
// //             });

// //             console.log("Verify token saved successfully");
// //         } else if (emailType === "RESET") {
// //             console.log("Updating reset token in database...");

// //             await User.findByIdAndUpdate(userId, {
// //                 forgotPasswordToken: hashedToken,
// //                 forgotPasswordTokenExpiry: Date.now() + 3600000,
// //             });

// //             console.log("Reset token saved successfully");
// //         }

// //         console.log("Creating Mailtrap transporter...");

// //         const transport = nodemailer.createTransport({
// //             host: "sandbox.smtp.mailtrap.io",
// //             port: 2525,
// //             auth: {
// //                 user: process.env.MAILTRAP_USER!,
// //                 pass: process.env.MAILTRAP_PASS!,
// //             },
// //         });

// //         console.log("Verifying Mailtrap connection...");
// //         await transport.verify();

// //         console.log("✅ Mailtrap connected successfully");

// //         const verificationLink =
// //             emailType === "VERIFY"
// //                 ? `${process.env.DOMAIN}/verifyemail?token=${encodeURIComponent(hashedToken)}`
// //                 : `${process.env.DOMAIN}/resetpassword?token=${encodeURIComponent(hashedToken)}`;

// //         console.log("Verification Link:", verificationLink);

// //         const mailOptions = {
// //             from: process.env.MAILTRAP_SENDER || "noreply@example.com",
// //             to: email,
// //             subject:
// //                 emailType === "VERIFY"
// //                     ? "Verify your email"
// //                     : "Reset your password",
// //             html: `
// //                 <p>Click <a href="${verificationLink}">here</a>
// //                 to ${
// //                     emailType === "VERIFY"
// //                         ? "verify your email"
// //                         : "reset your password"
// //                 }</p>

// //                 <p>Or copy this link:</p>
// //                 <p>${verificationLink}</p>
// //             `,
// //         };

// //         console.log("Sending email...");
// //         console.log("Mail Options:", mailOptions);

// //         const mailResponse = await transport.sendMail(mailOptions);

// //         console.log("✅ Email sent successfully");
// //         console.log("Message ID:", mailResponse.messageId);
// //         console.log("Accepted:", mailResponse.accepted);
// //         console.log("Rejected:", mailResponse.rejected);
// //         console.log("Full Response:", mailResponse);

// //         console.log("========== EMAIL PROCESS COMPLETED ==========");

// //         return mailResponse;
// //     } catch (error: any) {
// //         console.log("❌ EMAIL PROCESS FAILED");
// //         console.log("Error Message:", error.message);
// //         console.log("Full Error:", error);

// //         throw new Error(error.message);
// //     }
// // };

// const nodemailer = require("nodemailer");
// import User from "@/models/userModel";
// import bcryptjs from "bcryptjs";

// export const sendEmail = async ({ email, emailType, userId }: any) => {
//     try {
//         console.log("========== EMAIL PROCESS STARTED ==========");
//         console.log("Email:", email);
//         console.log("Email Type:", emailType);
//         console.log("User ID:", userId);

//         const baseUrl = process.env.DOMAIN || process.env.NEXT_PUBLIC_DOMAIN;

//         console.log("BASE URL =", baseUrl);

//         if (!baseUrl) {
//             throw new Error("DOMAIN is missing in Vercel environment variables");
//         }

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

//         const link =
//             emailType === "VERIFY"
//                 ? `${baseUrl}/verifyemail?token=${encodeURIComponent(hashedToken)}`
//                 : `${baseUrl}/resetpassword?token=${encodeURIComponent(hashedToken)}`;

//         console.log("EMAIL LINK:", link);

//         const mailOptions = {
//             from: process.env.MAILTRAP_SENDER || "noreply@example.com",
//             to: email,
//             subject:
//                 emailType === "VERIFY"
//                     ? "Verify your email"
//                     : "Reset your password",
//             html: `
//                 <p>Click <a href="${link}">here</a>
//                 to ${
//                     emailType === "VERIFY"
//                         ? "verify your email"
//                         : "reset your password"
//                 }</p>

//                 <p>Or copy this link:</p>
//                 <p>${link}</p>
//             `,
//         };

//         const mailResponse = await transport.sendMail(mailOptions);

//         console.log("✅ Email sent successfully");
//         console.log("========== EMAIL PROCESS COMPLETED ==========");

//         return mailResponse;
//     } catch (error: any) {
//         console.log("❌ EMAIL PROCESS FAILED");
//         console.log("Error Message:", error.message);

//         throw new Error(error.message);
//     }
// };
const nodemailer = require("nodemailer");
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        console.log("========== EMAIL PROCESS STARTED ==========");
        console.log("Email:", email);
        console.log("Email Type:", emailType);
        console.log("User ID:", userId);

        const baseUrl =
            process.env.DOMAIN ||
            process.env.NEXT_PUBLIC_DOMAIN ||
            "https://auth-next-js-c7z6-hgujn1c6n-hinas-projects-aab95382.vercel.app";

        console.log("DOMAIN =", process.env.DOMAIN);
        console.log("NEXT_PUBLIC_DOMAIN =", process.env.NEXT_PUBLIC_DOMAIN);
        console.log("BASE URL =", baseUrl);

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

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER!,
                pass: process.env.MAILTRAP_PASS!,
            },
        });

        const link =
            emailType === "VERIFY"
                ? `${baseUrl}/verifyemail?token=${encodeURIComponent(hashedToken)}`
                : `${baseUrl}/resetpassword?token=${encodeURIComponent(hashedToken)}`;

        console.log("EMAIL LINK:", link);

        const mailOptions = {
            from: process.env.MAILTRAP_SENDER || "noreply@example.com",
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify your email"
                    : "Reset your password",
            html: `
                <p>Click <a href="${link}">here</a>
                to ${
                    emailType === "VERIFY"
                        ? "verify your email"
                        : "reset your password"
                }</p>

                <p>Or copy this link:</p>
                <p>${link}</p>
            `,
        };

        const mailResponse = await transport.sendMail(mailOptions);

        console.log("✅ Email sent successfully");
        console.log("========== EMAIL PROCESS COMPLETED ==========");

        return mailResponse;
    } catch (error: any) {
        console.log("❌ EMAIL PROCESS FAILED");
        console.log("Error Message:", error.message);

        throw new Error(error.message);
    }
};
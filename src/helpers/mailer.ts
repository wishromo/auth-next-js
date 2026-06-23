const nodemailer = require("nodemailer");
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        console.log("========== EMAIL PROCESS STARTED ==========");
        console.log("Email:", email);
        console.log("Email Type:", emailType);
        console.log("User ID:", userId);

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

        await transport.verify();

        // Hard-coded Vercel URL for testing
        const baseUrl =
            "https://auth-next-js-c7z6-juumjp05v-hinas-projects-aab95382.vercel.app";

        const link =
            emailType === "VERIFY"
                ? `${baseUrl}/verifyemail?token=${encodeURIComponent(hashedToken)}`
                : `${baseUrl}/resetpassword?token=${encodeURIComponent(hashedToken)}`;

        console.log("EMAIL LINK:", link);

        const mailOptions = {
            from: "noreply@example.com",
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
        };

        const mailResponse = await transport.sendMail(mailOptions);

        console.log("✅ Email sent successfully");
        console.log("========== EMAIL PROCESS COMPLETED ==========");

        return mailResponse;
    } catch (error: any) {
        console.log("❌ EMAIL PROCESS FAILED");
        console.log(error);

        throw new Error(error.message);
    }
};
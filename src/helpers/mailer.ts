import nodemailer from "nodemailer";
import User from "@/models/userModel";
import bcryptjs from "bcryptjs";

export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        console.log("========== EMAIL PROCESS STARTED ==========");
        console.log("Email:", email);
        console.log("Email Type:", emailType);
        console.log("User ID:", userId);

        const hashedToken = await bcryptjs.hash(userId.toString(), 10);

        console.log("Generated Token:", hashedToken);

        if (emailType === "VERIFY") {
            console.log("Updating verify token in database...");

            await User.findByIdAndUpdate(userId, {
                verifyToken: hashedToken,
                verifyTokenExpiry: Date.now() + 3600000,
            });

            console.log("Verify token saved successfully");
        } else if (emailType === "RESET") {
            console.log("Updating reset token in database...");

            await User.findByIdAndUpdate(userId, {
                forgotPasswordToken: hashedToken,
                forgotPasswordTokenExpiry: Date.now() + 3600000,
            });

            console.log("Reset token saved successfully");
        }

        console.log("Creating Mailtrap transporter...");

        const transport = nodemailer.createTransport({
            host: "sandbox.smtp.mailtrap.io",
            port: 2525,
            auth: {
                user: process.env.MAILTRAP_USER!,
                pass: process.env.MAILTRAP_PASS!,
            },
        });

        console.log("Verifying Mailtrap connection...");
        await transport.verify();

        console.log("✅ Mailtrap connected successfully");

        // const verificationLink =
        //     `${process.env.DOMAIN}/verifyemail?token=${hashedToken}`;

        // console.log("Verification Link:", verificationLink);
        const verificationLink =
        emailType === "VERIFY"
          ? `${process.env.DOMAIN}/verifyemail?token=${encodeURIComponent(hashedToken)}`
          : `${process.env.DOMAIN}/resetpassword?token=${encodeURIComponent(hashedToken)}`;
            console.log("Verification Link:", verificationLink);
        const mailOptions = {
            from: process.env.MAILTRAP_SENDER || "noreply@example.com",
            to: email,
            subject:
                emailType === "VERIFY"
                    ? "Verify your email"
                    : "Reset your password",
            html: `
                <p>Click <a href="${verificationLink}">here</a>
                to ${
                    emailType === "VERIFY"
                        ? "verify your email"
                        : "reset your password"
                }</p>

                <p>Or copy this link:</p>
                <p>${verificationLink}</p>
            `,
        };

        console.log("Sending email...");
        console.log("Mail Options:", mailOptions);

        const mailResponse = await transport.sendMail(mailOptions);

        console.log("✅ Email sent successfully");
        console.log("Message ID:", mailResponse.messageId);
        console.log("Accepted:", mailResponse.accepted);
        console.log("Rejected:", mailResponse.rejected);
        console.log("Full Response:", mailResponse);

        console.log("========== EMAIL PROCESS COMPLETED ==========");

        return mailResponse;
    } catch (error: any) {
        console.log("❌ EMAIL PROCESS FAILED");
        console.log("Error Message:", error.message);
        console.log("Full Error:", error);

        throw new Error(error.message);
    }
};
export const sendEmail = async ({ email, emailType, userId }: any) => {
    try {
        console.log("sendEmail called");
        console.log("email:", email);
        console.log("emailType:", emailType);
        console.log("userId:", userId);

        return true;
    } catch (error: any) {
        throw new Error(error.message);
    }
};
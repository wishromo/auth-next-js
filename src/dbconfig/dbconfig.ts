import mongoose from "mongoose";

export async function connect() {
    try {
        console.log("MONGO_URL =", process.env.MONGO_URL);

        await mongoose.connect(process.env.MONGO_URL!);

        const connection = mongoose.connection;

        connection.on("connected", () => {
            console.log("MongoDB connected successfully");
        });

    } catch (error) {
        console.log("Something went wrong!", error);
    }
}
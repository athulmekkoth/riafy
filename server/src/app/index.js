import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import 'dotenv/config';
import bookingRoute from "../routes/BookingRoute.js";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/tests";  

app.use("/book", bookingRoute);

const connectDb = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log("MongoDB Connected");
    } catch (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


app.use("/components", express.static(path.join(__dirname, "../components")));


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

const main = async () => {
    await connectDb(); 
    app.listen(8080, () => console.log("Server running on port 8080"));
};

main();

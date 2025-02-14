import express from "express";
import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import userRoutes from "./routes/user.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser";
import cors from "cors";
dotenv.config();
const app = express();

const PORT = process.env.PORT || 5001;

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173", // Your frontend URL
    credentials: true,
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .json({ message: "Something went wrong!", error: err.message });
});

app.listen(PORT, () => {
  console.log("Server is running on port : ", PORT);
  connectDB();
});

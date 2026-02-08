import dotenv from "dotenv";
import express from "express";
import connectDB from "./config/database.js";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.route.js";
import postRoutes from "./routes/post.route.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
dotenv.config({});

const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (uploaded images)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

//API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes)

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    message: "Server is running",
    success: true,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Error:", err);

  if (err instanceof multer.MulterError) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    message: "Route not found",
    success: false,
  });
});

//Start server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening on port ${PORT}`);
});

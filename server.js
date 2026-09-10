import dotenv from "dotenv";
dotenv.config();
import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";

import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import requestRoutes from "./routes/requestRoutes.js";

const app = express();

// connect DB
connectDB();

// middleware
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:3001",
  "https://petalsbysmira.in",
  "https://admin.petalsbysmira.in",
  "https://www.petalsbysmira.in",
  "https://petalsbysmira-f.vercel.app",
  "https://petalsbysmira-admin.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Setup Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  }
});
app.set("io", io);

io.on("connection", (socket) => {
  console.log("Client connected via Socket.io:", socket.id);
  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
if (process.env.NODE_ENV !== "production") app.use(morgan("dev"));

// health check
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Petals by Smira API running" });
});

// routes
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/admin", adminRoutes);
app.use("/requests", requestRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(err.status || 500)
    .json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT} [${process.env.NODE_ENV || "development"}]`,
  );
});

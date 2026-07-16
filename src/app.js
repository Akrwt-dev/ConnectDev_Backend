// src/app.js
const express = require("express");
const app = express();
app.set("trust proxy", 1);
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");
const initializeSocket = require("./utils/socket.js");

// Routers
const authRouter = require("./router/auth.js");
const profileRouter = require("./router/profile.js");
const requestRouter = require("./router/request.js");
const userRouter = require("./router/userReq.js");

const chatRouter = require("./router/chat.js");

const allowedOrigins = (process.env.CORS_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/$/, ""))
  .filter(Boolean);

// -----------------------------
// CORS configuration
// -----------------------------
const corsOptions = {
  origin: allowedOrigins,
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

// **Important**: apply CORS BEFORE routes
app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());

// -----------------------------
// Routes
// -----------------------------
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.use("/", chatRouter);

const server = http.createServer(app);
initializeSocket(server);

const PORT = Number(process.env.PORT) || 4000;

// -----------------------------
// Database & Server
// -----------------------------
connectDB()
  .then(() => {
    console.log("DB connected successfully");
    server.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });

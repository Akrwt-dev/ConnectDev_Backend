// src/app.js
const express = require("express");
const app = express();
const connectDB = require("./config/database.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Routers
const authRouter = require("./router/auth.js");
const profileRouter = require("./router/profile.js");
const requestRouter = require("./router/request.js");
const userRouter = require("./router/userReq.js");

// -----------------------------
// CORS configuration
// -----------------------------
const corsOptions = {
  origin: "http://localhost:5173",   // frontend URL
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
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

// -----------------------------
// Database & Server
// -----------------------------
connectDB()
  .then(() => {
    console.log("DB connected successfully");
    app.listen(4000, () => {
      console.log("Server running on port 4000");
    });
  })
  .catch((err) => {
    console.error("DB connection failed:", err);
  });

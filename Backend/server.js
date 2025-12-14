import express from "express";
import userRouter from "./Routes/userRoutes.js";
import Database from "./Config/db.js";
import cors from "cors";
import coureRouter from "./Routes/courseRoutes.js"
const app = express();

app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:5174"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));

// ✅ USER ROUTE ONLY
app.use("/api/users", userRouter);
app.use("/api/courses", coureRouter);

// ✅ CONNECT DB + START SERVER
try {
  await Database();
  console.log("✅ MongoDB connected successfully");

  app.listen(5200, () =>
    console.log("✅ APP Runs Successfully on Port 5200")
  );
} catch (e) {
  console.error("❌ Failed to connect to MongoDB:", e.message);
  process.exit(1);
}

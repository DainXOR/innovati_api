import express, { json } from "express";
import morgan from "morgan";

// importing routes
import studentsRoutes from "./routes/students";
import subjectsRoutes from "./routes/subjects";

// initializations
const app = new express();

// middlewares
app.use(morgan("dev"));
app.use(json());

// routes
app.use("/api/students", studentsRoutes);
app.use("/api/subjects", subjectsRoutes);

export default app;
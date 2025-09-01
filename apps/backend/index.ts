import express from "express";
import userRouter from "./routes/user";
import adminRouter from "./routes/admin";
import contestRouter from "./routes/contest";
import { prisma } from "db/client";
const app = express();

app.use(express.json());

app.use("/api/v1/users", userRouter)    
app.use("/api/v1/admin", adminRouter)
app.use("/api/v1/contest", contestRouter)   

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
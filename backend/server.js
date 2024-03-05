import path from "path"

import express from "express"
import dotenv from "dotenv";
import cookieParser  from "cookie-parser"

import authRoutes from "./routes/authroutes.js";
import messageRoutes from "./routes/messageroutes.js"
import userRoutes from "./routes/userroutes.js"


import connectToMongoDB from "./database/connection.js";
import { app, server } from "./socket/socket.js";

// const app = express();
const port = process.env.PORT || 5000;

const __dirname = path.resolve();

dotenv.config();

app.use(express.json()); // body m se data extract krne ka kaam ayega
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(express.static(path.join(__dirname,"/frontend/dist")))

app.get("*", (req,res) => {
    res.sendFile(path.join(__dirname, "frontend", "dist", "index.html"))
})

app.get("/" , (req,res) => {
    res.send("Yoii its root route ")
})

server.listen(port , () => {
    connectToMongoDB();
    console.log(`server is running at ${port}`)
});
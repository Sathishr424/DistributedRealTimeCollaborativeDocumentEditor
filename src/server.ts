import express, { Request, Response } from "express";
import authRouter from "./controllers/aut.controller";

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter)

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world!")
})

export default app;
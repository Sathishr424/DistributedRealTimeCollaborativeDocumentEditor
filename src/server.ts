import express, { Request, Response } from "express";
import authRouter from "./controllers/AuthController";
import handleError from "./middlewares/ErrorHandler";

const app = express();
app.use(express.json());

app.use("/api/auth", authRouter)

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world!")
})

app.use(handleError);

export default app;
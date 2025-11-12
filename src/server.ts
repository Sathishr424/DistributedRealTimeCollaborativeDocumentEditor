import express, { Request, Response } from "express";
import authRouter from "./controllers/AuthController";
import usersRouter from "./controllers/UserController";
import handleError from "./middlewares/ErrorHandler";
import cors from "cors";

const allowedOrigin = process.env.CLIENT_URL; // Example: your Angular or React dev server

const corsOptions = {
    origin: allowedOrigin,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
};

const app = express();

app.use(cors(corsOptions));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/users", usersRouter);

app.get("/", (req: Request, res: Response) => {
    res.send("Hello world!")
})

app.use(handleError);

export default app;
import { Router, Request, Response } from "express";
import AuthRepository from "../repositories/auth.repository.";

class AutController {
    public router = Router();
    private repo = AuthRepository;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/register", this.register);
        this.router.post("/login", this.login);
        this.router.post("/logout", this.logout);
    }

    private register(req: Request, res: Response) {
        const { email, username, password } = req.body;



    }

    private login(req: Request, res: Response) {

    }

    private logout(req: Request, res: Response) {

    }
}

export default new AutController().router;
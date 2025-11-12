import {Router, Request, Response} from "express";
import {asyncHandler} from "../utils/asyncHandler";
import AuthService from "../services/AuthService";
import {validationMiddleware} from "../middlewares/ValidationMiddleware";
import {RegisterUserDTO} from "../dto/request/RegisterUserDTO";
import {LoginUserDTO} from "../dto/request/LoginUserDTO";
import {getBearerToken} from "../helpers/helper";

class AuthController {
    public router = Router();
    public service = AuthService;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/register", validationMiddleware(RegisterUserDTO), asyncHandler(this.register.bind(this)));
        this.router.post("/login", validationMiddleware(LoginUserDTO), asyncHandler(this.login.bind(this)));
        this.router.post("/logout", asyncHandler(this.logout.bind(this)));
    }

    private async register(req: Request, res: Response) {
        await this.service.register(req.body);

        return res.status(200).json({
            success: true,
            message: "User registered successfully"
        })
    }

    private async login(req: Request, res: Response) {
        const token = await this.service.login(req.body);

        return res.status(200).json({
            success: true,
            message: "User registered successfully",
            token: token
        })
    }

    private async logout(req: Request, res: Response) {
        const token = getBearerToken(req);
        await this.service.logout(token);

        return res.status(200).json({
            success: true,
            message: "logged out successfully"
        })
    }
}

export default new AuthController().router;
import { Router, Request, Response } from "express";
import {asyncHandler} from "../utils/asyncHandler";
import {validationMiddleware} from "../middlewares/ValidationMiddleware";
import UserService from "../services/UserService";
import {RequestUserTokenDTO} from "../dto/request/RequestUserTokenDTO";
import {getBearerToken} from "../helpers/helper";

class UserController {
    public router = Router();
    public service = UserService;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.get("/me", asyncHandler(this.getUser.bind(this)));
    }

    private async getUser(req: Request, res: Response) {
        const token = getBearerToken(req);
        const user = await this.service.getUser(token);

        return res.status(200).json(user);
    }
}

export default new UserController().router;
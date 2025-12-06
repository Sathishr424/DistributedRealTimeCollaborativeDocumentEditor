import { Router, Request, Response } from "express";
import {asyncHandler} from "../utils/asyncHandler";
import {getBearerToken} from "../helpers/helper";
import DocumentService from "../services/DocumentService";
import {DocumentUserAccessResponseDTO} from "../dto/response/DocumentUserAccessResponseDTO";
import {authMiddleware} from "../middlewares/AuthMiddleware";
import {TokenNotFound} from "../exceptions/TokenNotFound";
import {ServerError} from "../exceptions/ServerError";

class DocumentController {
    public router = Router();
    public service = DocumentService;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post("/create", authMiddleware(), asyncHandler(this.createDocument.bind(this)));
        this.router.get("/user_access/:document_key", asyncHandler(this.getUserAccess.bind(this)));
    }

    private async createDocument(req: Request, res: Response) {
        const document = await this.service.createDocument(req.body.userToken);
        return res.status(200).json(document);
    }

    private async getUserAccess(req: Request, res: Response) {
        const document_key = req.params.document_key as string;

        try {
            const token = getBearerToken(req);
            const userAccess: DocumentUserAccessResponseDTO  = await this.service.getUserAccess(token, document_key);
            return res.status(200).json(userAccess);
        } catch (err) {
            if (err instanceof TokenNotFound) {
                const userAccess: DocumentUserAccessResponseDTO  = await this.service.getUserAccessForAnyone(document_key);
                return res.status(200).json(userAccess);
            }
            throw new ServerError(err);
        }
    }
}

export default new DocumentController().router;
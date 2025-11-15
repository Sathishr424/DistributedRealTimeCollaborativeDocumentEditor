import { KeyCommand } from "../KeyCommand";
import { DocumentService } from "../../DocumentService";
import CursorUpdateSubscription from "../../interfaces/CursorUpdateSubscription";

export class ShiftArrowLeftCommand implements KeyCommand {
    service: DocumentService;

    constructor(service: DocumentService) {
        this.service = service;
    }

    execute(): void {
        this.service.moveCursorLeft();
        CursorUpdateSubscription.notifyForTextSelection();
    }
}
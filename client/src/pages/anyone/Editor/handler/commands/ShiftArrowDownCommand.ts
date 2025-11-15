import { KeyCommand } from "../KeyCommand";
import { DocumentService } from "../../DocumentService";
import CursorUpdateSubscription from "../../interfaces/CursorUpdateSubscription";

export class ShiftArrowDownCommand implements KeyCommand {
    service: DocumentService;

    constructor(service: DocumentService) {
        this.service = service;
    }

    execute(): void {
        this.service.moveCursorDown();
        CursorUpdateSubscription.notifyForTextSelection();
    }
}
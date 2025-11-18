import { KeyCommand } from "../KeyCommand";
import { DocumentService } from "../../DocumentService";
import CursorUpdateSubscription from "../../utils/CursorUpdateSubscription";

export class ShiftArrowUpCommand implements KeyCommand {
    service: DocumentService;

    constructor(service: DocumentService) {
        this.service = service;
    }

    execute(): void {
        this.service.moveCursorUp();
        CursorUpdateSubscription.notifyForTextSelection();
    }
}
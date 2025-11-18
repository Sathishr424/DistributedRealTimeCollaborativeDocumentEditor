import { KeyCommand } from "../KeyCommand";
import { DocumentService } from "../../DocumentService";
import CursorUpdateSubscription from "../../interfaces/CursorUpdateSubscription";

export class CtrlBackspaceCommand implements KeyCommand {
    service: DocumentService;

    constructor(service: DocumentService) {
        this.service = service;
    }

    execute(): void {
        const pos = this.service.continuousCharacterOnLeftWithPaddingPos();
        this.service.delete(pos);
        this.service.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }
}
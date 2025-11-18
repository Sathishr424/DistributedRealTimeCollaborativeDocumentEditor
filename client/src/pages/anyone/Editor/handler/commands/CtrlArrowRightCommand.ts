import { KeyCommand } from "../KeyCommand";
import { DocumentService } from "../../DocumentService";
import CursorUpdateSubscription from "../../utils/CursorUpdateSubscription";

export class CtrlArrowRightCommand implements KeyCommand {
    service: DocumentService;

    constructor(service: DocumentService) {
        this.service = service;
    }

    execute(): void {
        const pos = this.service.continuousCharacterOnRightWithPaddingPos();
        this.service.moveCursor(pos);
        CursorUpdateSubscription.notifyForCursorUpdate();
    }
}
import {KeyCommand} from "../KeyCommand";
import {DocumentService} from "../../DocumentService";
import CursorUpdateSubscription from "../../interfaces/CursorUpdateSubscription";

export class CtrlAll implements KeyCommand {
    service: DocumentService;
    constructor(service: DocumentService) {
        this.service = service;
    }

    execute(): void {
        this.service.moveCursorToEnd();
        this.service.updatePrevCursorPosition({x: 0, y: 0});
        this.service.updateCursorPosition();
        this.service.enableTextSelection();
        CursorUpdateSubscription.notifyForTextUpdate();
    }
}
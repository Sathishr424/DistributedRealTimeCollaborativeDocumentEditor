import {KeyCommand} from "../KeyCommand";
import {DocumentService} from "../../DocumentService";
import CursorUpdateSubscription from "../../interfaces/CursorUpdateSubscription";

export class ControlAll implements KeyCommand {
    service: DocumentService;
    constructor(service: DocumentService) {
        this.service = service;
    }

    execute(): void {
        this.service.moveCursor({x: 0, y: 0});
        CursorUpdateSubscription.notifyForCursorUpdate();
        this.service.moveCursorToEnd();
        CursorUpdateSubscription.notifyForTextSelection();
        CursorUpdateSubscription.notifyForTextUpdate();
    }
}
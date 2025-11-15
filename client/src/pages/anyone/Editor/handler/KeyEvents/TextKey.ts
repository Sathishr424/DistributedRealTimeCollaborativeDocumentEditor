import {KeyEventsParent} from "../../interfaces/KeyEventsParent";
import {KeyEvent} from "../../interfaces/KeyEvent";
import {DocumentService} from "../../DocumentService";
import CursorUpdateSubscription from "../../interfaces/CursorUpdateSubscription";

export class TextKey extends KeyEventsParent implements KeyEvent{
    type = "TextKey";
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: KeyboardEvent): boolean {
        const key = e.key;

        if (key.length === 1) {
            e.preventDefault();
            this.service.handleInsertChar(key);
            return true;
        }

        return false;
    }
}
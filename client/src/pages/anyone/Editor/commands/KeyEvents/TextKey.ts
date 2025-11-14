import {KeyEventsParent} from "./KeyEventsParent";
import {KeyEvent} from "./KeyEvent";
import {DocumentService} from "../../DocumentService";

export class TextKey extends KeyEventsParent implements KeyEvent{
    type = "TextKey";
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: KeyboardEvent): boolean {
        const key = e.key;

        if (key.length === 1) {
            this.service.handleInsertChar(key);
            e.preventDefault();
            return false;
        }

        return true;
    }
}
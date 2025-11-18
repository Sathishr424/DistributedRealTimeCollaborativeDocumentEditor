import {KeyEventsParent} from "../../utils/KeyEventsParent";
import {KeyEvent} from "../../utils/KeyEvent";
import {DocumentService} from "../../DocumentService";

export class TextKey extends KeyEventsParent implements KeyEvent{
    type = "TextKey";
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: KeyboardEvent): boolean {
        const key = e.key;
        if (key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            if (this.service.isCombinationKeyEnabled("shift")) this.service.handleInsertChar(key.toUpperCase());
            else this.service.handleInsertChar(key);
            return true;
        }

        return false;
    }
}
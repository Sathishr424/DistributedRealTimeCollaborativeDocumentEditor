import {KeyEventsParent} from "../../utils/KeyEventsParent";
import {KeyEvent} from "../../utils/KeyEvent";

export class TextKey extends KeyEventsParent implements KeyEvent{
    handle(e: KeyboardEvent): boolean {
        const key = e.key;
        if (key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            e.preventDefault();
            if (this.inputController.isCombinationKeyEnabled("shift")) this.inputController.handleInsertChar(key.toUpperCase());
            else this.inputController.handleInsertChar(key);
            return true;
        }

        return false;
    }
}
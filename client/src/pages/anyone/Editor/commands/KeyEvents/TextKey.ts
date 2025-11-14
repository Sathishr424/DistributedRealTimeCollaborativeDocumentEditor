import {KeyEventsParent} from "./KeyEventsParent";
import {KeyEvent} from "./KeyEvent";
import {RawEditor} from "../../RawEditor";
import CursorUpdateSubscription from "../../interfaces/CursorUpdateSubscription";

export class TextKey extends KeyEventsParent implements KeyEvent{
    type = "TextKey";
    constructor(editor: RawEditor) {
        super(editor);
    }

    handle(e: KeyboardEvent): boolean {
        const key = e.key;

        if (key.length === 1) {
            this.editor.insert(key);
            e.preventDefault();
            return false;
        }

        return true;
    }
}
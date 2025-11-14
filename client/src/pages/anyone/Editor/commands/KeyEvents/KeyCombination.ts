import {KeyEventsParent} from "./KeyEventsParent";
import {KeyEvent} from "./KeyEvent";
import {RawEditor} from "../../RawEditor";

export class KeyCombination extends KeyEventsParent implements KeyEvent{
    type = "KeyCombination";
    constructor(editor: RawEditor) {
        super(editor);
    }

    handle(e: KeyboardEvent): boolean {
        const key = e.key;

        if (e.ctrlKey && key === 's') {
            e.preventDefault();
            console.log("Save command executed!");
            return false;
        }

        return true;
    }
}
import {KeyEventsParent} from "./KeyEventsParent";
import {KeyEvent} from "./KeyEvent";
import {RawEditor} from "../../RawEditor";

export class SpecialKeys extends KeyEventsParent implements KeyEvent{
    type = "SpecialKeys";
    constructor(editor: RawEditor) {
        super(editor);
    }

    handle(e: KeyboardEvent): boolean {
        const key = e.key;

        switch (key) {
            case "Backspace":
                e.preventDefault();
                return false;
            case "Enter":
                e.preventDefault();
                return false;
            case "ArrowLeft":
                e.preventDefault();
                return false;
            case "ArrowUp":
                e.preventDefault();
                return false;
            case "ArrowRight":
                e.preventDefault();
                return false;
            case "ArrowDown":
                e.preventDefault();
                return false;
            default:
                break;
        }

        return true;
    }
}
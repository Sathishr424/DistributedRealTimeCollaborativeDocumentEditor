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
                this.editor.backspace();
                e.preventDefault();
                return false;
            case "Enter":
                this.editor.insertNewLine();
                e.preventDefault();
                return false;
            case "ArrowLeft":
                this.editor.moveCursorLeft(1);
                e.preventDefault();
                return false;
            case "ArrowUp":
                this.editor.moveCursorUp(1);
                e.preventDefault();
                return false;
            case "ArrowRight":
                this.editor.moveCursorRight(1);
                e.preventDefault();
                return false;
            case "ArrowDown":
                this.editor.moveCursorDown(1);
                e.preventDefault();
                return false;
            default:
                break;
        }

        return true;
    }
}
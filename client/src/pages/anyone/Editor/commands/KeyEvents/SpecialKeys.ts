import {KeyEventsParent} from "./KeyEventsParent";
import {KeyEvent} from "./KeyEvent";
import {DocumentService} from "../../DocumentService";
import CursorUpdateSubscription from "../../interfaces/CursorUpdateSubscription";

export class SpecialKeys extends KeyEventsParent implements KeyEvent{
    type = "SpecialKeys";
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: KeyboardEvent): boolean {
        const key = e.key;

        let keyPress = true;
        switch (key) {
            case "Backspace":
                this.service.handleBackSpace();
                break;
            case "Enter":
                this.service.handleInsertNewLine();
                break;
            case "Tab":
                this.service.handleInsertTab();
                break;
            default:
                keyPress = false;
                break;
        }

        if (keyPress) {
            CursorUpdateSubscription.notifyForTextAndCursorUpdate();
            e.preventDefault();
            return false;
        }
        keyPress = true;
        switch (key) {
            case "ArrowLeft":
                this.service.handleArrowLeft();
                break;
            case "ArrowUp":
                this.service.handleArrowUp();
                break
            case "ArrowRight":
                this.service.handleArrowRight();
                break
            case "ArrowDown":
                this.service.handleArrowDown();
                break
            default:
                keyPress = false;
                break;
        }

        if (keyPress) {
            CursorUpdateSubscription.notifyForCursorUpdate();
            e.preventDefault();
            return false;
        }

        return true;
    }
}
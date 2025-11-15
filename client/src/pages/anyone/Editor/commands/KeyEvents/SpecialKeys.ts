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

        switch (key) {
            case "Backspace":
                this.service.handleBackSpace();
                CursorUpdateSubscription.notifyForTextAndCursorUpdate();
                e.preventDefault();
                return false;
            case "Enter":
                this.service.handleInsertNewLine();
                CursorUpdateSubscription.notifyForTextAndCursorUpdate();
                e.preventDefault();
                return false;
            case "ArrowLeft":
                this.service.handleArrowLeft();
                CursorUpdateSubscription.notifyForCursorUpdate();
                e.preventDefault();
                return false;
            case "ArrowUp":
                this.service.handleArrowUp();
                CursorUpdateSubscription.notifyForCursorUpdate();
                e.preventDefault();
                return false;
            case "ArrowRight":
                this.service.handleArrowRight();
                CursorUpdateSubscription.notifyForCursorUpdate();
                e.preventDefault();
                return false;
            case "ArrowDown":
                this.service.handleArrowDown();
                CursorUpdateSubscription.notifyForCursorUpdate();
                e.preventDefault();
                return false;
            default:
                break;
        }

        return true;
    }
}
import {KeyEventsParent} from "../KeyEventsParent";
import {KeyEvent} from "../KeyEvent";
import {DocumentService} from "../../../DocumentService";
import CursorUpdateSubscription from "../../../interfaces/CursorUpdateSubscription";

export class ShiftCombination extends KeyEventsParent implements KeyEvent {
    type = "KeyCombination.shift";

    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: KeyboardEvent): boolean {
        if (!e.shiftKey) return false;
        console.log("SHIFT PRESSED");
        const key = e.key;
        let isKeyCombination = true;
        switch (key) {
            case "ArrowLeft":
                this.service.handleArrowLeft();
                break;
            case "ArrowUp":
                this.service.handleArrowUp();
                break;
            case "ArrowRight":
                this.service.handleArrowRight();
                break;
            case "ArrowDown":
                this.service.handleArrowDown();
                break;
            default:
                isKeyCombination = false;
                break;
        }

        if (isKeyCombination) {
            e.preventDefault();
            CursorUpdateSubscription.notifyForTextSelection();
            return true;
        }

        return false;
    }
}
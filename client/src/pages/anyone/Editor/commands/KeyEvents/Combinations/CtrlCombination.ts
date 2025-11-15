import {KeyEventsParent} from "../KeyEventsParent";
import {KeyEvent} from "../KeyEvent";
import {DocumentService} from "../../../DocumentService";
import CursorUpdateSubscription from "../../../interfaces/CursorUpdateSubscription";

export class CtrlCombination extends KeyEventsParent implements KeyEvent {
    type = "KeyCombination.ctrl";

    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: KeyboardEvent): boolean {
        if (!e.ctrlKey) return false;
        console.log("CTRL PRESSED");

        const key = e.key;
        let isKeyCombination = true;
        return false;

        // TODO
        switch (key) {
            case "ArrowLeft":
                break;
            case "ArrowUp":
                break;
            case "ArrowRight":
                break;
            case "ArrowDown":
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
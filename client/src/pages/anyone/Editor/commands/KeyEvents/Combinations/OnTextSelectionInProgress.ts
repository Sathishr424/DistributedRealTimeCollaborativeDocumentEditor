import {KeyEventsParent} from "../KeyEventsParent";
import {KeyEvent} from "../KeyEvent";
import {DocumentService} from "../../../DocumentService";
import CursorUpdateSubscription from "../../../interfaces/CursorUpdateSubscription";

export class OnTextSelectionInProgress extends KeyEventsParent implements KeyEvent {
    type = "KeyCombination.shift";

    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: KeyboardEvent): boolean {
        if (!this.service.isCursorInTextSelection()) return false;
        const key = e.key;
        let isKeyCombination = true;
        switch (key) {
            case "ArrowLeft":
                this.service.handleArrowLeftOnSelectionEnd();
                break;
            case "ArrowUp":
                this.service.handleArrowUpOnSelectionEnd();
                break;
            case "ArrowRight":
                this.service.handleArrowRightOnSelectionEnd();
                break;
            case "ArrowDown":
                this.service.handleArrowDownOnSelectionEnd();
                break;
            default:
                isKeyCombination = false;
                break;
        }

        if (isKeyCombination) {
            e.preventDefault();
            CursorUpdateSubscription.notifyForCursorUpdate();
            return true;
        }

        return false;
    }
}
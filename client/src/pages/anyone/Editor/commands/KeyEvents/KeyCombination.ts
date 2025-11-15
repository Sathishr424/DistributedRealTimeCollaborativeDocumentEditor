import {KeyEventsParent} from "./KeyEventsParent";
import {KeyEvent} from "./KeyEvent";
import {DocumentService} from "../../DocumentService";
import CursorUpdateSubscription from "../../interfaces/CursorUpdateSubscription";

export class KeyCombination extends KeyEventsParent implements KeyEvent{
    type = "KeyCombination";
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: KeyboardEvent): boolean {
        const key = e.key;

        if (e.ctrlKey && key === 's') {
            e.preventDefault();
            console.log("Save command executed!");
            return false;
        }
        if (e.shiftKey) {
            console.log("SHIFT PRESSED");
            e.preventDefault();
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
                CursorUpdateSubscription.notifyForTextSelection();
                return false;
            }
        }

        return true;
    }
}
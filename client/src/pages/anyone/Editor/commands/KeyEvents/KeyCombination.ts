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
            e.preventDefault();
            switch (key) {
                case "ArrowLeft":
                    return false;
                case "ArrowUp":
                    return false;
                case "ArrowRight":
                    return false;
                case "ArrowDown":
                    return false;
            }
            return false;
        }

        return true;
    }
}
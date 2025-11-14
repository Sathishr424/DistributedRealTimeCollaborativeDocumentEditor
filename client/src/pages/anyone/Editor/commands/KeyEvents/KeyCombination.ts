import {KeyEventsParent} from "./KeyEventsParent";
import {KeyEvent} from "./KeyEvent";
import {DocumentService} from "../../DocumentService";

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

        return true;
    }
}
import {KeyEventsParent} from "../../interfaces/KeyEventsParent";
import {KeyEvent} from "../../interfaces/KeyEvent";
import {DocumentService} from "../../DocumentService";

export class KeyCombination extends KeyEventsParent implements KeyEvent{
    type = "KeyCombination";
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: KeyboardEvent): boolean {
        const key = e.key;
        let command = "";
        let add = '';
        if (e.ctrlKey) {
            command += "Ctrl";
            add = "+"
        }
        if (e.shiftKey) {
            command += add + "Shift";
            add = "+"
        }
        if (e.altKey) {
            command += add + "Alt";
            add = "+"
        }
        command += add + key;

        if (this.service.executeCommand(command)) {
            e.preventDefault();
            return true;
        }

        return false;
    }
}
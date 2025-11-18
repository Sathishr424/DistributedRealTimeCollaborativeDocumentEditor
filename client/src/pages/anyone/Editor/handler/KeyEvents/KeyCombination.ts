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
            command += "ctrl";
            add = "+"
            this.service.enableCombinationKey("ctrl");
        }
        if (e.shiftKey) {
            command += add + "shift";
            add = "+"
            this.service.enableCombinationKey("shift");
        }
        if (e.altKey) {
            command += add + "alt";
            add = "+"
            this.service.enableCombinationKey("alt");
        }
        if (e.metaKey) {
            command += add + "meta";
            add = "+"
            this.service.enableCombinationKey("meta");
        }
        command += add + key;

        if (this.service.executeCommand(command)) {
            e.preventDefault();
            return true;
        }

        return false;
    }
}
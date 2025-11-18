import {KeyEventsParent} from "../../utils/KeyEventsParent";
import {KeyEvent} from "../../utils/KeyEvent";
import {DocumentService} from "../../DocumentService";

export class KeyCombination extends KeyEventsParent implements KeyEvent{
    type = "KeyCombination";
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: KeyboardEvent): boolean {
        let key = e.key;
        if (key.length == 1) key = key.toLowerCase();

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
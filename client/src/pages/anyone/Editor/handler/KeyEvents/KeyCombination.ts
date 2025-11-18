import {KeyEventsParent} from "../../utils/KeyEventsParent";
import {KeyEvent} from "../../utils/KeyEvent";

export class KeyCombination extends KeyEventsParent implements KeyEvent{
    handle(e: KeyboardEvent): boolean {
        let key = e.key;
        if (key.length == 1) key = key.toLowerCase();

        let command = "";
        let add = '';
        if (e.ctrlKey) {
            command += "ctrl";
            add = "+"
            this.inputController.enableCombinationKey("ctrl");
        }
        if (e.shiftKey) {
            command += add + "shift";
            add = "+"
            this.inputController.enableCombinationKey("shift");
        }
        if (e.altKey) {
            command += add + "alt";
            add = "+"
            this.inputController.enableCombinationKey("alt");
        }
        if (e.metaKey) {
            command += add + "meta";
            add = "+"
            this.inputController.enableCombinationKey("meta");
        }
        command += add + key;

        if (this.inputController.executeCommand(command)) {
            e.preventDefault();
            return true;
        }

        return false;
    }
}
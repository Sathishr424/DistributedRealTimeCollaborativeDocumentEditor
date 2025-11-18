import {KeyCommand, KeyCommandParent} from "../KeyCommand";
import CursorUpdateSubscription from "../../utils/CursorUpdateSubscription";

export class ShiftArrowLeftCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.layout.moveCursorLeft();
        CursorUpdateSubscription.notifyForTextSelection();
    }
}
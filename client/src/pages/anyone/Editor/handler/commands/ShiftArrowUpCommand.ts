import {KeyCommand, KeyCommandParent} from "../KeyCommand";
import CursorUpdateSubscription from "../../utils/CursorUpdateSubscription";

export class ShiftArrowUpCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.cursorOperation.moveCursorUp();
        CursorUpdateSubscription.notifyForTextSelection();
    }
}
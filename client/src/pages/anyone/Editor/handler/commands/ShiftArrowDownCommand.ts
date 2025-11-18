import {KeyCommand, KeyCommandParent} from "../KeyCommand";
import CursorUpdateSubscription from "../../utils/CursorUpdateSubscription";

export class ShiftArrowDownCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.layout.moveCursorDown();
        CursorUpdateSubscription.notifyForTextSelection();
    }
}
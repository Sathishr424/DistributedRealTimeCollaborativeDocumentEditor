import {KeyCommand, KeyCommandParent} from "../KeyCommand";
import CursorUpdateSubscription from "../../utils/CursorUpdateSubscription";

export class ShiftArrowRightCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.layout.moveCursorRight();
        CursorUpdateSubscription.notifyForTextSelection();
    }
}
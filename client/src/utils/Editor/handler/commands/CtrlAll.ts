import {KeyCommand, KeyCommandParent} from "../KeyCommand";
import CursorUpdateSubscription from "../../utils/CursorUpdateSubscription";

export class CtrlAll extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.cursorOperation.moveCursorToEnd();
        this.textController.setCursorWithinARange({x: 0, y: 0}, this.layout.calculateCursorPosition());
        this.textController.enableTextSelection();
        CursorUpdateSubscription.notifyForTextUpdate();
    }
}
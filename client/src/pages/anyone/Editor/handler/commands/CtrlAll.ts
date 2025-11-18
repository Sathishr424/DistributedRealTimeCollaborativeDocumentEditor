import {KeyCommand, KeyCommandParent} from "../KeyCommand";
import CursorUpdateSubscription from "../../utils/CursorUpdateSubscription";

export class CtrlAll extends KeyCommandParent implements KeyCommand {
    execute(): void {
        this.layout.moveCursorToEnd();
        this.textController.setCursorWithinARange({x: 0, y: 0}, this.layout.getCursorPosition());
        this.textController.enableTextSelection();
        CursorUpdateSubscription.notifyForTextUpdate();
    }
}
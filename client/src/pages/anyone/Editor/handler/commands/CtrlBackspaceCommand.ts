import {KeyCommand, KeyCommandParent} from "../KeyCommand";
import CursorUpdateSubscription from "../../utils/CursorUpdateSubscription";

export class CtrlBackspaceCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        const pos = this.layout.continuousCharacterOnLeftWithPaddingPos();
        this.textController.delete(pos);
        this.textController.checkPages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }
}
import {KeyCommand, KeyCommandParent} from "../KeyCommand";
import CursorUpdateSubscription from "../../utils/CursorUpdateSubscription";

export class CtrlArrowLeftCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        const pos = this.layout.continuousCharacterOnLeftWithPaddingPos();
        this.layout.moveCursor(pos);
        CursorUpdateSubscription.notifyForCursorUpdate();
    }
}
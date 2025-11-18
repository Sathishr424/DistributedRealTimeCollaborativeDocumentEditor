import {KeyCommand, KeyCommandParent} from "../KeyCommand";
import CursorUpdateSubscription from "../../utils/CursorUpdateSubscription";

export class CtrlArrowRightCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        const pos = this.layout.continuousCharacterOnRightWithPaddingPos();
        this.layout.moveCursor(pos);
        CursorUpdateSubscription.notifyForCursorUpdate();
    }
}
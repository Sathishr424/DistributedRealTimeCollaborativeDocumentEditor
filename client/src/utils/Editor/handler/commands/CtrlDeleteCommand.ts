import {KeyCommand, KeyCommandParent} from "../KeyCommand";
import CursorUpdateSubscription from "../../utils/CursorUpdateSubscription";
import {InsertOperationRight} from "../../utils/InsertOperationRight";

export class CtrlDeleteCommand extends KeyCommandParent implements KeyCommand {
    execute(): void {
        const pos = this.layout.continuousCharacterOnRightWithPaddingPos();
        this.textController.delete(pos, InsertOperationRight);
        this.textController.checkPages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }
}
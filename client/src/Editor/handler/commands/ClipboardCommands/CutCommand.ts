import {ClipboardEventParent} from "../../../utils/ClipboardEventParent";
import {MyClipboardEvent} from "../../../utils/MyClipboardEvent";
import CursorUpdateSubscription from "../../../utils/CursorUpdateSubscription";
import {TextController} from "../../../ServiceClasses/TextController";

export class CutCommand extends ClipboardEventParent implements MyClipboardEvent{
    handle(e: ClipboardEvent) {
        this.inputController.handleCutCommand(e);
    }
}
import {ClipboardEventParent} from "../../../utils/ClipboardEventParent";
import {MyClipboardEvent} from "../../../utils/MyClipboardEvent";

export class CopyCommand extends ClipboardEventParent implements MyClipboardEvent{
    handle(e: ClipboardEvent) {
        this.inputController.handleCopyCommand(e);
    }
}
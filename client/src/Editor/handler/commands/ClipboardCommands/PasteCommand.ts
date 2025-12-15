import {ClipboardEventParent} from "../../../utils/ClipboardEventParent";
import {MyClipboardEvent} from "../../../utils/MyClipboardEvent";
import {TextController} from "../../../ServiceClasses/TextController";

export class PasteCommand extends ClipboardEventParent implements MyClipboardEvent{
    handle(e: ClipboardEvent) {
        this.inputController.handlePasteCommand(e);
    }
}
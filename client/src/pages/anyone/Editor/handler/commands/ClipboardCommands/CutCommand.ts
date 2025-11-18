import {ClipboardEventParent} from "../../../utils/ClipboardEventParent";
import {MyClipboardEvent} from "../../../utils/MyClipboardEvent";
import CursorUpdateSubscription from "../../../utils/CursorUpdateSubscription";
import {TextController} from "../../../ServiceClasses/TextController";

export class CutCommand extends ClipboardEventParent implements MyClipboardEvent{
    constructor(textController: TextController) {
        super(textController);
    }

    handle(e: ClipboardEvent) {
        const selectedText: string = this.textController.getTextSelection();
        this.textController.deleteTextSelection();
        this.textController.checkTotalPages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
        // console.log("Cut event:",  selectedText, e.clipboardData);

        if (e.clipboardData !== null && selectedText.length > 0) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', selectedText);
        }
    }
}
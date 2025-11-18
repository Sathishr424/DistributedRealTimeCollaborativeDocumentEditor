import {DocumentService} from "../../../DocumentService";
import {ClipboardEventParent} from "../../../utils/ClipboardEventParent";
import {MyClipboardEvent} from "../../../utils/MyClipboardEvent";
import CursorUpdateSubscription from "../../../utils/CursorUpdateSubscription";

export class CutCommand extends ClipboardEventParent implements MyClipboardEvent{
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: ClipboardEvent) {
        const selectedText: string = this.service.getTextSelection();
        this.service.deleteTextSelection();
        this.service.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
        // console.log("Cut event:",  selectedText, e.clipboardData);

        if (e.clipboardData !== null && selectedText.length > 0) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', selectedText);
        }
    }
}
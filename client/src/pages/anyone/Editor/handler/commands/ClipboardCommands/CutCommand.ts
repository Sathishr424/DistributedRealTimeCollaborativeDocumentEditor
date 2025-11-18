import {DocumentService} from "../../../DocumentService";
import {ClipboardEventParent} from "../../../interfaces/ClipboardEventParent";
import {MyClipboardEvent} from "../../../interfaces/MyClipboardEvent";
import CursorUpdateSubscription from "../../../interfaces/CursorUpdateSubscription";

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
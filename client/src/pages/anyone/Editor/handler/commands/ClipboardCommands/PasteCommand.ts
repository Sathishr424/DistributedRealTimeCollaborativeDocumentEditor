import {DocumentService} from "../../../DocumentService";
import {ClipboardEventParent} from "../../../utils/ClipboardEventParent";
import {MyClipboardEvent} from "../../../utils/MyClipboardEvent";
import CursorUpdateSubscription from "../../../utils/CursorUpdateSubscription";
import {config} from "../../../utils/interfaces";

export class PasteCommand extends ClipboardEventParent implements MyClipboardEvent{
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: ClipboardEvent) {
        e.preventDefault();

        const clipboardData = e.clipboardData || (window as any).clipboardData;
        const pastedText: string = clipboardData.getData('text/plain');

        // console.log("Paste event:", clipboardData, pastedText);

        if (pastedText.length > 0) {
            const change = this.service.deleteTextSelection();
            this.service.insertText(pastedText, change);
        }
    }
}
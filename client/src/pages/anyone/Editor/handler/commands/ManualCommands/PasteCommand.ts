import {DocumentService} from "../../../DocumentService";
import {ClipboardEventParent} from "../../../interfaces/ClipboardEventParent";
import {MyClipboardEvent} from "../../../interfaces/MyClipboardEvent";
import CursorUpdateSubscription from "../../../interfaces/CursorUpdateSubscription";

export class PasteCommand extends ClipboardEventParent implements MyClipboardEvent{
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: ClipboardEvent) {
        e.preventDefault();

        const clipboardData = e.clipboardData || (window as any).clipboardData;
        const pastedText: string = clipboardData.getData('text/plain');

        console.log("Paste event:", clipboardData, pastedText);

        if (pastedText.length > 0) {
            this.service.insertText(pastedText);
            CursorUpdateSubscription.notifyForTextAndCursorUpdate();
        }
    }
}
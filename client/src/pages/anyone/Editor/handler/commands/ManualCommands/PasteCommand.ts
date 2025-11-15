import {DocumentService} from "../../../DocumentService";
import {ClipboardEventParent} from "../../../interfaces/ClipboardEventParent";
import {MyClipboardEvent} from "../../../interfaces/MyClipboardEvent";

export class PasteCommand extends ClipboardEventParent implements MyClipboardEvent{
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: ClipboardEvent) {
        e.preventDefault();

        const clipboardData = e.clipboardData || (window as any).clipboardData;
        const pastedText = clipboardData.getData('text/plain');

        if (pastedText) {
            this.service.insertText(pastedText);
        }
    }
}
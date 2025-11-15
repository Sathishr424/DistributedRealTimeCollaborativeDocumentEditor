import {DocumentService} from "../../../DocumentService";
import {ClipboardEventParent} from "../../../interfaces/ClipboardEventParent";
import {MyClipboardEvent} from "../../../interfaces/MyClipboardEvent";

export class CopyCommand extends ClipboardEventParent implements MyClipboardEvent{
    constructor(service: DocumentService) {
        super(service);
    }

    handle(e: ClipboardEvent) {
        const selectedText: string = this.service.getTextSelection();

        if (e.clipboardData && selectedText) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', selectedText);
        }
    }
}
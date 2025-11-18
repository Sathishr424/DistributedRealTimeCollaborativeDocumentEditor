import {ClipboardEventParent} from "../../../utils/ClipboardEventParent";
import {MyClipboardEvent} from "../../../utils/MyClipboardEvent";

export class CopyCommand extends ClipboardEventParent implements MyClipboardEvent{
    handle(e: ClipboardEvent) {
        const selectedText: string = this.textController.getTextSelection();
        // console.log("Copy event:",  selectedText, e.clipboardData);

        if (e.clipboardData !== null && selectedText.length > 0) {
            e.preventDefault();
            e.clipboardData.setData('text/plain', selectedText);
        }
    }
}
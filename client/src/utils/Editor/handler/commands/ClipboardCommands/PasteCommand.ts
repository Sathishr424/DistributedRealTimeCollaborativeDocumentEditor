import {ClipboardEventParent} from "../../../utils/ClipboardEventParent";
import {MyClipboardEvent} from "../../../utils/MyClipboardEvent";
import {TextController} from "../../../ServiceClasses/TextController";

export class PasteCommand extends ClipboardEventParent implements MyClipboardEvent{
    constructor(textController: TextController) {
        super(textController);
    }

    handle(e: ClipboardEvent) {
        e.preventDefault();

        const clipboardData = e.clipboardData || (window as any).clipboardData;
        const pastedText: string = clipboardData.getData('text/plain');

        // console.log("Paste event:", clipboardData, pastedText);

        if (pastedText.length > 0) {
            const change = this.textController.deleteTextSelection();
            this.textController.insertText(pastedText, change);
        }
    }
}
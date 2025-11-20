import {DocumentService} from "../DocumentService";
import {HistoryOperation, HistoryOperationParent} from "./interfaces";
import {LayoutEngine} from "../ServiceClasses/LayoutEngine";
import {TextController} from "../ServiceClasses/TextController";
import {CursorOperation} from "../ServiceClasses/CursorOperation";

export class InsertOperationRight extends HistoryOperationParent implements HistoryOperation {
    handle(cursorOperation: CursorOperation, textController: TextController): void {
        textController.insertTextFromUndoOrRedoRight(this.position, this.text);
        if (this.isTextSelection) {
            cursorOperation.enableTextSelection();
            cursorOperation.setCursorWithinARange(this.cursorPositions[0], this.cursorPositions[1]);
        } else {
            cursorOperation.updateCursorPosition(this.cursorPositions[1], false);
        }
    }
}
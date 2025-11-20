import {DocumentService} from "../DocumentService";
import {HistoryOperation, HistoryOperationParent} from "./interfaces";
import {LayoutEngine} from "../ServiceClasses/LayoutEngine";
import {TextController} from "../ServiceClasses/TextController";
import {CursorOperation} from "../ServiceClasses/CursorOperation";

export class DeleteOperationRight extends HistoryOperationParent implements HistoryOperation {
    handle(cursorOperation: CursorOperation, textController: TextController): void {
        cursorOperation.moveToPosition(this.position);
        textController.deleteRight(this.text.length);
        cursorOperation.updateCursorPosition(this.cursorPositions[1], false);
    }
}
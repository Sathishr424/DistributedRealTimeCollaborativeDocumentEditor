import {DocumentService} from "../DocumentService";
import {HistoryOperation, HistoryOperationParent, Vec2} from "./interfaces";
import {LayoutEngine} from "../ServiceClasses/LayoutEngine";
import {TextController} from "../ServiceClasses/TextController";
import {CursorOperation} from "../ServiceClasses/CursorOperation";
import CursorUpdateSubscription from "./CursorUpdateSubscription";

export class DeleteOperation extends HistoryOperationParent implements HistoryOperation {
    handle(cursorOperation: CursorOperation, textController: TextController): void {
        cursorOperation.moveToPosition(this.position);
        textController.deleteRight(this.text.length);
        cursorOperation.disableTextSelection();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }
}
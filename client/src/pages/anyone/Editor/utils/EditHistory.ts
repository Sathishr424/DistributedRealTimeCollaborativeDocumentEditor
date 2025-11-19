import {HistoryOperation} from "./interfaces";
import {InsertOperation} from "./InsertOperation";
import {DeleteOperation} from "./DeleteOperation";
import CursorUpdateSubscription from "./CursorUpdateSubscription";
import {TextController} from "../ServiceClasses/TextController";
import {CursorOperation} from "../ServiceClasses/CursorOperation";
import {InsertOperationRight} from "./InsertOperationRight";
import {DeleteOperationRight} from "./DeleteOperationRight";

export class EditHistory {
    private historyStack: HistoryOperation[] = [];
    private tempUndoStack: HistoryOperation[] = [];
    private cursorOperation: CursorOperation;
    private textController: TextController;

    constructor(cursorOperation: CursorOperation, textController: TextController) {
        this.cursorOperation = cursorOperation;
        this.textController = textController;
    }

    public addHistory(operation: HistoryOperation) {
        // console.log(operation);
        this.historyStack.push(operation);
        this.tempUndoStack = [];
    }

    private flipOperation(operation: HistoryOperation, chain: boolean): HistoryOperation | null {
        if (operation instanceof InsertOperation) {
            return new DeleteOperation(operation.position, operation.text, chain);
        } else if (operation instanceof DeleteOperation) {
            return new InsertOperation(operation.position, operation.text, chain);
        } else if (operation instanceof InsertOperationRight) {
            return new DeleteOperationRight(operation.position, operation.text, chain);
        } else if (operation instanceof DeleteOperationRight) {
            return new InsertOperationRight(operation.position, operation.text, chain);
        } else {
            return null;
        }
    }

    public undo() {
        // console.log(this.historyStack, this.tempUndoStack);
        this.doOperation(this.historyStack, this.tempUndoStack);
    }

    public redo() {
        // console.log(this.historyStack, this.tempUndoStack);
        this.doOperation(this.tempUndoStack, this.historyStack);
    }
    public doOperation(stack: HistoryOperation[], oppStack: HistoryOperation[]) {
        if (stack.length > 0) {
            const operation = stack.pop()!;
            operation.handle(this.cursorOperation, this.textController);
            oppStack.push(this.flipOperation(operation, false)!);
            while (stack.length > 0 && operation.chain) {
                const operation = stack.pop()!;
                operation.handle(this.cursorOperation, this.textController);
                oppStack.push(this.flipOperation(operation, true)!);
            }
            CursorUpdateSubscription.notifyForTextAndCursorUpdate();
        }
    }
}
import {HistoryOperation} from "./interfaces";
import {InsertOperation} from "./InsertOperation";
import {DeleteOperation} from "./DeleteOperation";
import CursorUpdateSubscription from "./CursorUpdateSubscription";
import {LayoutEngine} from "../ServiceClasses/LayoutEngine";
import {TextController} from "../ServiceClasses/TextController";

export class EditHistory {
    private historyStack: HistoryOperation[] = [];
    private tempUndoStack: HistoryOperation[] = [];
    private layout: LayoutEngine;
    private textController: TextController;

    constructor(layout: LayoutEngine, textController: TextController) {
        this.layout = layout;
        this.textController = textController;
    }

    public addHistory(operation: HistoryOperation) {
        // console.log(operation);
        this.historyStack.push(operation);
        this.tempUndoStack = [];
    }

    private flipOperation(operation: HistoryOperation, chain: boolean): HistoryOperation {
        if (operation instanceof InsertOperation) {
            return new DeleteOperation(operation.position, operation.text, chain);
        } else if (operation instanceof DeleteOperation) {
            return new InsertOperation(operation.position, operation.text, chain);
        } else {
            // For now only two types exist, so this will work
            return new InsertOperation(operation.position - operation.text.length, operation.text, chain);
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
            operation.handle(this.layout, this.textController);
            oppStack.push(this.flipOperation(operation, false));
            while (stack.length > 0 && operation.chain) {
                const operation = stack.pop()!;
                operation.handle(this.layout, this.textController);
                oppStack.push(this.flipOperation(operation, true));
            }
            CursorUpdateSubscription.notifyForTextAndCursorUpdate();
        }
    }
}
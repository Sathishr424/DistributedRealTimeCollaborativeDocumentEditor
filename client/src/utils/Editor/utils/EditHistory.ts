import {HistoryOperation, HistoryOperationParent, Vec2} from "./interfaces";
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

    public addHistory(text: string, position: number, classObject: new (position: number, text: string, chain: boolean, cursorPositions: Vec2[], isTextSelection: boolean) => HistoryOperation, chain=false) {
        const cursorPositions: Vec2[] = [];
        cursorPositions.push(this.cursorOperation.getPrevCursorPosition());
        cursorPositions.push(this.cursorOperation.getCursorPosition());
        const isTextSelection = this.cursorOperation.getIsTextSelection();
        const operation = new classObject(position, text, chain, cursorPositions, isTextSelection);

        this.historyStack.push(operation);
        this.tempUndoStack = [];
    }

    private flipOperation(operation: HistoryOperation, chain: boolean): HistoryOperation | null {
        if (operation instanceof InsertOperation) {
            return new DeleteOperation(operation.position, operation.text, chain, operation.cursorPositions, operation.isTextSelection);
        } else if (operation instanceof DeleteOperation) {
            return new InsertOperation(operation.position, operation.text, chain, operation.cursorPositions, operation.isTextSelection);
        } else if (operation instanceof InsertOperationRight) {
            return new DeleteOperationRight(operation.position, operation.text, chain, operation.cursorPositions, operation.isTextSelection);
        } else if (operation instanceof DeleteOperationRight) {
            return new InsertOperationRight(operation.position, operation.text, chain, operation.cursorPositions, operation.isTextSelection);
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
            CursorUpdateSubscription.notifyForTextUpdate();
        }
    }
}
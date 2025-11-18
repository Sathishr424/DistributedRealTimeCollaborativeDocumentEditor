import {Vec2} from "../utils/interfaces";
import CursorUpdateSubscription from "../utils/CursorUpdateSubscription";
import {CursorOperation} from "./CursorOperation";
import {LayoutEngine} from "./LayoutEngine";
import {RawEditor} from "../RawEditor";
import {InsertOperation} from "../utils/InsertOperation";
import {DeleteOperation} from "../utils/DeleteOperation";
import {EditHistory} from "../utils/EditHistory";
import {PageController} from "./PageController";

export class TextController {
    private cursorOperation: CursorOperation;
    private layout: LayoutEngine
    private editor: RawEditor;
    private editHistory: EditHistory;
    private pageController: PageController;

    constructor(cursorOperation: CursorOperation, layout: LayoutEngine, editor: RawEditor, pageController: PageController) {
        this.cursorOperation = cursorOperation;
        this.layout = layout;
        this.editor = editor;
        this.pageController = pageController;
        this.editHistory = new EditHistory(cursorOperation, this);
    }

    public undo() {
        this.editHistory.undo();
    }

    public redo() {
        this.editHistory.redo();
    }

    public backspace() {
        const deleted = this.editor.backspace();
        if (deleted.length > 0) this.editHistory.addHistory(new InsertOperation(this.editor.getCursorPosition(), deleted, false));
    }

    public delete(newPos: Vec2) {
        let realPos = this.layout.convertTo1DPosition(newPos);
        let diff = this.editor.getTotalCharsBeforeCursor().size() - realPos;

        let deleted = '';
        if (diff > 0) {
            deleted = this.deleteLeft(diff);
        } else {
            deleted = this.deleteRight(diff * -1);
        }
        if (deleted.length > 0) this.editHistory.addHistory(new InsertOperation(this.editor.getCursorPosition(), deleted, false));
        return deleted.length > 0;
    }

    public insertChar(char: string, chain=false) {
        this.editor.insert(char);
        this.editHistory.addHistory(new DeleteOperation(this.editor.getCursorPosition() - char.length, char, chain));
        this.pageController.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public insertTextFromUndoOrRedo(text: string) {
        this.editor.insertText(text);
        this.pageController.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public insertText(text: string, chain=false, isUndo=false) {
        this.editor.insertText(text);
        if (!isUndo && text.length > 0) {
            this.editHistory.addHistory(new DeleteOperation(this.editor.getCursorPosition() - text.length, text, chain));
        }
        this.pageController.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public deleteLeft(k: number): string {
        return this.editor.deleteLeft(k);
    }

    public deleteRight(k: number): string {
        return this.editor.deleteRight(k);
    }

    public setCursorWithinARange(left: Vec2, right: Vec2) {
        this.cursorOperation.setCursorWithinARange(left, right);
    }

    public enableTextSelection() {
        this.cursorOperation.enableTextSelection();
    }

    public selectCurrentWord() {
        const pos = this.layout.calculateCursorPosition();
        let node = this.editor.getTotalCharsBeforeCursor().getTail();
        const left = this.layout.continuousCharacterOnLeftPos({...pos}, node);

        node = this.editor.getTotalCharsAfterCursor().getHead();
        const right = this.layout.continuousCharacterOnRightPos({...pos}, node);

        this.cursorOperation.moveCursor(right);
        this.setCursorWithinARange(left, right);
        this.enableTextSelection();
        CursorUpdateSubscription.notifyForTextUpdate();
    }

    public selectEntireLine() {
        const pos = this.layout.calculateCursorPosition();

        const left = {x: 0, y: pos.y}
        let right = {x: this.layout.sizes.cols, y: pos.y}

        this.cursorOperation.moveCursor(right);
        this.setCursorWithinARange(left, right);
        this.enableTextSelection();
        CursorUpdateSubscription.notifyForTextUpdate();
    }

    public getTextSelection(): string {
        let pos = this.layout.convertTo1DPosition(this.cursorOperation.getPrevCursorPosition());
        return this.editor.getTextUntilPos(pos);
    }

    public deleteTextSelection(): boolean {
        if (this.isCursorInTextSelection()) {
            return this.delete(this.cursorOperation.getPrevCursorPosition());
        }
        return false;
    }

    public isCursorInTextSelection(): boolean {
        return this.cursorOperation.getIsTextSelection();
    }

    public checkPages() {
        this.pageController.handlePages();
    }
}
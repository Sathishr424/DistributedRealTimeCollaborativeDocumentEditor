import {Vec2} from "../utils/interfaces";
import CursorUpdateSubscription from "../utils/CursorUpdateSubscription";
import {CursorOperation} from "./CursorOperation";
import {LayoutEngine} from "./LayoutEngine";
import {RawEditor} from "../RawEditor";
import {InsertOperation} from "../utils/InsertOperation";
import {DeleteOperation} from "../utils/DeleteOperation";
import {EditHistory} from "../utils/EditHistory";
import {PageController} from "./PageController";
import {InsertOperationRight} from "../utils/InsertOperationRight";
import SocketClass from "./SocketClass";

export class TextController {
    private cursorOperation: CursorOperation;
    private layout: LayoutEngine
    private editor: RawEditor;
    private editHistory: EditHistory;
    private pageController: PageController;
    private socketClass: SocketClass;

    constructor(cursorOperation: CursorOperation, layout: LayoutEngine, editor: RawEditor, pageController: PageController, documentKey: string) {
        this.cursorOperation = cursorOperation;
        this.layout = layout;
        this.editor = editor;
        this.pageController = pageController;
        this.editHistory = new EditHistory(cursorOperation, this);
        this.socketClass = new SocketClass(documentKey, this);
    }

    public undo() {
        this.editHistory.undo();
    }

    public redo() {
        this.editHistory.redo();
    }

    public deleteKey() {
        const deleted = this.deleteRight(1);
        if (deleted.length > 0) this.editHistory.addHistory(deleted, this.editor.getCursorPosition(), InsertOperationRight, false);
    }

    public backspace() {
        const deleted = this.deleteLeft(1);

        if (deleted.length > 0) this.editHistory.addHistory(deleted, this.editor.getCursorPosition(), InsertOperation, false);
    }

    public delete(newPos: Vec2, classCommand=InsertOperation) {
        let realPos = this.layout.convertTo1DPosition(newPos);
        let diff = this.editor.getCursorPosition() - realPos;

        let deleted = '';
        if (diff > 0) {
            deleted = this.deleteLeft(diff);
        } else {
            deleted = this.deleteRight(diff * -1);
        }

        if (deleted.length > 0) this.editHistory.addHistory(deleted, this.editor.getCursorPosition(), classCommand, false);
        return deleted.length > 0;
    }

    public insertTextFromUndoOrRedo(pos: number, text: string) {
        this.cursorOperation.moveToPosition(pos);
        this.editor.insertText(text);
        this.pageController.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public insertTextFromUndoOrRedoRight(pos: number, text: string) {
        this.cursorOperation.moveToPosition(pos);
        this.editor.insertText(text);
        this.editor.moveLeft(text.length);
        this.pageController.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public insertInitialText(text: string) {
        this.editor.insertText(text);
        this.pageController.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public insertText(text: string, chain=false) {
        this.socketClass.emitInsert(text, this.editor.getCursorPosition(), this.editor.getCursorPosition() + text.length);
        // this.editor.insertText(text);
        // if (text.length > 0) {
        //     this.editHistory.addHistory(text, this.editor.getCursorPosition() - text.length, DeleteOperation, chain);
        // }
        // this.pageController.handlePages();
        // CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public deleteLeft(k: number): string {
        const pos = this.editor.getCursorPosition();
        this.socketClass.emitDelete(this.editor.getTextUntilPos(pos - k), pos - k, pos);
        // return this.editor.deleteLeft(k);
        return '';
    }

    public deleteRight(k: number): string {
        const pos = this.editor.getCursorPosition();
        this.socketClass.emitDelete(this.editor.getTextUntilPos(pos + k), pos, pos + k);
        // return this.editor.deleteRight(k);
        return '';
    }

    public insertTextFromServer(pos: number, text: string, isMyOperation: boolean) {
        const oldPos = this.editor.getCursorPosition();
        this.cursorOperation.moveToPosition(pos);
        this.editor.insertText(text);
        if (oldPos >= pos || isMyOperation) {
            this.cursorOperation.moveToPosition(oldPos + text.length);
        } else {
            this.cursorOperation.moveToPosition(oldPos);
        }
        this.pageController.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public deleteTextFromServer(pos: number, length: number, isMyOperation: boolean) {
        const oldPos = this.editor.getCursorPosition();
        this.cursorOperation.moveToPosition(pos);
        this.editor.deleteRight(length);
        if (oldPos >= pos || isMyOperation) {
            this.cursorOperation.moveToPosition(oldPos - Math.min(length, oldPos - pos + 1));
        } else {
            this.cursorOperation.moveToPosition(oldPos);
        }
        this.pageController.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public setCursorWithinARange(left: Vec2, right: Vec2) {
        this.cursorOperation.setCursorWithinARange(left, right);
    }

    public enableTextSelection() {
        this.cursorOperation.enableTextSelection();
    }

    public selectCurrentWord() {
        const pos = this.layout.calculateCursorPosition();
        const left = this.layout.continuousCharacterOnLeftPos({...pos}, this.editor.getCursorPosition() - 1);

        const right = this.layout.continuousCharacterOnRightPos({...pos}, this.editor.getTotalCharsAfterCursor().length - 1);

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

    public dispose() {
        this.socketClass.dispose();
    }
}
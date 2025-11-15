import {RawEditor} from "./RawEditor";
import {DocumentRenderer} from "./DocumentRenderer";
import {CommandMap, config, DocumentSizes, Vec2} from "./interfaces/interfaces";
import {CursorOperation} from "./handler/CursorOperation";
import {KeyEvents} from "./handler/KeyEvents/KeyEvents";
import CursorUpdateSubscription from "./interfaces/CursorUpdateSubscription";
import {initializeCommands} from "./CommandRegistry";
import {ClipboardEvents} from "./handler/KeyEvents/ClipboardEvents";

export class DocumentService implements HasSubscription {
    private renderer: DocumentRenderer;
    private editor: RawEditor
    private cursorOperation: CursorOperation;
    private keyEvents: KeyEvents;
    private sizes: DocumentSizes;
    private readonly commands: CommandMap = initializeCommands(this);
    private clipboardEvents: ClipboardEvents;

    public getCommands(): CommandMap {
        return this.commands;
    }

    constructor(renderer: DocumentRenderer, editor: RawEditor, sizes: DocumentSizes) {
        this.renderer = renderer;
        this.editor = editor;
        this.sizes = sizes;

        this.cursorOperation = new CursorOperation(this);
        this.keyEvents = new KeyEvents(this);
        this.clipboardEvents = new ClipboardEvents(this);
        CursorUpdateSubscription.subscribe(this);
    }

    private getCorrectPosition(x: number, y: number): Vec2 {
        x -= this.sizes.left;
        y -= this.sizes.top;
        x += (x % this.sizes.charWidth);
        return {x: Math.floor(x / this.sizes.charWidth), y: Math.floor(y / this.sizes.height)};
    }

    public drawCursor(pos: Vec2): void {
        this.renderer.renderCursor(pos);
    }

    public getCursorPositionsStartAndEnd(): Vec2[] {
        let start = this.cursorOperation.getPrevCursorPosition();
        let end = this.cursorOperation.getCursorPosition()
        if (start.y > end.y || (start.y == end.y && start.x > end.x)) {
            [start, end] = [end, start];
        }

        return [start, end];
    }

    public isCursorInTextSelection(): boolean {
        return this.cursorOperation.getIsTextSelection();
    }

    notify(usage: string): void {
        if (usage !== "TEXT OPERATION") return;

        if (this.isCursorInTextSelection()) {
            const [start, end] = this.getCursorPositionsStartAndEnd();

            this.renderer.renderTextWithSelection(start.y * this.sizes.cols + start.x, end.y * this.sizes.cols + end.x - 1);
        } else {
            this.renderer.renderText();
        }
    }

    public clearCursor(pos: Vec2): void {
        this.renderer.clearCursor(pos);
    }

    public onMouseMove(e: MouseEvent) {
        const pos = this.getCorrectPosition(e.clientX, e.clientY);
        this.cursorOperation.handleOnMouseMove(pos);
    }

    public onMouseUp(e: MouseEvent) {
        const pos = this.getCorrectPosition(e.clientX, e.clientY);
        this.cursorOperation.handleOnMouseUp(pos);
    }

    public onMouseDown(e: MouseEvent) {
        const pos = this.getCorrectPosition(e.clientX, e.clientY);
        this.cursorOperation.handleOnMouseDown(pos);
    }

    public onKeyDown(e: KeyboardEvent) {
        this.keyEvents.handle(e);
    }

    public onCopy(e: ClipboardEvent) {
        this.clipboardEvents.executeCopyCommand(e);
    }

    public onCut(e: ClipboardEvent) {
        this.clipboardEvents.executeCutCommand(e);
    }

    public onPaste(e: ClipboardEvent) {
        this.clipboardEvents.executePasteCommand(e);
    }

    public deleteTextSelection() {
        if (this.isCursorInTextSelection()) {
            this.delete(this.cursorOperation.getPrevCursorPosition());
            CursorUpdateSubscription.notifyForTextAndCursorUpdate();
            return true;
        }
        return false;
    }

    public handleBackSpace() {
        if (!this.deleteTextSelection()) this.editor.backspace();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleInsertChar(char: string) {
        this.deleteTextSelection()
        this.editor.insert(char);
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleInsertTab() {
        this.deleteTextSelection()
        for (let i=0; i<config.tabSize; i++) {
            this.handleInsertChar(" ");
        }
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleInsertNewLine() {
        this.deleteTextSelection()
        this.editor.insertNewLine();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleArrowLeft() {
        if (this.isCursorInTextSelection()) return this.handleArrowLeftOnSelectionEnd();
        this.moveCursorLeft();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }

    public handleArrowRight() {
        if (this.isCursorInTextSelection()) return this.handleArrowRightOnSelectionEnd();
        this.moveCursorRight();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }

    public handleArrowUp() {
        if (this.isCursorInTextSelection()) return this.handleArrowUpOnSelectionEnd();
        this.moveCursorUp();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }

    public handleArrowDown() {
        if (this.isCursorInTextSelection()) return this.handleArrowDownOnSelectionEnd();
        this.moveCursorDown();
        CursorUpdateSubscription.notifyForCursorUpdate();
    }

    public handleArrowLeftOnSelectionEnd() {
        const [start, end] = this.getCursorPositionsStartAndEnd();
        this.moveCursor(start);
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleArrowRightOnSelectionEnd() {
        const [start, end] = this.getCursorPositionsStartAndEnd();
        this.moveCursor(end);
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleArrowUpOnSelectionEnd() {
        const [start, end] = this.getCursorPositionsStartAndEnd();
        this.moveCursor(start);
        this.handleArrowUp();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleArrowDownOnSelectionEnd() {
        const [start, end] = this.getCursorPositionsStartAndEnd();
        this.moveCursor(end);
        this.handleArrowDown();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public executeCommand(key: string) {
        if (this.commands[key] === undefined) return false;
        console.log(key, 'command found');
        this.commands[key].execute();
        return true;
    }

    public convertTo1DPosition(pos: Vec2) {
        let index = 0;
        let row = 0;
        for (let line of this.editor.getLogicalLineLengths()) {
            let lineLength = Math.max(this.sizes.cols, line);
            let rowsLineContain = Math.ceil(lineLength / this.sizes.cols);

            row += rowsLineContain;
            if (row > pos.y) {
                let remRow = pos.y - (row - rowsLineContain);
                let possible_chars = remRow * this.sizes.cols;
                index += possible_chars;
                index += Math.min(pos.x, line - possible_chars);
                return index;
            }

            index += line + 1;
        }

        return index;
    }

    public getLastTextPosition(): Vec2 {
        let rows = 0;
        for (let i=0; i<this.editor.getLinesLength(); i++) {
            const chars = Math.max(this.sizes.cols, this.editor.getLineAtIndex(i));
            rows += Math.ceil(chars / this.sizes.cols);
        }
        const colIndex = this.editor.getLastLine();
        return {x: colIndex % this.sizes.cols, y: rows};
    }

    public moveCursorToEnd() {
        const pos = this.getLastTextPosition();
        this.moveCursor(pos);
    }

    public getCursorPosition(): Vec2 {
        let rows = 0;
        for (let i=0; i<this.editor.getLogicalLineIndex(); i++) {
            const chars = Math.max(this.sizes.cols, this.editor.getLineAtIndex(i));
            rows += Math.ceil(chars / this.sizes.cols);
        }
        const colIndex = this.editor.getLogicalColumnIndex();
        const pos: Vec2 = { x: colIndex, y: rows }

        pos.x %= this.sizes.cols;
        pos.y = pos.y + Math.floor(colIndex / this.sizes.cols);

        // console.log(this.sizes.cols, rows, colIndex, this.editor.getTotalCharsBeforeCursor().toArray(), this.editor.getLogicalLineLengths(), pos)
        return pos;
    }

    public delete(newPos: Vec2) {
        let realPos = this.convertTo1DPosition(newPos);
        let diff = this.editor.getTotalCharsBeforeCursor().size() - realPos;

        if (diff > 0) {
            this.editor.deleteLeft(diff);
        } else {
            this.editor.deleteRight(diff * -1);
        }
    }

    public moveCursor(newPos: Vec2) {
        let realPos = this.convertTo1DPosition(newPos);
        // console.log("MovePOS:", newPos, "1DPos:", realPos);
        let diff = this.editor.getTotalCharsBeforeCursor().size() - realPos;

        if (diff > 0) {
            this.editor.moveLeft(diff);
        } else {
            this.editor.moveRight(diff * -1);
        }
    }

    public moveCursorLeft() {
        this.editor.moveLeft(1);
        console.log("Moved cursor left");
    }

    public moveCursorRight() {
        this.editor.moveRight(1);
    }

    public moveCursorUp() {
        const pos = this.getCursorPosition();
        this.moveCursor({ x: pos.x, y: pos.y - 1 });
    }

    public moveCursorDown() {
        const pos = this.getCursorPosition();
        this.moveCursor({ x: pos.x, y: pos.y + 1 });
    }

    public dispose() {
        this.cursorOperation.dispose();
    }

    public insertText(text: string) {
        this.editor.insertText(text);
    }

    public getTextSelection(): string {
        let pos = this.convertTo1DPosition(this.cursorOperation.getPrevCursorPosition());
        return this.editor.getTextUntilPos(pos);
    }
}
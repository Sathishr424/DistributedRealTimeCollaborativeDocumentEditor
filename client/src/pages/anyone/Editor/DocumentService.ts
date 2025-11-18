import {RawEditor} from "./RawEditor";
import {DocumentRenderer} from "./DocumentRenderer";
import {CommandMap, config, DocumentSizes, Vec2} from "./interfaces/interfaces";
import {CursorOperation} from "./handler/CursorOperation";
import {KeyEvents} from "./handler/KeyEvents/KeyEvents";
import CursorUpdateSubscription from "./interfaces/CursorUpdateSubscription";
import {initializeCommands} from "./CommandRegistry";
import {ClipboardEvents} from "./handler/KeyEvents/ClipboardEvents";
import {CanvasContainer} from "./CanvasContainer";
import {getElementPadding} from "./Helpers";
import {CombinationKeyState} from "./interfaces/CombinationKeyState";
import {DoublyLinkedList} from "@utils/DoublyLinkedList";

export class DocumentService implements HasSubscription {
    private canvasContainer: CanvasContainer;
    private renderer: DocumentRenderer;
    private editor: RawEditor
    private cursorOperation: CursorOperation;
    private keyEvents: KeyEvents;
    private sizes: DocumentSizes;
    private readonly commands: CommandMap = initializeCommands(this);
    private clipboardEvents: ClipboardEvents;
    private combinationKeyState: CombinationKeyState;

    public getCommands(): CommandMap {
        return this.commands;
    }

    constructor(canvasContainer: CanvasContainer, renderer: DocumentRenderer, editor: RawEditor, sizes: DocumentSizes) {
        this.canvasContainer = canvasContainer;
        this.renderer = renderer;
        this.editor = editor;
        this.sizes = sizes;

        this.cursorOperation = new CursorOperation(this);
        this.keyEvents = new KeyEvents(this);
        this.clipboardEvents = new ClipboardEvents(this);

        this.combinationKeyState = new CombinationKeyState();
        CursorUpdateSubscription.subscribe(this);
    }

    public getCharWidth(): number {
        return this.sizes.charWidth;
    }

    private getCorrectPosition(e: MouseEvent): Vec2 {
        let x = e.clientX;
        let y = e.clientY;
        const pos = { x: e.clientX, y: e.clientY };

        // @ts-ignore
        let page = parseInt(e.target.getAttribute('page'));
        const canvas = this.canvasContainer.getCanvas(page);

        const {left, top} = canvas.getBoundingClientRect();
        const padding = getElementPadding(canvas);

        x -= left + padding.x;
        y -= top + padding.y;
        x += (x % this.sizes.charWidth);

        // console.log({x, y}, pos, {left, top});

        return {x: Math.max(0, Math.floor(x / this.sizes.charWidth)), y: Math.floor(y / this.sizes.height) + (page * this.sizes.rows)};
    }

    public drawCursor(pos: Vec2): void {
        this.renderer.renderCursor(pos);
    }

    public clearCursor(pos: Vec2): void {
        this.renderer.clearCursor(pos);
    }

    public getCursorPositionsStartAndEnd(): Vec2[] {
        let start = this.cursorOperation.getPrevCursorPosition();
        let end = this.cursorOperation.getCursorPosition();
        if (start.y > end.y || (start.y == end.y && start.x > end.x)) {
            [start, end] = [end, start];
        }

        return [start, end];
    }

    public isCursorInTextSelection(): boolean {
        return this.cursorOperation.getIsTextSelection();
    }

    notify(usage: string): void {
        // console.log("Usage: ", usage);
        if (usage !== "TEXT OPERATION") return;

        if (this.isCursorInTextSelection()) {
            const [start, end] = this.getCursorPositionsStartAndEnd();

            this.renderer.renderTextWithSelection(start, end);
        } else {
            this.renderer.renderText();
        }
    }

    public onMouseMove(e: MouseEvent) {
        const pos = this.getCorrectPosition(e);
        this.cursorOperation.handleOnMouseMove(pos);
    }

    public onMouseUp(e: MouseEvent) {
        const pos = this.getCorrectPosition(e);
        this.cursorOperation.handleOnMouseUp(pos);
    }

    public onMouseDown(e: MouseEvent) {
        const pos = this.getCorrectPosition(e);
        this.cursorOperation.handleOnMouseDown(pos);
    }

    public onKeyDown(e: KeyboardEvent) {
        this.keyEvents.handleKeyDown(e);
    }

    public onKeyUp(e: KeyboardEvent) {
        this.keyEvents.handleKeyUp(e, this.combinationKeyState);
    }

    public enableCombinationKey(key: string) {
        this.combinationKeyState.enableKey(key);
    }

    public isCombinationKeyEnabled(key: string): boolean {
        return this.combinationKeyState.isKeyEnabled(key);
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
            return true;
        }
        return false;
    }

    public handleBackSpace() {
        if (!this.deleteTextSelection()) {
            this.editor.backspace();
        }
        this.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handlePages() {
        const pos = this.getLastCharPosition();
        const pages = Math.floor(pos.y / this.sizes.rows);

        // console.log("PAGES:", pos, pages, this.canvasContainer.getCanvasesTotal())

        while (this.canvasContainer.getCanvasesTotal() <= pages) {
            this.canvasContainer.appendCanvasNew(this);
        }
        while (this.canvasContainer.getCanvasesTotal() > pages + 1) {
            this.canvasContainer.popCanvas();
        }
        this.cursorOperation.updateLiveCursorPosition();
    }

    // Update logic for pages
    public handleInsertChar(char: string) {
        this.deleteTextSelection()
        this.editor.insert(char);
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleInsertTab() {
        this.deleteTextSelection()
        for (let i=0; i<config.tabSize; i++) {
            this.editor.insert(" ");
        }
        this.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }

    public handleInsertNewLine() {
        this.deleteTextSelection()
        this.editor.insert('\n');
        this.handlePages();
        CursorUpdateSubscription.notifyForTextAndCursorUpdate();
    }
    // Update logic for pages

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

    public getLastCharPosition(): Vec2 {
        let rows = 0;
        for (let i=0; i<this.editor.getLinesLength(); i++) {
            const chars = Math.max(this.sizes.cols, this.editor.getLineAtIndex(i));
            rows += Math.ceil(chars / this.sizes.cols);
        }
        const colIndex = this.editor.getLastLine();
        return {x: colIndex % this.sizes.cols, y: rows};
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

        return pos;
    }

    public moveCursorToEnd() {
        const pos = this.getLastCharPosition();
        this.moveCursor(pos);
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
        let diff = this.editor.getTotalCharsBeforeCursor().size() - realPos;

        if (diff > 0) {
            this.editor.moveLeft(diff);
        } else {
            this.editor.moveRight(diff * -1);
        }
    }

    public moveCursorLeft() {
        this.editor.moveLeft(1);
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

    public updatePrevCursorPosition(pos: Vec2) {
        this.cursorOperation.setPrevCursorPosition(pos);
    }

    public updateCursorPosition(pos?: Vec2) {
        this.cursorOperation.updateCursorPosition(pos || this.getCursorPosition());
    }

    public enableTextSelection() {
        this.cursorOperation.enableTextSelection();
    }

    public selectCurrentWord() {
        const pos = this.getCursorPosition();
        let node = this.editor.getTotalCharsBeforeCursor().getTail();
        const left = this.continuousCharacterOnLeftPos({...pos}, node);

        node = this.editor.getTotalCharsAfterCursor().getHead();
        const right = this.continuousCharacterOnRightPos({...pos}, node);

        this.updatePrevCursorPosition(left);
        this.moveCursor(right);
        this.updateCursorPosition(right);
        this.enableTextSelection();
        CursorUpdateSubscription.notifyForTextUpdate();
    }

    public selectEntireLine() {
        const pos = this.getCursorPosition();

        const left = {x: 0, y: pos.y}
        let right = {x: this.sizes.cols, y: pos.y}

        this.updatePrevCursorPosition(left);
        this.moveCursor(right);
        this.updateCursorPosition(right);
        this.enableTextSelection();
        CursorUpdateSubscription.notifyForTextUpdate();
    }

    public checkIfCharIsInContinuous(char: string): boolean {
        return config.canPassthroughCharacters.includes(char);
    }

    public continuousCharacterOnLeftWithPaddingPos(): Vec2 {
        let pos: Vec2 = this.getCursorPosition();

        let node = this.editor.getTotalCharsBeforeCursor().getTail();
        while (node && node.val === ' ') {
            if (pos.x == 0) {
                pos.y--;
                pos.x = this.sizes.cols;
            } pos.x--;
            node = node.prev;
        }

        return this.continuousCharacterOnLeftPos(pos, node, true);
    }

    public continuousCharacterOnRightWithPaddingPos(): Vec2 {
        let pos: Vec2 = this.getCursorPosition();

        let node = this.editor.getTotalCharsAfterCursor().getHead();
        while (node && node.val === ' ') {
            if (pos.x == this.sizes.cols) {
                pos.y++;
                pos.x = 0;
            } pos.x++;
            node = node.next;
        }

        return this.continuousCharacterOnRightPos(pos, node, true);
    }

    public continuousCharacterOnLeftPos(pos: Vec2, node: DoublyLinkedList<string> | null, ignoreFirst=false): Vec2 {
        let first = ignoreFirst;
        while (node && (first || this.checkIfCharIsInContinuous(node.val))) {
            if (pos.x == 0) {
                pos.y--;
                pos.x = this.sizes.cols;
            } pos.x--;
            if (!this.checkIfCharIsInContinuous(node.val)) break;
            node = node.prev;
            first = false;
        }

        return pos;
    }

    public continuousCharacterOnRightPos(pos: Vec2, node: DoublyLinkedList<string> | null, ignoreFirst=false): Vec2 {
        let first = ignoreFirst;
        while (node && (first || this.checkIfCharIsInContinuous(node.val))) {
            if (pos.x == this.sizes.cols) {
                pos.y++;
                pos.x = 0;
            } pos.x++;
            if (!this.checkIfCharIsInContinuous(node.val)) break;
            node = node.next;
            first = false;
        }

        return pos;
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
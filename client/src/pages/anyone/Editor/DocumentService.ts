import {RawEditor} from "./RawEditor";
import {DocumentRenderer} from "./DocumentRenderer";
import {DocumentSizes, Vec2} from "./interfaces/interfaces";
import {CursorOperation} from "./commands/CursorOperation";
import {ALLKeyEvents} from "./commands/KeyEvents/ALLKeyEvents";

export class DocumentService {
    private renderer: DocumentRenderer;
    private editor: RawEditor
    private cursorOperation: CursorOperation;
    private keyEvents: ALLKeyEvents;
    private sizes: DocumentSizes;

    constructor(renderer: DocumentRenderer, editor: RawEditor, sizes: DocumentSizes) {
        this.renderer = renderer;
        this.editor = editor;
        this.sizes = sizes;

        this.cursorOperation = new CursorOperation(this);
        this.keyEvents = new ALLKeyEvents(this);
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

    public handleBackSpace() {
        this.editor.backspace();
    }

    public handleInsertChar(char: string) {
        this.editor.insert(char);
    }

    public handleInsertNewLine() {
        this.editor.insertNewLine();
    }

    public handleArrowLeft() {
        this.editor.moveLeft(1);
    }

    public handleArrowRight() {
        this.editor.moveRight(1);
    }

    public handleArrowUp() {
        this.moveCursorUp();
    }

    public handleArrowDown() {
        this.moveCursorDown();
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
        let chars = 0;
        for (let i=0; i<this.editor.getLogicalLineIndex(); i++) {
            chars += Math.max(this.sizes.cols, this.editor.getLogicalLineLengths()[i]);
        }
        let rows = Math.ceil(chars / this.sizes.cols);
        const colIndex = this.editor.getLogicalColumnIndex();
        const pos: Vec2 = { x: colIndex, y: rows }
        pos.x = pos.x % this.sizes.cols;
        pos.y = pos.y + Math.floor(colIndex / this.sizes.cols);
        // console.log(this.editor.getTotalCharsBeforeCursor().toArray(), this.editor.getLogicalLineLengths(), pos)
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
        console.log("MovePOS:", newPos, "1DPos:", realPos);
        let diff = this.editor.getTotalCharsBeforeCursor().size() - realPos;

        if (diff > 0) {
            this.editor.moveLeft(diff);
        } else {
            this.editor.moveRight(diff * -1);
        }
    }

    public moveCursorUp() {
        const pos = this.getCursorPosition();
        console.log(pos)
        this.moveCursor({ x: pos.x, y: pos.y - 1 });
    }

    public moveCursorDown() {
        const pos = this.getCursorPosition();
        this.moveCursor({ x: pos.x, y: pos.y + 1 });
    }

    public dispose() {
        this.cursorOperation.dispose();
    }
}
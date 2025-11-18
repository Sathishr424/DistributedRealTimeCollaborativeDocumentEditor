import {DocumentService} from "../DocumentService";
import {config, DocumentSizes, Vec2} from "../utils/interfaces";
import {getElementPadding} from "../Helpers";
import {CanvasContainer} from "../CanvasContainer";
import {RawEditor} from "../RawEditor";
import {DoublyLinkedList} from "@utils/DoublyLinkedList";

export class LayoutEngine {
    private service: DocumentService;
    private canvasContainer: CanvasContainer;
    private editor: RawEditor;
    readonly sizes: DocumentSizes;

    constructor(service: DocumentService, canvasContainer: CanvasContainer, editor: RawEditor, sizes: DocumentSizes) {
        this.service = service;
        this.canvasContainer = canvasContainer;
        this.editor = editor;
        this.sizes = sizes;
    }

    public handlePages() {
        const pos = this.getLastCharPosition();
        const pages = Math.floor(pos.y / this.sizes.rows);
        // console.log("PAGES:", pos, pages, this.canvasContainer.getCanvasesTotal())

        while (this.canvasContainer.getCanvasesTotal() <= pages) {
            this.canvasContainer.appendCanvasNew(this.service);
        }
        while (this.canvasContainer.getCanvasesTotal() > pages + 1) {
            this.canvasContainer.popCanvas();
        }
        this.service.updateLiveCursorPosition();
    }

    public getCursorPositionsStartAndEnd(): Vec2[] {
        let start = this.service.getPrevCursorPosition();
        let end = this.getCursorPosition();
        if (start.y > end.y || (start.y == end.y && start.x > end.x)) {
            [start, end] = [end, start];
        }

        return [start, end];
    }

    public getCorrectPosition(e: MouseEvent): Vec2 {
        let x = e.clientX;
        let y = e.clientY;

        // @ts-ignore
        let page = parseInt(e.target.getAttribute('page'));
        const canvas = this.canvasContainer.getCanvas(page);

        const {left, top} = canvas.getBoundingClientRect();
        const padding = getElementPadding(canvas);

        x -= left + padding.x;
        y -= top + padding.y;
        x += (x % this.sizes.charWidth);

        return {x: Math.max(0, Math.floor(x / this.sizes.charWidth)), y: Math.floor(y / this.sizes.height) + (page * this.sizes.rows)};
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

    public getLastCharPosition(): Vec2 {
        let rows = 0;
        for (let i=0; i<this.editor.getLinesLength(); i++) {
            const chars = Math.max(this.sizes.cols, this.editor.getLineAtIndex(i));
            rows += Math.ceil(chars / this.sizes.cols);
        }
        const colIndex = this.editor.getLastLine();
        return {x: colIndex % this.sizes.cols, y: rows};
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

    public moveToPosition(pos: number) {
        let diff = this.editor.getCursorPosition() - pos;

        if (diff > 0) {
            this.editor.moveLeft(diff);
        } else {
            this.editor.moveRight(diff * -1);
        }
    }

    public moveCursorToEnd() {
        const pos = this.getLastCharPosition();
        this.moveCursor(pos);
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
}
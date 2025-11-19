import {config, DocumentSizes, Vec2} from "../utils/interfaces";
import {RawEditor} from "../RawEditor";
import {DoublyLinkedList} from "@utils/DoublyLinkedList";

export class LayoutEngine {
    private editor: RawEditor;
    readonly sizes: DocumentSizes;

    constructor(editor: RawEditor, sizes: DocumentSizes) {
        this.editor = editor;
        this.sizes = sizes;
    }

    public convertToCanvasPos(pos: Vec2): Vec2 {
        const row = pos.y % this.sizes.rows;
        return { x: pos.x * this.sizes.charWidth, y: row * this.sizes.height };
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

    public calculateCursorPosition(): Vec2 {
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
        let pos: Vec2 = this.calculateCursorPosition();

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
        let pos: Vec2 = this.calculateCursorPosition();

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


}
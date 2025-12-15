import {DocumentSizes, Vec2} from "../utils/interfaces";
import {RawEditor} from "../RawEditor";
import {DoublyLinkedList} from "@utils/DoublyLinkedList";
import {config} from "../../../../shared/config";

export class LayoutEngine {
    private editor: RawEditor;
    readonly sizes: DocumentSizes;

    constructor(editor: RawEditor, sizes: DocumentSizes) {
        this.editor = editor;
        this.sizes = sizes;
    }

    public convertTo1DPosition(pos: Vec2): number {
        // TODO Optimize later for O(log N) on left and O(N) on right
        let index = 0;
        let rows = 0;
        for (let i=0; i<this.editor.getTotalRowsDataLength(); i++) {
            const rowData = this.editor.getRowDataAtIndex(i);
            if (rows + rowData.rowsSoFar > pos.y) {
                let diff = pos.y - rows;
                index += Math.min(rowData.cols, diff * this.sizes.cols + pos.x);
                return index;
            }
            rows += rowData.rowsSoFar;
            index += rowData.cols + 1;
        }
        return index;
    }

    public calculateCursorPosition(): Vec2 {
        const colIndex = this.editor.getActiveLineColumnIndex();
        const rows = this.editor.getLeftTotalRows() - this.editor.getLeftLastRows();
        return {x: colIndex % this.sizes.cols, y: rows + Math.floor(colIndex / this.sizes.cols)};
    }

    public getLastCharPosition(): Vec2 {
        const colIndex = this.editor.getLastLine();
        return {x: colIndex % this.sizes.cols, y: this.editor.getLeftTotalRows() + this.editor.getRightTotalRows()};
    }

    public getPosFrom1DIndex(index: number): Vec2 {
        let rows = 0;
        for (let i=0; i<this.editor.getTotalRowsDataLength(); i++) {
            const rowData = this.editor.getRowDataAtIndex(i);
            if (index - rowData.cols <= 0) {
                return {x: index % this.sizes.cols, y: rows + Math.ceil(index / this.sizes.cols)};
            }
            rows += rowData.rowsSoFar;
            index -= rowData.cols + 1;
        }
        return {x: 0, y: rows};
    }

    public checkIfCharIsInContinuous(char: string): boolean {
        return config.canPassthroughCharacters.includes(char);
    }

    public continuousCharacterOnLeftWithPaddingPos(): Vec2 {
        let pos: Vec2 = this.calculateCursorPosition();

        let leftChars = this.editor.getTotalCharsBeforeCursor();
        let index = leftChars.length - 1;
        while (index >= 0 && leftChars[index] === ' ') {
            if (pos.x == 0) {
                pos.y--;
                pos.x = this.sizes.cols;
            }
            pos.x--;
            index--;
        }

        return this.continuousCharacterOnLeftPos(pos, index, true);
    }

    public continuousCharacterOnRightWithPaddingPos(): Vec2 {
        let pos: Vec2 = this.calculateCursorPosition();

        let rightChars = this.editor.getTotalCharsAfterCursor();
        let index = rightChars.length - 1;
        while (index >= 0 && rightChars[index] === ' ') {
            if (pos.x == this.sizes.cols) {
                pos.y++;
                pos.x = 0;
            }
            pos.x++;
            index--;
        }

        return this.continuousCharacterOnRightPos(pos, index, true);
    }

    public continuousCharacterOnLeftPos(pos: Vec2, index: number, ignoreFirst = false): Vec2 {
        let first = ignoreFirst;
        let leftChars = this.editor.getTotalCharsBeforeCursor();
        while (index >= 0 && (first || this.checkIfCharIsInContinuous( leftChars[index] ))) {
            if (pos.x == 0) {
                pos.y--;
                pos.x = this.sizes.cols;
            }
            pos.x--;
            if (!this.checkIfCharIsInContinuous( leftChars[index] )) break;
            index--;
            first = false;
        }

        return pos;
    }

    public continuousCharacterOnRightPos(pos: Vec2, index: number, ignoreFirst = false): Vec2 {
        let first = ignoreFirst;
        let rightChars = this.editor.getTotalCharsAfterCursor();
        while (index >= 0 && (first || this.checkIfCharIsInContinuous(rightChars[index]))) {
            if (pos.x == this.sizes.cols) {
                pos.y++;
                pos.x = 0;
            }
            pos.x++;
            if (!this.checkIfCharIsInContinuous(rightChars[index])) break;
            index--;
            first = false;
        }

        return pos;
    }


}
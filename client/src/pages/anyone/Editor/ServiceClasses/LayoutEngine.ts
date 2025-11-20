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

    public convertTo1DPositionOld(pos: Vec2): number {
        let index = 0;
        let row = 0;
        let found = false;
        [this.editor.getLeftLines().getHead(), this.editor.getRightLines().getHead()].forEach(node => {
            while (!found && node) {
                const line = node.val;
                let lineLength = Math.max(this.sizes.cols, line);
                let rowsLineContain = Math.ceil(lineLength / this.sizes.cols);

                row += rowsLineContain;
                if (row > pos.y) {
                    let remRow = pos.y - (row - rowsLineContain);
                    let possible_chars = remRow * this.sizes.cols;
                    index += possible_chars;
                    index += Math.min(pos.x, line - possible_chars);
                    found = true;
                    break;
                }

                index += line + 1;
                node = node.next;
            }
        })

        return index;
    }

    public convertTo1DPosition(pos: Vec2): number {
        // TODO Optimize later for O(log N) on left and O(N) on right
        let rowsData = this.editor.getLeftRowsData();
        let index = 0;
        let rows = 0;
        for (let rowData of rowsData) {
            if (rows + rowData.rowsSoFar > pos.y) {
                let diff = pos.y - rows;
                index += Math.min(rowData.cols, diff * this.sizes.cols + pos.x);
                return index;
            }
            rows += rowData.rowsSoFar;
            index += rowData.cols + 1;
        }
        rowsData = this.editor.getRightRowsData();
        for (let i=rowsData.length - 1; i>=0; i--) {
            const rowData = rowsData[i];

            if (rows + rowData.rowsSoFar > pos.y) {
                let diff = pos.y - rows;
                index += Math.min(rowData.cols, diff * this.sizes.cols + pos.x);
                break;
            }

            rows += rowData.rowsSoFar;
            index += rowData.cols + 1;
        }
        return index;
    }

    public calculateCursorPositionOld(): Vec2 {
        let rows = 0;

        let node = this.editor.getLeftLines().getHead()!;
        while (node.next) {
            const chars = Math.max(this.sizes.cols, node.val);
            rows += Math.ceil(chars / this.sizes.cols);
            node = node.next;
        }
        const colIndex = this.editor.getLogicalColumnIndex();
        const pos = {x: colIndex % this.sizes.cols, y: rows + Math.floor(colIndex / this.sizes.cols)};
        console.log(pos.y, this.editor.getLineSizeLeft(), this.editor.getLeftRows());
        return pos;
    }

    public calculateCursorPosition(): Vec2 {
        const colIndex = this.editor.getLogicalColumnIndex();
        const rows = this.editor.getLeftRows() - this.editor.getLeftLastRows();
        return {x: colIndex % this.sizes.cols, y: rows + Math.floor(colIndex / this.sizes.cols)};
    }

    public getLastCharPositionOld(): Vec2 {
        let rows = 0;

        [this.editor.getLeftLines().getHead(), this.editor.getRightLines().getHead()].forEach(node => {
            while (node) {
                const chars = Math.max(this.sizes.cols, node.val);
                rows += Math.ceil(chars / this.sizes.cols);
                node = node.next;
            }
        })
        const colIndex = this.editor.getLastLine();
        return {x: colIndex % this.sizes.cols, y: rows};
    }

    public getLastCharPosition(): Vec2 {
        const colIndex = this.editor.getLastLine();
        return {x: colIndex % this.sizes.cols, y: this.editor.getLeftRows() + this.editor.getRightRows()};
    }

    public getPosFrom1DIndex(index: number): Vec2 {
        let rowsData = this.editor.getLeftRowsData();
        let rows = 0;
        for (let rowData of rowsData) {
            if (index - rowData.cols < 0) {
                return {x: index % this.sizes.cols, y: rows + Math.ceil(index / this.sizes.cols)};
            }
            rows += rowData.rowsSoFar;
            index -= rowData.cols + 1;
        }
        rowsData = this.editor.getRightRowsData();
        for (let i=rowsData.length - 1; i>=0; i--) {
            const rowData = rowsData[i];

            if (index - rowData.cols < 0) {
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
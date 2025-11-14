import {Deque} from "@utils/Deque";
import {DocumentSizes, Vec2} from "./interfaces/interfaces";

export class RawEditor {
    private left: Deque<string>;
    private right: Deque<string>;
    private newLines: number[] = [0];
    private lineIndex: number = 0;
    private columnIndex: number = 0;
    sizes: DocumentSizes;

    constructor(sizes: DocumentSizes) {
        this.sizes = sizes;
        this.left = new Deque<string>();
        this.right = new Deque<string>();
    }

    public getLeft(): Deque<string> {
        return this.left;
    }

    public getRight(): Deque<string> {
        return this.right;
    }

    public convertTo1DPosition(pos: Vec2) {
        let index = 0;
        let row = 0;
        for (let line of this.newLines) {
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
        for (let i=0; i<this.lineIndex; i++) {
            chars += Math.max(this.sizes.cols, this.newLines[i]);
        }
        let rows = Math.ceil(chars / this.sizes.cols);
        const colIndex = this.columnIndex;
        const pos: Vec2 = { x: colIndex, y: rows }
        pos.x = pos.x % this.sizes.cols;
        pos.y = pos.y + Math.floor(colIndex / this.sizes.cols);
        // console.log([rows, colIndex, Math.ceil(colIndex / this.sizes.cols)], this.sizes.cols, this.newLines, pos, this.left.size(), this.convertTo1DPosition(pos));
        return pos;
    }

    public insert(char: string) {
        if (char == '\n') return this.insertNewLine();
        this.left.pushBack(char);
        this.newLines[this.lineIndex]++;
        this.columnIndex++;
    }

    public insertNewLine() {
        this.left.pushBack("\n");
        this.lineIndex++;
        this.newLines.splice(this.lineIndex, 0, 0);
        this.columnIndex = 0;
    }

    public backspace() {
        this.deleteLeft(1);
    }

    public delete(newPos: Vec2) {
        let realPos = this.convertTo1DPosition(newPos);
        let diff = this.left.size() - realPos;

        if (diff > 0) {
            this.deleteLeft(diff);
        } else {
            this.deleteRight(diff * -1);
        }
    }

    public moveCursor(newPos: Vec2) {
        console.log("MovePOS:", newPos);
        let realPos = this.convertTo1DPosition(newPos);
        let diff = this.left.size() - realPos;

        if (diff > 0) {
            this.moveCursorLeft(diff);
        } else {
            this.moveCursorRight(diff * -1);
        }
    }

    public deleteLeft(k: number) {
        while (this.left.size() && k) {
            let char = this.left.popBack();
            if (char == '\n') {
                this.lineIndex--;
                this.columnIndex = this.newLines[this.lineIndex];
                this.newLines[this.lineIndex] += this.newLines[this.lineIndex + 1];
                this.newLines.splice(this.lineIndex + 1, 1);
            } else {
                this.newLines[this.lineIndex]--;
                this.columnIndex--;
            }
            k--;
        }
    }

    public deleteRight(k: number) {
        while (this.right.size() && k) {
            let char = this.right.popFront();
            if (char == '\n') {
                this.newLines[this.lineIndex] += this.newLines[this.lineIndex + 1];
                this.newLines.splice(this.lineIndex + 1, 1);
            } else {
                this.newLines[this.lineIndex]--;
            }
            k++;
        }
    }

    public moveCursorLeft(k: number) {
        while (this.left.size() && k) {
            let char = this.left.popBack();
            this.right.pushFront(<string>char);
            if (char == '\n') {
                this.lineIndex--;
                this.columnIndex = this.newLines[this.lineIndex];
            } else {
                this.columnIndex--;
            }
            k--;
        }
    }

    public moveCursorRight(k: number) {
        while (this.right.size() && k) {
            let char = this.right.popFront();
            if (char == '\n') {
                this.lineIndex++;
                this.columnIndex = -1;
            }
            this.columnIndex++;
            this.left.pushBack(<string>char);
            k--;
        }
    }

    public moveCursorUp(k: number) {
        const pos = this.getCursorPosition();
        console.log(pos)
        this.moveCursor({ x: pos.x, y: pos.y - 1 });
    }

    public moveCursorDown(k: number) {
        const pos = this.getCursorPosition();
        this.moveCursor({ x: pos.x, y: pos.y + 1 });
    }
}
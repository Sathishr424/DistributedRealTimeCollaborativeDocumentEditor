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

    public getCursorPosition(): Vec2 {
        let chars = 0;
        for (let i=0; i<this.lineIndex; i++) {
            chars += Math.max(this.sizes.cols, this.newLines[i]);
        }
        let row = Math.ceil(chars / this.sizes.cols);
        const pos: Vec2 = { x: this.columnIndex, y: row }
        pos.x = pos.x % (this.sizes.cols + 1);
        pos.y = pos.y + Math.floor(this.columnIndex / (this.sizes.cols + 1));
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

    public convertTo1DPosition(pos: Vec2) {
        let row = 0;
        let index = 0;
        for (let i=0; i<this.newLines.length; i++) {
            let curr = Math.ceil(Math.max(this.newLines[i], this.sizes.cols) / this.sizes.cols);
            row += curr;
            if (row > pos.y) {
                if (this.newLines[i] > this.sizes.cols) {
                    return index + ( (curr - (row - pos.y) ) * this.sizes.cols ) + pos.x;
                } else {
                    return index + Math.min(this.newLines[i], pos.x);
                }
            }
            index += this.newLines[i] + (i < this.newLines.length - 1 ? 1 : 0);
        }

        return index;
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
        while (this.lineIndex < this.newLines.length && k) {
            this.lineIndex++;
            this.columnIndex = Math.min(this.columnIndex, this.newLines[this.lineIndex]);
            k--;
        }
    }

    public moveCursorDown(k: number) {
        while (this.lineIndex > 0) {
            this.lineIndex--;
            this.columnIndex = Math.min(this.columnIndex, this.newLines[this.lineIndex]);
            k--;
        }
    }
}
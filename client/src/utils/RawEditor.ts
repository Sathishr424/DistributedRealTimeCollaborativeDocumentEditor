
import {POS} from "../pages/anyone/Editor/Editor";
import {Deque} from "@utils/Deque";

export class RawEditor {
    private left: Deque<string>;
    private right: Deque<string>;
    private newLines: number[] = [0];
    private lineIndex: number = 0;
    private columnLength: number = 0;
    private columnIndex: number = 0;

    constructor(columnLength: number) {
        this.left = new Deque<string>();
        this.right = new Deque<string>();
        this.columnLength = columnLength;
    }

    public getLeft(): Deque<string> {
        return this.left;
    }

    public getRight(): Deque<string> {
        return this.right;
    }

    public getCursorPosition(): POS {
        let row = 0;
        let index = 0;
        for (let i=0; i<this.lineIndex; i++) {
           row += Math.ceil((Math.max(this.columnLength, this.newLines[i]) / this.columnLength));
           index += this.newLines[i];
        }
        const pos: POS = { x: this.columnIndex, y: row }
        pos.x = pos.x % (this.columnLength + 1);
        pos.y = pos.y + Math.floor(this.columnIndex / (this.columnLength + 1));
        // console.log(this.left.size(), pos, this.convertTo1DPosition(pos));
        return pos;
    }

    public insert(char: string) {
        this.left.pushBack(char);
        this.newLines[this.lineIndex]++;
        this.columnIndex++;
        console.log(this.newLines)
    }

    public insertNewLine() {
        this.left.pushBack("\n");
        this.lineIndex++;
        this.newLines.splice(this.lineIndex, 0, 0);
        this.columnIndex = 0;
    }

    public convertTo1DPosition(pos: POS) {
        let row = 0;
        let index = 0;
        for (let i=0; i<this.newLines.length; i++) {
            let curr = Math.ceil(Math.max(this.newLines[i], this.columnLength) / this.columnLength);
            row += curr;
            if (row > pos.y) {
                if (this.newLines[i] > this.columnLength) {
                    console.log(index, pos.y, row, pos.x)
                    return index + ( (curr - (row - pos.y) ) * this.columnLength ) + pos.x;
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

    public delete(newPos: POS) {
        let realPos = this.convertTo1DPosition(newPos);
        let diff = this.left.size() - realPos;

        if (diff > 0) {
            this.deleteLeft(diff);
        } else {
            this.deleteRight(diff * -1);
        }
    }

    public moveCursor(newPos: POS) {
        let realPos = this.convertTo1DPosition(newPos);
        let diff = this.left.size() - realPos;

        console.log(this.newLines)
        console.log(newPos, realPos, this.left.size());

        if (diff > 0) {
            this.moveCursorLeft(diff);
        } else {
            this.moveCursorRight(diff * -1);
        }
    }

    private deleteLeft(k: number) {
        // console.log(this.newLines)
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

    private deleteRight(k: number) {
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

    private moveCursorLeft(k: number) {
        console.log(k)
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

    private moveCursorRight(k: number) {
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
}
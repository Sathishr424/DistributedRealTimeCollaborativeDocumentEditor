import {Deque} from "@utils/Deque";
import {POS} from "../pages/anyone/Editor/Editor";

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
        for (let i=0; i<this.lineIndex; i++) {
           row += Math.floor((Math.max(this.columnLength, this.newLines[i]) + (this.columnLength - 1)) / this.columnLength);
        }

        return { x: this.columnIndex, y: row };
    }

    public insert(char: string) {
        this.left.push_back(char);
        this.newLines[this.lineIndex]++;
        this.columnIndex++;
        console.log(this.newLines)
    }

    public insertNewLine() {
        this.left.push_back("\n");
        this.lineIndex++;
        this.newLines.splice(this.lineIndex, 0, 0);
        this.columnIndex = 0;
    }

    public convertTo1DPosition(pos: POS) {
        let row = 0;
        let index = 0;
        for (let i=0; i<this.newLines.length; i++) {
            row += (this.newLines[i] + (this.columnLength - 1)) / this.columnLength;
            if (row >= pos.y) {
                return this.newLines[i] - (pos.y - row) * this.columnLength + pos.x;
            }
            index += this.newLines[i];
        }

        return row + pos.x;
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

        if (diff > 0) {
            this.moveCursorLeft(diff);
        } else {
            this.moveCursorRight(diff * -1);
        }
    }

    private deleteLeft(k: number) {
        // console.log(this.newLines)
        while (this.left.size() && k) {
            let char = this.left.pop_back();
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
            let char = this.right.pop_front();
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
        while (this.left.size() && k) {
            let char = this.left.pop_back();
            this.right.push_front(<string>char);
            if (char == '\n') {
                this.lineIndex--;
                this.columnIndex = this.newLines[this.lineIndex];
            }
            this.columnIndex--;
            k--;
        }
    }

    private moveCursorRight(k: number) {
        while (this.right.size() && k) {
            let char = this.right.pop_front();
            if (char == '\n') {
                this.lineIndex++;
                this.columnIndex = -1;
            }
            this.columnIndex++;
            this.left.push_back(<string>char);
            k--;
        }
    }
}
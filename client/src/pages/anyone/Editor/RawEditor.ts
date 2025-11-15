import {Deque} from "@utils/Deque";

export class RawEditor {
    private left: Deque<string>;
    private right: Deque<string>;
    private newLines: number[] = [0];
    private lineIndex: number = 0;
    private columnIndex: number = 0;

    constructor() {
        this.left = new Deque<string>();
        this.right = new Deque<string>();
    }

    public getLogicalLineLengths(): number[] {
        return this.newLines;
    }

    public getLogicalLineIndex(): number {
        return this.lineIndex;
    }

    public getLogicalColumnIndex(): number {
        return this.columnIndex;
    }

    public getTotalCharsBeforeCursor(): Deque<string> {
        return this.left;
    }

    public getTotalCharsAfterCursor(): Deque<string> {
        return this.right;
    }

    public getRight(): Deque<string> {
        return this.right;
    }

    public insert(char: string) {
        if (char == '\n') return this.insertNewLine();
        this.left.pushBack(char);
        this.newLines[this.lineIndex]++;
        this.columnIndex++;
    }

    public insertNewLine() {
        this.left.pushBack("\n");
        let rem = this.newLines[this.lineIndex] - this.columnIndex;
        this.newLines[this.lineIndex] = this.columnIndex;
        this.lineIndex++;
        this.newLines.splice(this.lineIndex, 0, 0);
        this.newLines[this.lineIndex] += rem;
        this.columnIndex = 0;
    }

    public backspace() {
        this.deleteLeft(1);
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
            k--;
        }
    }

    public moveLeft(k: number) {
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

    public moveRight(k: number) {
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
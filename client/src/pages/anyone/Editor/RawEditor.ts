import {Deque} from "@utils/Deque";

const sampleText = "🗄️ 3. Extract Utility and Helper Logic\n" +
    "Any code that is reusable or purely supporting the primary function of the class should be moved out.\n" +
    "\n" +
    "Helper Classes/Modules: Move complex calculations, formatting logic, or validation routines into dedicated, static helper classes or utility modules.\n" +
    "\n" +
    "Example: Your getCorrectPosition logic in DocumentService is essential, but if it grew too complex, you might move the visual-to-logical translation into a CoordinateConverter class, leaving the Service cleaner.";

export class RawEditor {
    private left: Deque<string>;
    private right: Deque<string>;
    private newLines: number[] = [0];
    private lineIndex: number = 0;
    private columnIndex: number = 0;

    constructor() {
        this.left = new Deque<string>();
        this.right = new Deque<string>();

        for (let char of sampleText) {
            this.insert(char);
        }
    }

    public getLogicalLineLengths(): number[] {
        return this.newLines;
    }

    public getLinesLength() {
        return this.newLines.length;
    }

    public getLineAtIndex(index: number): number {
        if (index < this.newLines.length)  return this.newLines[index];
        return 0;
    }

    public getLastLine() {
        return this.newLines[this.newLines.length - 1];
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
        if (char === '\n') return this.insertNewLine();
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

    public getTextUntilPos(pos: number) {
        let diff = this.left.size() - pos;

        if (diff < 0) {
            return this.getTextFromRight(-diff);
        } else {
            return this.getTextFromLeft(diff)
        }
    }

    private getTextFromLeft(k: number) {
        let chars = [];
        let node = this.left.getTail();
        while (node && k) {
            chars.push(node.val);
            node = node.prev;
            k--;
        }

        return chars.reverse().join('');
    }

    private getTextFromRight(k: number) {
        let chars = [];
        let node = this.right.getHead();
        while (node && k) {
            chars.push(node.val);
            node = node.next;
            k--;
        }

        return chars.join('');
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

    insertText(pastedText: string) {
        for (let char of pastedText) {
            this.insert(char);
        }
    }
}
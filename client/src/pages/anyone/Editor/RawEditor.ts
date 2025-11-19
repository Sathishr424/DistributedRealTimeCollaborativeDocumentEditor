import {Deque} from "@utils/Deque";
import {config} from "./utils/interfaces";

const sampleText = "An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.";

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

    public getCursorPosition(): number {
        return this.left.size();
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
        if (char === '\t') {
            return this.insertText(new Array(config.tabSize).fill(' ').join(''))
        }
        this.left.pushBack(char);
        this.newLines[this.lineIndex]++;
        this.columnIndex++;
    }

    private insertNewLine() {
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

    public backspace(): string {
        return this.deleteLeft(1);
    }

    public deleteKey(): string {
        return this.deleteRight(1);
    }

    public deleteLeft(k: number): string {
        let deleted: string[] = [];
        while (this.left.size() && k) {
            let char = <string>this.left.popBack();
            if (char == '\n') {
                this.lineIndex--;
                this.columnIndex = this.newLines[this.lineIndex];
                this.newLines[this.lineIndex] += this.newLines[this.lineIndex + 1];
                this.newLines.splice(this.lineIndex + 1, 1);
            } else {
                this.newLines[this.lineIndex]--;
                this.columnIndex--;
            }
            deleted.push(char);
            k--;
        }
        deleted.reverse()
        return deleted.join('');
    }

    public deleteRight(k: number): string {
        let deleted: string[] = [];
        while (this.right.size() && k) {
            let char = <string>this.right.popFront();
            if (char == '\n') {
                this.newLines[this.lineIndex] += this.newLines[this.lineIndex + 1];
                this.newLines.splice(this.lineIndex + 1, 1);
            } else {
                this.newLines[this.lineIndex]--;
            }
            deleted.push(char);
            k--;
        }
        return deleted.join('');
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
import {Deque} from "@utils/Deque";
import {config} from "./utils/interfaces";

const sampleText = "An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.An application programming interface is a connection between computers or between computer programs. It is a type of software interface, offering a service to other pieces of software. A document or standard that describes how to build such a connection or interface is called an API specification.";

export class RawEditor {
    private left: Deque<string>;
    private right: Deque<string>;

    private newlinesLeft: Deque<number>;
    private newlinesRight: Deque<number>;

    private columnIndex: number = 0;

    constructor() {
        this.left = new Deque<string>();
        this.right = new Deque<string>();

        this.newlinesLeft = new Deque<number>();
        this.newlinesLeft.pushBack(0);
        this.newlinesRight = new Deque<number>();

        this.insertText(sampleText);
    }

    public getCursorPosition(): number {
        return this.left.size();
    }

    public getLeftLines(): Deque<number> {
        return this.newlinesLeft;
    }

    public getRightLines(): Deque<number> {
        return this.newlinesRight;
    }

    public getLastLine() {
        return this.newlinesRight.back()!;
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
        this.newlinesLeft.updateBack(this.newlinesLeft.back()! + 1);
        this.columnIndex++;
    }

    private insertNewLine() {
        this.left.pushBack("\n");

        let rem = this.newlinesLeft.back()! - this.columnIndex;
        this.newlinesLeft.updateBack(this.columnIndex);
        this.newlinesLeft.pushBack(rem);
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
                const curr = this.newlinesLeft.popBack()!;
                this.columnIndex = this.newlinesLeft.back()!;
                this.newlinesLeft.updateBack(this.columnIndex + curr);
            } else {
                this.newlinesLeft.updateBack(this.newlinesLeft.back()! - 1);
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
                const curr = this.newlinesRight.popFront()!;
                this.newlinesLeft.updateBack(this.newlinesLeft.back()! + curr);
            } else {
                this.newlinesLeft.updateBack(this.newlinesLeft.back()! - 1);
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
                this.newlinesRight.pushFront(this.newlinesLeft.popBack()!);
                this.columnIndex = this.newlinesLeft.back()!;
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
                this.newlinesLeft.pushBack(this.newlinesRight.popFront()!);
                this.columnIndex = 0;
            } else {
                this.columnIndex++;
            }
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
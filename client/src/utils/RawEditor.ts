import {Deque} from "@utils/Deque";

export class RawEditor {
    private left: Deque<string>;
    private right: Deque<string>;

    constructor() {
        this.left = new Deque<string>();
        this.right = new Deque<string>();
    }

    public getLeft(): Deque<string> {
        return this.left;
    }

    public getRight(): Deque<string> {
        return this.right;
    }

    public getCursorPosition(): number {
        return this.left.size();
    }

    public insert(char: string) {
        this.left.push_back(char);
    }

    public delete(newPos: number) {
        let diff = this.left.size() - newPos;

        if (diff > 0) {
            this.deleteLeft(diff);
        } else {
            this.deleteRight(diff * -1);
        }
    }

    public moveCursor(newPos: number) {
        let diff = this.left.size() - newPos;

        if (diff > 0) {
            this.moveCursorLeft(diff);
        } else {
            this.moveCursorRight(diff * -1);
        }
    }

    private deleteLeft(k: number) {
        while (this.left.size() && k) {
            this.left.pop_back();
            k--;
        }
    }

    private deleteRight(k: number) {
        while (this.right.size() && k) {
            this.right.pop_front();
            k++;
        }
    }

    private moveCursorLeft(k: number) {
        while (this.left.size() && k) {
            this.right.push_front(<string>this.left.pop_back());
            k--;
        }
    }

    private moveCursorRight(k: number) {
        while (this.right.size() && k) {
            this.left.push_back(<string>this.right.pop_front());
            k--;
        }
    }
}
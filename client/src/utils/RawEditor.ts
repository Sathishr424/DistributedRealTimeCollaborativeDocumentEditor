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

    }

    public moveCursor(newPos: number) {

    }

    private deleteLeft(k: number) {

    }

    private deleteRight(k: number) {

    }

    private moveCursorLeft(k: number) {

    }

    private moveCursorRight(k: number) {

    }
}
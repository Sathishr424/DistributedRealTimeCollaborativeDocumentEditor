const maxCols: number = 250;

class DoublyLinkedList<T> {
    public prev: DoublyLinkedList<T> | null;
    public val: T;
    public next: DoublyLinkedList<T> | null;

    constructor(val: T, prev=null, next=null) {
        this.val = val;
        this.next = next;
        this.prev = prev;
    }
}

class Deque<T> {
    private _front: DoublyLinkedList<T> | null;
    private _back: DoublyLinkedList<T> | null;

    constructor() {
        this._front = null;
        this._back = null;
    }

    public front(): T | null {
        if (this._front !== null) return this._front.val;
        return null;
    }

    public back(): T | null {
        if (this._back !== null) return this._back.val;
        return null;
    }

    public pop_front(): T | null {
        if (this._front !== null) {
            let ret = this._front.val;
            if (this._front.next) {
                this._front.next.prev = null;
                this._front = this._front.next;
            } else {
                this._front = null;
                this._back = null;
            }
            return ret;
        } else {
            return null;
        }
    }

    public pop_back(): T | null {
        if (this._back !== null) {
            let ret = this._back.val;
            if (this._back.prev) {
                this._back.prev.next = null;
                this._back = this._back.prev;
            } else {
                this._front = null;
                this._back = null;
            }
            return ret;
        } else {
            return null;
        }
    }

    public push_front(val: T) {
        let newNode = new DoublyLinkedList<T>(val);
        if (this._front === null) {
            this._front = newNode;
            this._back = newNode;
        } else {
            newNode.next = this._front;
            this._front.prev = newNode;
            this._front = newNode;
        }
    }

    public push_back(val: T) {
        let newNode = new DoublyLinkedList<T>(val);
        if (this._back === null) {
            this._front = newNode;
            this._back = newNode;
        } else {
            newNode.prev = this._back;
            this._back.next = newNode;
            this._back = newNode;
        }
    }
}

class RawEditor {
    private left: Deque<string>;
    private right: Deque<string>;
    private pos: number = 0;

    constructor() {
        this.left = new Deque<string>();
        this.right = new Deque<string>();
    }

    public insert(char: string) {
        this.left.push_back(char);
    }

    public delete(deletePos: number) {

    }

    private deleteLeft(k: number) {

    }

    private deleteRight(k: number) {

    }

    public moveCursor(newPos: number) {

    }

    private moveCursorLeft(k: number) {

    }

    private moveCursorRight(k: number) {

    }
}

class Editor {
    private canvas: HTMLCanvasElement;
    private _cursorRow: number;
    private _cursorCol: number;
    private editor: RawEditor;

    constructor(canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this._cursorRow = 0;
        this._cursorCol = 0;
        this.editor = new RawEditor();
    }

    set cursorRow(value: number) {
        this._cursorRow = value;
    }

    set cursorCol(value: number) {
        this._cursorCol = value;
    }
}
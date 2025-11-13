import {DoublyLinkedList} from "@utils/DoublyLinkedList";

export class Deque<T> {
    private _front: DoublyLinkedList<T> | null;
    private _back: DoublyLinkedList<T> | null;
    private _size: number = 0;

    constructor() {
        this._front = null;
        this._back = null;
    }

    public getHead() {
        return this._front;
    }

    public size(): number {
        return this._size;
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
            this._size--;
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
            this._size--;
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
        this._size++;
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
        this._size++;
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


import {DoublyLinkedList} from "@utils/DoublyLinkedList";

export class Deque<T> {
    private _front: DoublyLinkedList<T> | null;
    private _back: DoublyLinkedList<T> | null;
    private _size: number = 0;

    constructor() {
        this._front = null;
        this._back = null;
    }

    public isEmpty(): boolean {
        return this._size == 0;
    }

    public getHead() {
        return this._front;
    }

    public getTail() {
        return this._back;
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

    public popFront(): T | null {
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

    public popBack(): T | null {
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

    public pushFront(val: T) {
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

    public pushBack(val: T) {
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

    public toArray(): T[] {
        let arr: T[] = [];
        let node = this._front;
        while (node) {
            arr.push(node.val);
            node = node.next;
        }
        return arr;
    }
}


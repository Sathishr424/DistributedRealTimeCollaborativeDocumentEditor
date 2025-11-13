export class DoublyLinkedList<T> {
    public prev: DoublyLinkedList<T> | null;
    public val: T;
    public next: DoublyLinkedList<T> | null;

    constructor(val: T, prev = null, next = null) {
        this.val = val;
        this.next = next;
        this.prev = prev;
    }
}
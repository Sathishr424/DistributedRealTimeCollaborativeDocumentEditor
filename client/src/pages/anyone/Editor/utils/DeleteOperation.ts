import {DocumentService} from "../DocumentService";
import {HistoryOperation} from "./interfaces";
import {LayoutEngine} from "../ServiceClasses/LayoutEngine";
import {TextController} from "../ServiceClasses/TextController";
import {CursorOperation} from "../ServiceClasses/CursorOperation";

export class DeleteOperation implements HistoryOperation {
    readonly timestamp: number;
    readonly chain: boolean;
    readonly position: number;
    readonly text: string;

    constructor(position: number, text: string, chain: boolean) {
        this.timestamp = Date.now();
        this.position = position;
        this.text = text;
        this.chain = chain;
    }

    handle(cursorOperation: CursorOperation, textController: TextController): void {
        cursorOperation.moveToPosition(this.position);
        textController.deleteRight(this.text.length);
    }
}
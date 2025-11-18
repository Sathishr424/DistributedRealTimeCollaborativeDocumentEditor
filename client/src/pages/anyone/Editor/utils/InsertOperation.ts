import {DocumentService} from "../DocumentService";
import {HistoryOperation} from "./interfaces";
import {LayoutEngine} from "../ServiceClasses/LayoutEngine";
import {TextController} from "../ServiceClasses/TextController";

export class InsertOperation implements HistoryOperation {
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

    handle(layout: LayoutEngine, textController: TextController): void {
        layout.moveToPosition(this.position);
        textController.insertTextFromUndoOrRedo(this.text);
    }
}
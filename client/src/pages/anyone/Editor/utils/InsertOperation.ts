import {DocumentService} from "../DocumentService";
import {HistoryOperation} from "./interfaces";

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

    handle(service: DocumentService): void {
        service.moveToPosition(this.position);
        service.insertText(this.text, false, true);
    }
}
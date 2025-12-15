import {KeyCommand} from "../handler/KeyCommand";
import {TextController} from "../ServiceClasses/TextController";
import {CursorOperation} from "../ServiceClasses/CursorOperation";

export type CommandMap = Record<string, KeyCommand>;

export interface RenderViewport {
    startRow: number;
    startCol: number;
    endRow: number;
    endCol: number;
}

export interface Vec2 {
    x: number,
    y: number
}

export interface DocumentSizes {
    cols: number;
    charWidth: number;
    charHeight: number;
    height: number;
    rows: number;
    pageHeight: number;
}

export abstract class HistoryOperationParent {
    readonly timestamp: number;
    readonly chain: boolean;
    readonly position: number;
    readonly text: string;
    readonly cursorPositions: Vec2[];
    readonly isTextSelection: boolean;

    constructor(position: number, text: string, chain: boolean, cursorPositions: Vec2[], isTextSelection: boolean) {
        this.timestamp = Date.now();
        this.position = position;
        this.text = text;
        this.chain = chain;
        this.cursorPositions = cursorPositions;
        this.isTextSelection = isTextSelection;
    }
}

export interface HistoryOperation {
    readonly timestamp: number;
    readonly chain: boolean;
    readonly position: number;
    readonly text: string;
    readonly cursorPositions: Vec2[];
    readonly isTextSelection: boolean;
    handle(cursorOperation: CursorOperation, textController: TextController): void;
}
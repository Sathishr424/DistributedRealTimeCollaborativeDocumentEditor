import {DefaultEditorConfig} from "../../../../interfaces/DefaultEditorConfig";
import {DocumentService} from "../DocumentService";
import {KeyCommand} from "../handler/KeyCommand";

export type CommandMap = Record<string, KeyCommand>;

export const config: DefaultEditorConfig = {
    font: "JetBrains Mono",
    fontSize: 14,
    color: "black",
    canvasWidth: 700,
    canvasHeight: 1100,
    selectionColor: "rgba(0,0,255,0.57)",
    selectionHorizontalPadding: 20,
    lineHeight: 16,
    cursorColor: 'black',
    cursorWidth: 1,
    tabSize: 4,
    mouseInterval: 500,
    canPassthroughCharacters: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890_",
    backgroundColor: "white",
}

export interface Vec2 {
    x: number,
    y: number
}

export interface DocumentSizes {
    cols: number;
    charWidth: number
    height: number;
    rows: number;
}

export interface HistoryOperation {
    timestamp: number;
    chain: boolean;
    position: number;
    text: string;
    handle(service: DocumentService): void;
}

export class EditorOperation {
    protected service: DocumentService;

    constructor(service: DocumentService) {
        this.service = service;
    }
}